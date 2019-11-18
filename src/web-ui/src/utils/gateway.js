import request from "./request";

export default {
  detectLabels(image) {
    return request("/labels/detect", "post", { image });
  }
};
