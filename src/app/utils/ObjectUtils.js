export function   extend(object, overrides) {
  object = object ? object : {};
  let mergeObject = {};

  Object.keys(object).forEach((currentKey) => {
    // Arrays and null are also objects
    // Recursive call to next level
    if (this.isObject(object[currentKey]) && overrides && overrides[currentKey]) {
      mergeObject[currentKey] = this.extend(object[currentKey], overrides[currentKey]);
    } else {
      if (overrides && overrides[currentKey]) {
        mergeObject[currentKey] = overrides[currentKey];
      } else {
        mergeObject[currentKey] = object[currentKey];
      }
    }
  });

  // Overrides not defined in object are immediately added.
  if (overrides && typeof (overrides) === "object" && !Array.isArray(overrides)) {
    this.diff(overrides, object).forEach(function(currentDiff) {
      mergeObject[currentDiff] = overrides[currentDiff];
    });
  }

  return mergeObject;
}
