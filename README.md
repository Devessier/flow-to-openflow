# flow-to-openflow

Generate an OpenFlow JSON from a list of nodes and edges, like the one outputted by React Flow.

## Installation

```bash
npm install @devessier/flow-to-openflow
```

## Usage

```ts
import { buildFlowsFromNodesAndEdges } from '@devessier/flow-to-openflow';

const flowResult = buildFlowsFromNodesAndEdges({
  nodes: [
    {
      id: "node-1",
      type: "input",
      properties: [
        {
          name: "agent_email",
          type: "string",
        },
      ],
    },
    {
      id: "node-2",
      type: "action",
      actionName: "Send email",
      inputs: [
        {
          parameter: "email",
          expression: "flow_input.agent_email",
        },
      ],
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
    },
  ],
});

console.log(flowResult);
// {
//   "flow": {
//     "description": "",
//     "schema": {
//       "$schema": "https://json-schema.org/draft/2020-12/schema",
//       "properties": {
//         "agent_email": {
//           "description": "",
//           "type": "string",
//         },
//       },
//       "required": [],
//       "type": "object",
//     },
//     "summary": "",
//     "value": {
//       "modules": [
//         {
//           "id": "node-2",
//           "value": {
//             "input_transforms": {
//               "email": {
//                 "expr": "flow_input.agent_email",
//                 "type": "javascript",
//               },
//             },
//             "path": "Send email",
//             "type": "script",
//           },
//         },
//       ],
//     },
//   },
//   "ok": true,
// }
```
