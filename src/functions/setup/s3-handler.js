const mime = require("mime-types");
const unzip = require("unzipper");

const {
  COGNITO_IDENTITY_POOL,
  COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID,
  FROM_BUCKET,
  CREATE_CLOUDFRONT_DISTRIBUTION,
  REGION,
  TO_BUCKET,
  VERSION
} = process.env;

const CONFIG_FILENAME = "settings.js";
const SOLUTION_KEY = `amazon-rekognition-custom-labels-demo/v${VERSION}`;
const FRONTEND_PATH = `${SOLUTION_KEY}/frontend.zip`;

const ACL =
  CREATE_CLOUDFRONT_DISTRIBUTION == "true" ? "private" : "public-read";

module.exports = s3 => {
  const deleteFile = params => s3.deleteObject(params).promise();
  const listFiles = params => s3.listObjects(params).promise();
  const upload = params => s3.upload(params).promise();

  return {
    copyFiles: () =>
      unzip.Open.s3(s3, { Bucket: FROM_BUCKET, Key: FRONTEND_PATH })
        .then(directory => directory.files.filter(x => x.type !== "Directory"))
        .then(files =>
          files.map(file =>
            upload({
              ACL,
              Body: file.stream(),
              Bucket: TO_BUCKET,
              ContentType: mime.lookup(file.path) || "application/octet-stream",
              Key: file.path
            })
          )
        )
        .then(ps => Promise.all(ps)),

    removeFiles: () =>
      listFiles({
        Bucket: TO_BUCKET
      }).then(result =>
        Promise.all(
          result.Contents.map(file => file.Key).map(file =>
            deleteFile({
              Bucket: TO_BUCKET,
              Key: file
            })
          )
        )
      ),

    writeSettings: () =>
      s3
        .putObject({
          ACL,
          Bucket: TO_BUCKET,
          Key: CONFIG_FILENAME,
          Body: `window.rekognitionSettings = ${JSON.stringify({
            cognitoIdentityPool: COGNITO_IDENTITY_POOL,
            cognitoUserPoolId: COGNITO_USER_POOL_ID,
            cognitoUserPoolClientId: COGNITO_USER_POOL_CLIENT_ID,
            region: REGION
          })};`
        })
        .promise()
  };
};
