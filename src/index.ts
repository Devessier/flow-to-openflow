import { BranchOne, FlowModule, FlowValue } from "../windmill/gen";

type Node = {
  id: string;
} & (
  | {
      type: "action";
      actionName: string;
      inputs: Array<{ parameter: string; expression: string }>;
    }
  | {
      type: "condition";
      summary?: string;
      conditions: Array<{ id: string; label: string; expression: string }>;
    }
  | {
      type: "input";
      properties: Array<{
        name: string;
        type: string;
        description?: string;
        required?: boolean;
      }>;
    }
);

interface Edge {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
}

type FlowNode = Node;
type FlowEdge = Edge;

function findNextNode({
  currentNode,
  nodes,
  edges,
}: {
  currentNode: FlowNode;
  nodes: FlowNode[];
  edges: FlowEdge[];
}): { ok: true; nextNode: FlowNode } | { ok: false } {
  const edgeFromNode = edges.find((e) => e.source === currentNode.id);
  if (edgeFromNode === undefined) {
    return { ok: false };
  }

  const targetNode = nodes.find((n) => n.id === edgeFromNode.target);
  if (targetNode === undefined) {
    return { ok: false };
  }

  return {
    ok: true,
    nextNode: targetNode,
  };
}

function addNodesToModuleList({
  initialNode,
  edges,
  nodes,
  modules,
}: {
  initialNode: FlowNode;
  nodes: FlowNode[];
  edges: FlowEdge[];
  modules: FlowModule[];
}) {
  switch (initialNode.type) {
    case "input": {
      break;
    }
    case "action": {
      const formattedModule: FlowModule = {
        id: initialNode.id,
        value: {
          type: "script",
          path: initialNode.actionName!,
          input_transforms: Object.fromEntries(
            initialNode.inputs.map(({ parameter, expression }) => [
              parameter,
              {
                type: "javascript",
                expr: expression,
              },
            ])
          ),
        },
      };

      modules.push(formattedModule);

      break;
    }
    case "condition": {
      const defaultCaseEdge = edges.find(
        (edge) =>
          edge.source === initialNode.id && edge.sourceHandle === "default"
      );
      const defaultModules: FlowModule[] = [];

      if (defaultCaseEdge !== undefined) {
        const defaultCaseFirstNode = nodes.find(
          (node) => node.id === defaultCaseEdge.target
        );
        if (defaultCaseFirstNode === undefined) {
          break;
        }

        addNodesToModuleList({
          initialNode: defaultCaseFirstNode,
          edges,
          nodes,
          modules: defaultModules,
        });
      }

      const branches: BranchOne["branches"] = [];

      for (const condition of (initialNode as FlowNode & { type: "condition" })
        .conditions) {
        const branchEdge = edges.find(
          (edge) =>
            edge.source === initialNode.id && edge.sourceHandle === condition.id
        );
        if (branchEdge === undefined) {
          break;
        }

        const branchFirstNode = nodes.find(
          (node) => node.id === branchEdge.target
        );
        if (branchFirstNode === undefined) {
          break;
        }

        const branchModules: FlowModule[] = [];

        addNodesToModuleList({
          initialNode: branchFirstNode,
          edges,
          nodes,
          modules: branchModules,
        });

        branches.push({
          summary: condition.label,
          expr: condition.expression,
          modules: branchModules,
        });
      }

      const conditionModule: FlowModule = {
        id: initialNode.id,
        summary: initialNode.summary ?? "",
        value: {
          type: "branchone",
          default: defaultModules,
          branches,
        },
      };

      modules.push(conditionModule);

      break;
    }
    default: {
      break;
    }
  }

  switch (initialNode.type) {
    case "condition": {
      /**
       * No other node can be put after a condition.
       * Nodes are necessarily put under either the default branch or a specfic branch.
       */
      return modules;
    }
    default: {
      const nextNodeResult = findNextNode({
        currentNode: initialNode,
        edges,
        nodes,
      });
      if (nextNodeResult.ok === false) {
        return modules;
      }

      return addNodesToModuleList({
        initialNode: nextNodeResult.nextNode,
        edges,
        nodes,
        modules,
      });
    }
  }
}

export function buildFlowsFromNodesAndEdges({
  edges,
  nodes,
}: {
  edges: FlowEdge[];
  nodes: FlowNode[];
}):
  | {
      ok: true;
      flow: {
        summary: string;
        description: string;
        schema: unknown;
        value: FlowValue;
      };
    }
  | { ok: false; err: string } {
  const startNode = nodes.find((n) => n.type === "input") as FlowNode & {
    type: "input";
  };
  if (startNode === undefined) {
    return {
      ok: false,
      err: "No start node",
    };
  }

  return {
    ok: true,
    flow: {
      summary: "",
      description: "",
      value: {
        modules: addNodesToModuleList({
          initialNode: startNode,
          edges,
          nodes,
          modules: [],
        }),
      },
      schema: {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        type: "object",
        properties: Object.fromEntries(
          startNode.properties.map((property) => [
            property.name,
            {
              description: property.description ?? "",
              type: property.type.toLowerCase(),
            },
          ])
        ),
        required: startNode.properties
          .filter((property) => property.required === true)
          .map((property) => property.name),
      },
    },
  };
}
