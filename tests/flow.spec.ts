import { test } from "@japa/runner";
import { buildFlowsFromNodesAndEdges } from "../src";

test("Generate input, actions and conditions", ({ expect }) => {
  const flowResult = buildFlowsFromNodesAndEdges({
    nodes: [
      {
        id: "node-1",
        type: "input",
        data: {
          flowSummary: "test flow",
          flowDescription: "flow description",
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
              type: "javascript",
              expr: "flow_input.agent_email",
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
              type: "javascript",
              expr: "flow_input.agent_phone_number",
            },
            {
              parameter: "static_input",
              type: "static",
              value: `"0606060606"`,
            },
          ],
        },
      },
      {
        id: "node-5",
        type: "branchall",
        data: {
          branches: [{ id: "cond-5-6", summary: "First parallel branch" }, { id: "cond-5-7", summary: "Second parallel branch" }],
          parallel: true
        },
      },
      {
        id: "node-6",
        type: "action",
        data: {
          actionName: "Send email",
          inputs: [
            {
              parameter: "email",
              type: "javascript",
              expr: "flow_input.agent_email",
            },
          ],
        },
      },
      {
        id: "node-7",
        type: "action",
        data: {
          actionName: "Send email",
          inputs: [
            {
              parameter: "email",
              type: "javascript",
              expr: "flow_input.agent_email",
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
        id: "edge-2",
        source: "node-2",
        target: "node-3",
      },
      {
        id: "edge-3",
        source: "node-3",
        sourceHandle: "cond-3-1",
        target: "node-4",
      },
      {
        id: "edge-4",
        source: "node-4",
        target: "node-5",
      },
      {
        id: "edge-5",
        source: "node-5",
        sourceHandle: "cond-5-6",
        target: "node-6",
      },
      {
        id: "edge-6",
        source: "node-5",
        sourceHandle: "cond-5-7",
        target: "node-7",
      },
    ],
  });

  expect(flowResult).toMatchInlineSnapshot(`
    [
      {
        "description": "flow description",
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
        "summary": "test flow",
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
                            "static_input": {
                              "type": "static",
                              "value": "\\"0606060606\\"",
                            },
                          },
                          "path": "Send SMS",
                          "type": "script",
                        },
                      },
                      {
                        "id": "node-5",
                        "value": {
                          "branches": [
                            {
                              "modules": [
                                {
                                  "id": "node-6",
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
                              ],
                              "skip_failure": undefined,
                              "summary": "First parallel branch",
                            },
                            {
                              "modules": [
                                {
                                  "id": "node-7",
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
                              ],
                              "skip_failure": undefined,
                              "summary": "Second parallel branch",
                            },
                          ],
                          "parallel": true,
                          "type": "branchall",
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
