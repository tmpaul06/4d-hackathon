export function   isObject(target) {
  // Exclude dates, null, arrays
  return (target !== undefined) && (target !== null) && (typeof target === "object") && (Object.prototype.toString.call(target) === "[object Object]");
}

export function   extend(object, overrides) {
  object = object ? object : {};
  let mergeObject = {};

  Object.keys(object).forEach((currentKey) => {
    // Arrays and null are also objects
    // Recursive call to next level
    if (isObject(object[currentKey]) && overrides && overrides[currentKey]) {
      mergeObject[currentKey] = extend(object[currentKey], overrides[currentKey]);
    } else {
      if (overrides && overrides[currentKey] !== undefined) {
        mergeObject[currentKey] = overrides[currentKey];
      } else {
        mergeObject[currentKey] = object[currentKey];
      }
    }
  });

  // Overrides not defined in object are immediately added.
  if (overrides && typeof (overrides) === "object" && !Array.isArray(overrides)) {
    diff(overrides, object).forEach(function(currentDiff) {
      mergeObject[currentDiff] = overrides[currentDiff];
    });
  }

  return mergeObject;
}


export function diff(obj1, obj2) {
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  let result = [];
  keys1.forEach(function(key1) {
    if (keys2.indexOf(key1) === -1) {
      result.push(key1);
    }
  });
  return result;
}

