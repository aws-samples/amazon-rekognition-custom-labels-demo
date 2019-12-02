## Amazon Rekognition Custom Labels Demo

Amazon Rekognition Custom Labels is a feature of Amazon Rekognition that enables customers to build their own specialized machine learning (ML) based image analysis capabilities to detect unique objects and scenes integral to their specific use case. 

Instead of having to train a model from scratch, which requires specialized machine learning expertise and millions of high-quality labeled images, customers can use Amazon Rekognition Custom Labels to achieve state-of-the-art performance for their unique image analysis needs.

This demo allows you to test Custom Labels with models trained by Amazon Rekognition.

[![Build Status](https://travis-ci.org/aws-samples/amazon-rekognition-custom-labels-demo.svg?branch=master)](https://travis-ci.org/aws-samples/amazon-rekognition-custom-labels-demo)


### Index

* [Architecture](#architecture)
* [Usage](#usage)
  * [Prerequisites](#prerequisites)
  * [Deployment](#deployment)
  * [Accessing and using the Demo](#accessing-and-using-the-demo)
  * [Managing Projects with the AWS CLI](#managing-projects-with-the-aws-cli)
    * [1. Setup S3 bucket policies for Rekognition](#1-setup-s3-bucket-policies-for-rekognition)
    * [2. Create a new Custom Labels Project](#2-create-a-new-custom-labels-project)
    * [3. Create a new Custom Labels Project Version](#3-create-a-new-custom-labels-project-version)
    * [4. Start the model](#4-start-the-model)
  * [Stopping a running model](#stopping-a-running-model)
* [Removing the application](#removing-the-application)
* [Making changes to the code and customization](#making-changes-to-the-code-and-customization)
* [Contributing](#contributing)

### Architecture

The Custom Labels Demo uses [Amazon Rekognition](https://aws.amazon.com/rekognition) for label recognition, [Amazon Cognito](https://aws.amazon.com/cognito) for authenticating the Service Requests, and [Amazon CloudFront](https://aws.amazon.com/cloudfront), [Amazon S3](https://aws.amazon.com/s3), [AWS Amplify](https://aws.amazon.com/amplify), and [React](https://reactjs.org) for the front-end layer.

<img src="docs/amazon-rekognition-1.png" alt="Architecture Diagram" />


After you select an image from your local machine, the frontend app calls the `DetectCustomLabels` action in Amazon Rekognition. To learn more about *DetectCustomLabels* [see the Rekognition documentation](https://docs.aws.amazon.com/rekognition/index.html).


### Usage

#### Prerequisites

To deploy the sample application you will require an AWS account. If you don’t already have an AWS account, create one at <https://aws.amazon.com> by following the on-screen instructions. Your access to the AWS account must have IAM permissions to launch AWS CloudFormation templates that create IAM roles.

To use the sample application you will require a [modern browser](https://caniuse.com/#search=FileReader%20API).

#### Deployment

The demo application is deployed as an [AWS CloudFormation](https://aws.amazon.com/cloudformation) template.

> **Note**  
You are responsible for the cost of the AWS services used while running this sample deployment. There is no additional cost for using this sample. For full details, see the following pricing pages for each AWS service you will be using in this sample. 
> * [Amazon Rekognition](https://aws.amazon.com/rekognition/pricing/)
> * [Amazon S3](https://aws.amazon.com/s3/pricing/)
> * [Amazon Cognito](https://aws.amazon.com/cognito/pricing/)
> * [Amazon CloudFront](https://aws.amazon.com/cloudfront/pricing/)
> * [AWS Lambda](https://aws.amazon.com/lambda/pricing/)
>Prices are subject to change.

1. Deploy the latest CloudFormation template by following the link below for your preferred AWS region:

|Region|Launch Template|
|------|---------------|
|**US East (N. Virginia)** (us-east-1) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-us-east-1.s3.us-east-1.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|
|**US East (Ohio)** (us-east-2) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-us-east-2.s3.us-east-2.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|
|**US West (Oregon)** (us-west-2) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-us-west-2.s3.us-west-2.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|
|**Asia Pacific (Seoul)** (ap-northeast-2) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|
|**Asia Pacific (Sydney)** (ap-southeast-2) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-ap-southeast-2.s3.ap-southeast-2.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|
|**Asia Pacific (Tokyo)** (ap-northeast-1) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-ap-northeast-1.s3.ap-northeast-1.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|
|**EU (Ireland)** (eu-west-1) | [![Launch the CustomLabelsDemo Stack with CloudFormation](docs/deploy-to-aws.png)](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=CustomLabelsDemo&templateURL=https://solution-builders-eu-west-1.s3.eu-west-1.amazonaws.com/amazon-rekognition-custom-labels-demo/latest/template.yaml)|

2. If prompted, login using your AWS account credentials.
3. You should see a screen titled "*Create Stack*" at the "*Specify template*" step. The fields specifying the CloudFormation template are pre-populated. Click the **Next** button at the bottom of the page.
4. On the "*Specify stack details*" screen you may customize the following parameters of the CloudFormation stack:
   * **Stack Name:** (Default: *CustomLabelsDemo*) This is the name that is used to refer to this stack in CloudFormation once deployed. The value must be 15 characters or less.
   * **ResourcePrefix:** (Default: *RekogCustomLabelsDemo*) AWS Resources are named based on the value of this parameter. You must customise this if you are launching more than one instance of the stack within the same account.
   * **CreateCloudFrontDistribution**  (Default: *true*) Creates a CloudFront distribution for accessing the web interface of the demo. This must be enabled if S3 Block Public Access is enabled at an account level. **Note:** Creating a CloudFront distribution may significantly increase the deploy time (from approximately 5 minutes to over 30 minutes).

   When completed, click **Next**
5. [Configure stack options](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-add-tags.html) if desired, then click **Next**.
6. On the review you screen, you must check the boxes for:
   * "*I acknowledge that AWS CloudFormation might create IAM resources*" 
   * "*I acknowledge that AWS CloudFormation might create IAM resources with custom names*"
   * "*I acknowledge that AWS CloudFormation might require the following capability: CAPABILITY_AUTO_EXPAND*"

   These are required to allow CloudFormation to create the IAM roles specified in the CloudFormation using both fixed and dynamic names.
7. Click **Create Change Set**
8. On the *Change Set* screen, click **Execute** to launch your stack.
   * You may need to wait for the *Execution status* of the change set to become "*AVAILABLE*" before the "**Execute**" button becomes available.
9. Wait for the CloudFormation stack to launch. Completion is indicated when the "Stack status" is "*CREATE_COMPLETE*".
   * You can monitor the stack creation progress in the "Events" tab.
10. Note the *url* displayed in the *Outputs* tab for the stack. This is used to access the application.

#### Accessing and using the Demo

The [Rekognition Custom Labels console](https://console.aws.amazon.com/rekognition) provides a visual interface to make labeling your images fast and simple. The interface allows you to apply a label to the entire image or to identify and label specific objects in images using bounding boxes with a simple click-and-drag interface.

Alternatively, if you have a large data set, you can use [Amazon SageMaker Ground Truth](https://aws.amazon.com/sagemaker/groundtruth) to efficiently label your images at scale.

The Console allows creation and management of projects, necessary for using this demo. If you prefer using the AWS CLI, consult the [Managing Projects with the AWS CLI](#managing-projects-with-the-aws-cli) section.

Once deployed, the application can be accessed using a web browser using the address specified in `url` output from the CloudFormation stack created during [deployment](#deployment) of the solution.

#### Managing Projects with the AWS CLI

#### 1. Setup S3 bucket policies for Rekognition

Amazon Rekognition will need to be able to read and write to Amazon S3 during the training. The following is an example bucket policy which you can use to grant Rekognition access to bucket where your manifest file and training data is stored:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSRekognitionS3AclBucketRead",
      "Effect": "Allow",
      "Principal": {
        "Service": "rekognition.amazonaws.com"
      },
      "Action": [
        "s3:GetBucketAcl",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::my-read-bucket"
    },
    {
      "Sid": "AWSRekognitionS3GetBucket",
      "Effect": "Allow",
      "Principal": {
        "Service": "rekognition.amazonaws.com"
      },
      "Action": [
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:GetObjectVersion",
        "s3:GetObjectTagging"
      ],
      "Resource": "arn:aws:s3:::my-read-bucket/*"
    }
  ]
}
```
Similarly, the following is an example bucket policy you can use for buckets where the output of the model training will be written:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSRekognitionS3ACLBucketWrite",
      "Effect": "Allow",
      "Principal": {
        "Service": "rekognition.amazonaws.com"
      },
      "Action": "s3:GetBucketAcl",
      "Resource": "arn:aws:s3:::my-write-bucket"
    },
    {
      "Sid": "AWSRekognitionS3PutObject",
      "Effect": "Allow",
      "Principal": {
        "Service": "rekognition.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::my-write-bucket/my-write-prefix/*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-acl": "bucket-owner-full-control"
        }
      }
    }
  ]
}
```

#### 2. Create a new Custom Labels Project

A project is a logical grouping of resources (images, Labels, models) and operations (training, evaluation and detection).

> This operation requires you to have permission to perform the rekognition:CreateProject action.

If you are using the AWS CLI, run:
```sh
aws rekognition create-project --project-name YOUR_PROJECT_NAME
```
Output:
```json
{
  "ProjectArn": "arn:aws:rekognition:us-east-1:123456123456:project/YOUR_PROJECT_NAME/1234561234567"
}
```

#### 3. Create a new Custom Labels Project Version

The "*CreateProjectVersion*" action is used to create a new version of a model and begin training. Models are managed as part of an Amazon Rekognition Custom Labels project. You can specify one training dataset and one testing dataset.

Training may take several hours to complete, after which the status will transition to "*TRAINING_COMPLETE*". To check the current state of the model training, navigate to the "*Project Summary*" tab of the demo. Once the status reaches "*TRAINING_COMPLETE*", the model will be ready to be used.

> This operation requires you to have permission to perform the rekognition:CreateProjectVersion action. You also need the input/output Amazon S3 Buckets and the solution stack to be deployed in the same region.*

If you are using the AWS CLI, run:
```sh
aws rekognition create-project-version \
 --project-arn "YOUR_PROJECT_ARN" \
 --version-name VERSION_NAME \
 --output-config '{"S3Bucket":"OUTPUT_BUCKET","S3KeyPrefix":"OUTPUT_BUCKET_PREFIX"}' \
 --training-data '{"Assets":[{"GroundTruthManifest":{"S3Object":{"Bucket":"MANIFEST_BUCKET","Name":"MANIFEST_OBJECT"}}}]}' \
 --testing-data '{"Assets":[{"GroundTruthManifest":{"S3Object":{"Bucket":"MANIFEST_BUCKET","Name":"MANIFEST_OBJECT"}}}]}'
```
Output:
```json
{
  "ProjectVersionArn": "arn:aws:rekognition:us-east-1:123456123456:project/YOUR_PROJECT_NAME/version/VERSION_NAME/1234561234567"
}
```

#### 4. Running the Model

The "*StartProjectVersion*" action allows you to start running a version of a model.

Starting a model may take a while to complete, after that its status will transit to "*RUNNING*". To check the current state of the model, navigate to the "Project Summary" tab of the demo.

Once the model is running, you can detect custom labels in new images by navigating to the "*Test your models*" tab of the demo.

When performing the *StartProjectVersion* action, you need to specify the minimum number of inference units to use. A single inference unit represents 1 hour of processing and can support up to 5 Transactions per Second (TPS). Use a higher number to increase the TPS throughput of your model. You are charged for the number of inference units that you use.

**NOTE: You are charged for the amount of time that the model is running. To stop a running model, consult the [Stopping a running model"](#stopping-a-running-model) section.**

> This operation requires you to have permission to perform the rekognition:StartProjectVersion action.

If you are using the AWS CLI, run:
```sh
aws rekognition start-project-version \
 --project-version-arn YOUR_PROJECT_VERSION_ARN \
 --min-inference-units MIN_INFERENCE_UNITS
```
Output:
```json
{
  "Status": "STARTING_HOSTING"
}
```

#### Stopping a running model

Stops a running model. The operation might take a while to complete.

> This operation requires you to have permission to perform the rekognition:StopProjectVersion action.

If you are using the AWS CLI, run:
```sh
aws rekognition stop-project-version --project-version-arn YOUR_PROJECT_VERSION_ARN
```
Output:
```json
{
  "Status": "STOPPING"
}
```
### Removing the demo application

To remove the demo application, open the AWS CloudFormation Console, click the CustomLabelsDemo project then right-click and select "*Delete Stack*". Your stack will take some time to be deleted. You can track its progress in the "Events" tab. Once the stack deletion is complete, the status will change from DELETE_IN_PROGRESS" to "DELETE_COMPLETE". It will then disappear from the list.

### Making changes to the code and customization

The [contributing guidelines](CONTRIBUTING.md) contain instructions about how to run the front-end locally and make changes to the backend stack.

## Contributing

Contributions are more than welcome. Please read the [code of conduct](CODE_OF_CONDUCT.md) and the [contributing guidelines](CONTRIBUTING.md).

## License Summary

This project is licensed under the Apache-2.0 License.
