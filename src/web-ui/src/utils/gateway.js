import request from "./request";

export default {
  detectCustomLabels(projectVersionArn, image) {
    return request("DetectLabels", {
      Image: { Bytes: image },
      ProjectVersionArn: projectVersionArn
    });
  },

  detectLabels(image) {
    return request("DetectLabels", {
      Attributes: ["ALL"],
      Image: { Bytes: image }
    });
  },

  describeProjects() {
    return request("DescribeProjects");
  },

  describeProjectVersions(projectArn) {
    return request("DescribeProjectVersions", { ProjectArn: projectArn });
  }
};
