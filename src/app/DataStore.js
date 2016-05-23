class DataStore {

  constructor() {
    this.cache = {
      global: {
        WIDTH: 600,
        HEIGHT: 400
      },
      layers: [ {
        id: 1,
        stacks: [ {
          id: 1,
          groups: []
        } ]
      } ]
    };
    this.callback = function() {};
  }

  get(path = []) {
    let data = this.cache;
    for(let i = 0, len = path.length; i < len; i++) {
      if (data[path[i]] !== undefined) {
        data = data[path[i]];
      } else {
        data = undefined;
        break;
      }
    }
    return data;
  }

  recursiveSet(data, path, value) {
    let key = path[0];
    if (path.length === 1) {
      data[key] = value;
      return data;
    }
    if (data[key] !== undefined) {
      let result = this.recursiveSet(data[key], path.slice(1), value);
      data[key] = result;
    } else {
      return data;
    }
    return data;
  }

  set(path = [], value) {
    this.cache = this.recursiveSet(this.cache, path, value);
    this.callback([ this.cache.layers[path[1]] ]);
    // let data = this.cache;
    // let len = path.length;
    // let cacheFragments = [];
    // for(let i = 0; i < len; i++) {
    //   if (i === len - 1) {
    //     // Work backwards
    //     if (data) {
    //       data[path[len - 1]] = value;
    //       // for (let j = cacheFragments.length - 1; j > 0; j--) {
                 
    //       // }
    //     }
    //     break;
    //   }
    //   let key = path[i];
    //   if (data[key] !== undefined) {
    //     cacheFragments.push(data);
    //     data = data[key];
    //   } else {
    //     data = undefined;
    //     break;
    //   }
    // }
    // if (data) {
    //   data[path[len - 1]] = value;
    //   this.callback();
    // }
  }
};

export default new DataStore();