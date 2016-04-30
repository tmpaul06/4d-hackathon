import request from "superagent";
import { ModelRangesEndPoint, SegmentsEndPoint } from "constants/Endpoints";

function handleResponse(error, response, successCallback,  failureCallback) {
  if (error) {
    failureCallback(error);
  } else {
    successCallback(response.body);
  }
}

class api {
  getModelRanges(successCallback,failureCallback) {
    request.get(ModelRangesEndPoint.root)
    .accept("application/json")
    .end((error, response) => {
      handleResponse(error, response, successCallback,  failureCallback);
    });
  }
  getSegments(successCallback,  failureCallback) {
    request.get(SegmentsEndPoint.root)
    .accept("application/json")
    .end((error, response) => {
      handleResponse(error, response, successCallback,  failureCallback);
    });
  }
}

export default new api();
