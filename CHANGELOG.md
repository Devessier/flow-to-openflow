# @devessier/flow-to-openflow

## 0.0.7

### Patch Changes

- 5055323: Let consumers set whether action inputs are static or dynamic javascript expressions

## 0.0.6

### Patch Changes

- f1a7537: Put nodes payload in a `data` property.

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

## 0.0.5

### Patch Changes

- 3958c1b: Return all flows

## 0.0.4

### Patch Changes

- 53b0beb: Support description/summary and required input properties

## 0.0.3

### Patch Changes

- 309fb84: Set publishConfig in package.json

## 0.0.2

### Patch Changes

- da58cb9: Add missing fields in package.json to publish module

## 0.0.1

### Patch Changes

- 45f6629: First version of the library
