import request from "./request";

export default {
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
