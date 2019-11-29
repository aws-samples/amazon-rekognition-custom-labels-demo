import React from "react";

const REGION = window.rekognitionSettings.region;

export default () => (
  <div className="intro tab-content">
    <h2>Amazon Rekognition Custom Labels</h2>
    Amazon Rekognition Custom Labels is a new feature of Amazon Rekognition that
    enables customers to build their own specialized machine learning (ML) based
    image analysis capabilities to detect unique objects and scenes integral to
    their specific use case. Instead of having to train a model from scratch,
    which requires specialized machine learning expertise and millions of
    high-quality labeled images, customers can now use Amazon Rekognition Custom
    Labels to achieve state-of-the-art performance for their unique image
    analysis needs.
    <h2>Getting started</h2>
    The{" "}
    <a
      href="https://console.aws.amazon.com/rekognition"
      target="_blank"
      rel="noopener noreferrer"
    >
      Rekognition Custom Labels console
    </a>{" "}
    provides a visual interface to make labeling your images fast and simple.
    The interface allows you to apply a label to the entire image or to identify
    and label specific objects in images using bounding boxes with a simple
    click-and-drag interface.
    <br />
    <br />
    Alternately, if you have a large data set, you can use{" "}
    <a
      href="https://aws.amazon.com/sagemaker/groundtruth"
      target="_blank"
      rel="noopener noreferrer"
    >
      Amazon SageMaker Ground Truth
    </a>{" "}
    to efficiently label your images at scale.
    <h4>1. Setup S3 bucket policies for Rekognition</h4>
    Amazon Rekognition will need to be able to read and write to Amazon S3
    during the training. This is an example policy for buckets in need of read
    access:
    <div className="prettify-json">
      {JSON.stringify(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "AWSRekognitionS3AclBucketRead",
              Effect: "Allow",
              Principal: {
                Service: "rekognition.amazonaws.com"
              },
              Action: ["s3:GetBucketAcl", "s3:GetBucketLocation"],
              Resource: "arn:aws:s3:::my-read-bucket"
            },
            {
              Sid: "AWSRekognitionS3GetBucket",
              Effect: "Allow",
              Principal: {
                Service: "rekognition.amazonaws.com"
              },
              Action: [
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:GetObjectVersion",
                "s3:GetObjectTagging"
              ],
              Resource: "arn:aws:s3:::my-read-bucket/*"
            }
          ]
        },
        undefined,
        2
      )}
    </div>
    This is an example policy for buckets in need of write access:
    <div className="prettify-json">
      {JSON.stringify(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "AWSRekognitionS3ACLBucketWrite",
              Effect: "Allow",
              Principal: {
                Service: "rekognition.amazonaws.com"
              },
              Action: "s3:GetBucketAcl",
              Resource: "arn:aws:s3:::my-write-bucket"
            },
            {
              Sid: "AWSRekognitionS3PutObject",
              Effect: "Allow",
              Principal: {
                Service: "rekognition.amazonaws.com"
              },
              Action: "s3:PutObject",
              Resource: "arn:aws:s3:::my-write-bucket/my-write-prefix/*",
              Condition: {
                StringEquals: {
                  "s3:x-amz-acl": "bucket-owner-full-control"
                }
              }
            }
          ]
        },
        undefined,
        2
      )}
    </div>
    <h4>2. Create a new Custom Labels Project</h4>
    A project is a logical grouping of resources (images, Labels, models) and
    operations (training, evaluation and detection). <br /> <br />
    <i>
      This operation requires permissions to perform the
      rekognition:CreateProject action.
    </i>
    <br />
    <br />
    If you are using the AWS CLI, run:
    <pre>
      <code>
        aws rekognition create-project --project-name YOUR_PROJECT_NAME
      </code>
    </pre>
    Output:
    <div className="prettify-json">
      {JSON.stringify(
        {
          ProjectArn: `arn:aws:rekognition:${REGION}:123456123456:project/YOUR_PROJECT_NAME/1234561234567`
        },
        undefined,
        2
      )}
    </div>
    <h4>3. Create a new Custom Labels Project Version</h4>
    The "CreateProjectVersion" action is for creating a new version of a model
    and begin training. Models are managed as part of an Amazon Rekognition
    Custom Labels project. <br /> You can specify one training dataset and one
    testing dataset.
    <br />
    Training takes a while to complete, after that its status will transit to
    "TRAINING_COMPLETE" (to check the current state of the model, navigate to
    the "Project Summary" tab of this demo). When on this stage, the model will
    be ready to be started. <br />
    <br />
    <i>
      This operation requires permissions to perform the
      rekognition:CreateProjectVersion action.
      <br />
      In addition to it, you need the Amazon S3 Buckets and this demo to be in
      the same region (in this case, {REGION}).
    </i>
    <br />
    <br />
    If you are using the AWS CLI, run:
    <pre>
      <code>
        aws rekognition create-project-version \<br /> --project-arn
        "YOUR_PROJECT_ARN" \<br /> --version-name VERSION_NAME \<br />{" "}
        --output-config '
        {JSON.stringify({
          S3Bucket: "OUTPUT_BUCKET",
          S3KeyPrefix: "OUTPUT_BUCKET_PREFIX"
        })}
        ' \<br /> --training-data '
        {JSON.stringify({
          Assets: [
            {
              GroundTruthManifest: {
                S3Object: {
                  Bucket: "MANIFEST_BUCKET",
                  Name: "MANIFEST_OBJECT"
                }
              }
            }
          ]
        })}
        ' \<br /> --testing-data '
        {JSON.stringify({
          Assets: [
            {
              GroundTruthManifest: {
                S3Object: {
                  Bucket: "MANIFEST_BUCKET",
                  Name: "MANIFEST_OBJECT"
                }
              }
            }
          ]
        })}
        '
      </code>
    </pre>
    Output:
    <div className="prettify-json">
      {JSON.stringify(
        {
          ProjectVersionArn: `arn:aws:rekognition:${REGION}:123456123456:project/YOUR_PROJECT_NAME/version/VERSION_NAME/1234561234567`
        },
        undefined,
        2
      )}
    </div>
    <h4>4. Start the model</h4>
    The "StartProjectVersion" action allows to start running a version of a
    model. <br />
    Starting a model takes a while to complete, after that its status will
    transit to "RUNNING" (to check the current state of the model, navigate to
    the "Project Summary" tab of this demo). <br /> Once the model is running,
    you can detect custom labels in new images by navigating to the "Test your
    models" tab of this demo. <br />
    <br />
    You need to specify the minimum number of inference units to use. A single
    inference unit represents 1 hour of processing and can support up to 5
    Transactions per Second (TPS). Use a higher number to increase the TPS
    throughput of your model. You are charged for the number of inference units
    that you use.
    <br />
    <br />
    <b>
      NOTE: You are charged for the amount of time that the model is running. To
      stop a running model, check the next section ("Stopping a running model").
    </b>
    <br />
    <br />
    <i>
      This operation requires permissions to perform the
      rekognition:StartProjectVersion action.
    </i>
    <br />
    <br />
    If you are using the AWS CLI, run:
    <pre>
      <code>
        aws rekognition start-project-version \<br /> --project-version-arn
        YOUR_PROJECT_VERSION_ARN \<br /> --min-inference-units
        MIN_INFERENCE_UNITS
      </code>
    </pre>
    Output:
    <div className="prettify-json">
      {JSON.stringify(
        {
          Status: "STARTING_HOSTING"
        },
        undefined,
        2
      )}
    </div>
    <h2>Stopping a running model</h2>
    Stops a running model. The operation might take a while to complete.
    <br />
    <br />
    <i>
      This operation requires permissions to perform the
      rekognition:StopProjectVersion action.
    </i>
    <br />
    <br />
    If you are using the AWS CLI, run:
    <pre>
      <code>
        aws rekognition stop-project-version --project-version-arn
        YOUR_PROJECT_VERSION_ARN
      </code>
    </pre>
    Output:
    <div className="prettify-json">
      {JSON.stringify(
        {
          Status: "STOPPING"
        },
        undefined,
        2
      )}
    </div>
  </div>
);
