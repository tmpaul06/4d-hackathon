import { EventEmitter } from "events";
import api from "apis/Api";

let _modelRanges = [],
    _segments = []

const CHANGE_EVENT = "changeEvent";
const CHANGE_INFO = "change info";
const CHANGE_MODEL_RANGES = "change model ranges";
const CHANGE_SEGMENTS = "change segments";

function normalizeData(data) {
  let normalizedData = data;
  let depthIndexHash = {};
  function addIds(idData, depth = 0) {
    if (depthIndexHash[depth] === undefined) {
      depthIndexHash[depth] = 0;
    }
    idData.forEach((datum, i) => {
      depthIndexHash[depth] = depthIndexHash[depth] + 1;
      datum.id = depth + "_" + depthIndexHash[depth];
      if (datum.children) {
        addIds(datum.children, depth + 1);
      }
    });
  }
  addIds(normalizedData);
  return normalizedData;
}

class Store extends EventEmitter {
  constructor() {
    super();
  }

  modelRangesResultResponse(data) {
    _modelRanges = data;
    this.emitModelRangesInfo();
  }

  getModelRangesResult() {
    if (_modelRanges.length !== 0) {
      return _modelRanges;
    } else {
      api.getModelRanges(this.modelRangesResultResponse.bind(this), () => []);
    }
  }

  segmentsResultResponse(data) {
    _segments[0] = data;
    _segments = normalizeData(_segments);
    this.emitSegmentsInfo();
  }

  getSegmentsResult() {
    if (_segments.length !== 0) {
      return _segments;
    } else {
      api.getSegments(this.segmentsResultResponse.bind(this), () => []);
    }
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  emitInfoChange() {
    this.emit(CHANGE_INFO);
  }

  emitModelRangesInfo(callback) {
    this.emit(CHANGE_MODEL_RANGES, callback);
  }

  emitSegmentsInfo(callback) {
    this.emit(CHANGE_SEGMENTS, callback);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  addInfoChangeListener(callback) {
    this.on(CHANGE_INFO, callback);
  }

  addModelRangesInfoListener(callback) {
    this.on(CHANGE_MODEL_RANGES, callback);
  }

  addSegmentsInfoListener(callback) {
    this.on(CHANGE_SEGMENTS, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  removeInfoChangeListener(callback) {
    this.removeListener(CHANGE_INFO, callback);
  }

  removeModelRangesInfoListener(callback) {
    this.removeListener(CHANGE_MODEL_RANGES, callback);
  }

  removeSegmentsInfoListener(callback) {
    this.removeListener(CHANGE_SEGMENTS, callback);
  }

}

export default new Store();
