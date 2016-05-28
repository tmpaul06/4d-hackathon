function m(a, b) {
  return "M " + a + "," + b;
}

function l(a, b) {
  return " L" + a + "," + b;
}

export function getCoverShape(width, height, h1, h2) {
  // Normal state
  let normalPath = m(0, height) + l(width, height) + l(width, h2) +
    l(0, h1) + " z";
  // Animated state
  let hMin = Math.min(h1, h2);
  let finalPath = m(0, height) + l(width, height) + l(width, hMin) +
    l(0, hMin) + " z";
  return {
    normal: normalPath,
    final: finalPath
  };
}