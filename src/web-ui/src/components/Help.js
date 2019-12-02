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
    Alternatively, if you have a large data set, you can use{" "}
    <a
      href="https://aws.amazon.com/sagemaker/groundtruth"
      target="_blank"
      rel="noopener noreferrer"
    >
      Amazon SageMaker Ground Truth
    </a>{" "}
    to efficiently label your images at scale.
    <br />
    <br />
    The Console allows creation and management of projects, necessary for using
    this demo. If you prefer using the AWS CLI, consult the next section
    ("Managing Projects with the AWS CLI").
    <br />
    <br />
    To manage users, you can use the{" "}
    <a
      href="https://console.aws.amazon.com/cognito/users"
      target="_blank"
      rel="noopener noreferrer"
    >
      Cognito Users Pool console
    </a>
    .<h2>Managing Projects with the AWS CLI</h2>
    <h4>1. Setup S3 bucket policies for Rekognition</h4>
    Amazon Rekognition will need to be able to read and write to Amazon S3
    during the training. The following bucket policy is an example you can use
    to grant Rekognition access to bucket where your manifest file and training
    data are stored:
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
    Similarly, the following bucket policy is an example you can use for buckets
    where the output of the model training will be written:
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
      This operation requires you to have permissions to perform the
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
    The "CreateProjectVersion" action is used to create a new version of a model
    and begin training. Models are managed as part of an Amazon Rekognition
    Custom Labels project. You can specify one training dataset and one testing
    dataset.
    <br />
    You can specify one training dataset and one testing dataset.
    <br />
    Training may take several hours to complete, after which the status will
    transition to "TRAINING_COMPLETE" (to consult the current state of the model
    training, navigate to the "Project Summary" tab of this demo). When on this
    stage, the model will be ready to be used. <br />
    <br />
    <i>
      This operation requires you to have permissions to perform the
      rekognition:CreateProjectVersion action.
      <br />
      You also need the input/output Amazon S3 Buckets and the solution stack to
      be deployed in the same region (in this case, {REGION}).
    </i>
    <br />
    <br />
    If you are using the AWS CLI, run:
    <pre>
      <code>
        aws rekognition create-project-version --project-arn "YOUR_PROJECT_ARN"
        --version-name VERSION_NAME --output-config '
        {JSON.stringify({
          S3Bucket: "OUTPUT_BUCKET",
          S3KeyPrefix: "OUTPUT_BUCKET_PREFIX"
        })}
        ' --training-data '
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
        ' --testing-data '
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
    <h4>4. Running the model</h4>
    The "StartProjectVersion" action allows to start running a version of a
    model. <br />
    Starting a model takes a while to complete, after that its status will
    transit to "RUNNING" (to consult the current state of the model, navigate to
    the "Project Summary" tab of this demo). <br /> Once the model is running,
    you can detect custom labels in new images by navigating to the "Test your
    models" tab of this demo. <br />
    <br />
    When performing the "StartProjectVersion" action, you need to specify the
    minimum number of inference units to use. A single inference unit represents
    1 hour of processing and can support up to 5 Transactions per Second (TPS).
    Use a higher number to increase the TPS throughput of your model. You are
    charged for the number of inference units that you use.
    <br />
    <br />
    <b>
      NOTE: You are charged for the amount of time that the model is running. To
      stop a running model, consult the next section ("Stopping a running
      model").
    </b>
    <br />
    <br />
    <i>
      This operation requires you to have permissions to perform the
      rekognition:StartProjectVersion action.
    </i>
    <br />
    <br />
    If you are using the AWS CLI, run:
    <pre>
      <code>
        aws rekognition start-project-version --project-version-arn
        YOUR_PROJECT_VERSION_ARN --min-inference-units MIN_INFERENCE_UNITS
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
      This operation requires you to have permissions to perform the
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
