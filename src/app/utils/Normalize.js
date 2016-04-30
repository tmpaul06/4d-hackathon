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

function generateKeyValuePairs() {
  let keys = [ "Total anticoagulant Rx", "NOAC %", "NOAC SOV", "log(#Rep visits)", "NOAC % variance", "Others" ];
  let obj = {};
  for(let key of keys) {
    obj[key] = generateRandomNumber(20, 50);
  }
  return obj;
}

export default {
  generateBarObjectFromNode(node, i) {
    let bar = {};
    bar[node.name] = generateKeyValuePairs();
    bar.color = node.color;
    bar.id = node.id;

    return bar;
  },

  normalizeData(data) {
    let normalizedData = data;
    let depthIndexHash = {};

    function addIds(idData, depth = 0) {
      if (depthIndexHash[depth] === undefined) {
        depthIndexHash[depth] = 0;
      }
      idData.forEach((datum, i) => {
        depthIndexHash[depth] = depthIndexHash[depth] + 1;
        datum.id = depth + "_" + depthIndexHash[depth];
        datum.color = getColor(depthIndexHash[depth] + depth + 7);
        if (datum.children) {
          addIds(datum.children, depth + 1);
        }
      });
    }

    addIds(normalizedData);
    return normalizedData;
  }
};
