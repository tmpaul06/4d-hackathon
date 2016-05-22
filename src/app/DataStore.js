class DataStore {

  constructor() {
    this.cache = {
      global: {},
      layers: [ {
        id: 1,
        stacks: [ {
          id: 1,
          groups: []
        } ]
      } ]
    };
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
};

export default new DataStore();