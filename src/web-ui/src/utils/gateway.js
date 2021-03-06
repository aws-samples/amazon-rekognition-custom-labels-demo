import request from "./request";

const gateway = {
  detectCustomLabels(projectVersionArn, image) {
    return request("DetectCustomLabels", {
      Image: { Bytes: image },
      ProjectVersionArn: projectVersionArn,
    });
  },

  describeProjects() {
    return request("DescribeProjects");
  },

  describeProjectVersions(projectArn) {
    return request("DescribeProjectVersions", { ProjectArn: projectArn });
  },

  startProjectVersion(projectVersionArn, minInferenceUnits) {
    return request("StartProjectVersion", {
      ProjectVersionArn: projectVersionArn,
      MinInferenceUnits: minInferenceUnits,
    });
  },

  stopProjectVersion(projectVersionArn) {
    return request("StopProjectVersion", {
      ProjectVersionArn: projectVersionArn,
    });
  },
};

export default gateway;
