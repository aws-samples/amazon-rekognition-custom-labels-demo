import request from "./request";

export default {
  detectCustomLabels(projectVersionArn, image) {
    return request("DetectCustomLabels", {
      Image: { Bytes: image },
      ProjectVersionArn: projectVersionArn
    });
  },

  describeProjects() {
    return request("DescribeProjects");
  },

  describeProjectVersions(projectArn) {
    return request("DescribeProjectVersions", { ProjectArn: projectArn });
  }
};
