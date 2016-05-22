const COLORS = [
  "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#4CAF50",
  "#00BCD4", "#009688", "#8BC34A", "#558B2F", "#B6981E", "#FF9800", "#FF5722", "#795548", "#607D8B",
  "#38DAE9", "#099D13", "#FF9902", "#673BB7", "#DC3BAB", "#607D8B", "#9C27B0", "#673AB7", "#3F51B5",
  "#03A9F4", "#795548", "#607D8B", "#9C27B0", "#673AB7", "#3F51B5"
];

function getColor(i) {
  let colorIndex = i % COLORS.length;
  return COLORS[colorIndex];
}

function generateRandomNumber(min, max) {
  return Math.round(Math.random() * (max -  min + 1)) + min;
}