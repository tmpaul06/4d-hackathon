export function drawLayer(ctx, timeElapsed, stacks) {
  // Each stack consists of multiple shape groups.
  // Use the shape group's renderToCanvas function
  // to render it to canvas. If any variable bindings
  // are declared, it will be resolved using getByPath
  // function
  stacks.forEach(function(stack) {
    stack.groups.forEach(function(group) {
      group.renderToCanvas(ctx, timeElapsed);
    });
  });
}