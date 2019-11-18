import Amplify, { API } from "aws-amplify";

const settings = window.rekognitionSettings || {};
const region = settings.region || "eu-west-1";

Amplify.configure({
  Auth: { identityPoolId: settings.cognitoIdentityPool, region },
  API: {
    endpoints: [{ name: "apiGateway", endpoint: settings.apiGateway, region }]
  }
});

export default (url, method, data) =>
  API[method || "get"]("apiGateway", url, {
    body: data || undefined,
    headers: { "Content-Type": "application/json" }
  });
