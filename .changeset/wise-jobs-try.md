---
"@devessier/flow-to-openflow": patch
---

Put nodes payload in a `data` property.

Use `input` nodes to define the `summary` and the `description` fields of the flow through `flowSummary` and `flowDescription` properties:

```ts
const node = {
  id: "id",
  type: "input",
  data: {
    flowSummary: "summary", // mandatory
    flowDescription: "",
    // ...
  },
};
```
