import { test } from "@japa/runner";
import { buildFlowsFromNodesAndEdges } from "../src";

test("Generate input, actions and conditions", ({ expect }) => {
  const flowResult = buildFlowsFromNodesAndEdges({
    nodes: [
      {
        id: "node-1",
        type: "input",
        data: {
          properties: [
            {
              name: "agent_name",
              type: "string",
            },
            {
              name: "agent_email",
              type: "string",
            },
            {
              name: "agent_phone_number",
              type: "string",
            },
          ],
        },
      },
      {
        id: "node-2",
        type: "action",
        data: {
          actionName: "Send email",
          inputs: [
            {
              parameter: "email",
              expression: "flow_input.agent_email",
            },
          ],
        },
      },
      {
        id: "node-3",
        type: "condition",
        data: {
          conditions: [
            {
              id: "cond-3-1",
              label: "is admin",
              expression: "flow_input.agent_name === 'admin'",
            },
          ],
        },
      },
      {
        id: "node-4",
        type: "action",
        data: {
          actionName: "Send SMS",
          inputs: [
            {
              parameter: "phone_number",
              expression: "flow_input.agent_phone_number",
            },
          ],
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
      },
      {
        id: "edge-1",
        source: "node-2",
        target: "node-3",
      },
      {
        id: "edge-1",
        source: "node-3",
        sourceHandle: "cond-3-1",
        target: "node-4",
      },
    ],
  });

  expect(flowResult).toMatchInlineSnapshot(`
    [
      {
        "description": "",
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "properties": {
            "agent_email": {
              "description": "",
              "type": "string",
            },
            "agent_name": {
              "description": "",
              "type": "string",
            },
            "agent_phone_number": {
              "description": "",
              "type": "string",
            },
          },
          "required": [],
          "type": "object",
        },
        "summary": "",
        "value": {
          "modules": [
            {
              "id": "node-2",
              "value": {
                "input_transforms": {
                  "email": {
                    "expr": "flow_input.agent_email",
                    "type": "javascript",
                  },
                },
                "path": "Send email",
                "type": "script",
              },
            },
            {
              "id": "node-3",
              "summary": "",
              "value": {
                "branches": [
                  {
                    "expr": "flow_input.agent_name === 'admin'",
                    "modules": [
                      {
                        "id": "node-4",
                        "value": {
                          "input_transforms": {
                            "phone_number": {
                              "expr": "flow_input.agent_phone_number",
                              "type": "javascript",
                            },
                          },
                          "path": "Send SMS",
                          "type": "script",
                        },
                      },
                    ],
                    "summary": "is admin",
                  },
                ],
                "default": [],
                "type": "branchone",
              },
            },
          ],
        },
      },
    ]
  `);
});
