import Amplify, { API } from "aws-amplify";
import { retryWrapper } from "./index";

const settings = window.rekognitionSettings || {};
const region = settings.region || "eu-west-1";

Amplify.configure({
  Auth: { identityPoolId: settings.cognitoIdentityPool, region },
  API: {
    endpoints: [
      {
        name: "rekognitionApi",
        endpoint: settings.baseUrl,
        region,
        service: "rekognition"
      }
    ]
  }
});

export default (endpointName, data) =>
  retryWrapper(() =>
    API.post("rekognitionApi", "", {
      body: data || {},
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": `RekognitionService.${endpointName}`
      }
    })
  );
