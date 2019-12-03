import React from "react";

export default () => (
  <div className="intro tab-content">
    <h2>Amazon Rekognition Custom Labels</h2>
    Amazon Rekognition Custom Labels is a new feature of Amazon Rekognition that
    enables customers to build their own specialized machine learning (ML) based
    image analysis capabilities to detect unique objects and scenes integral to
    their specific use case.
    <br />
    <br />
    Instead of having to train a model from scratch, which requires specialized
    machine learning expertise and millions of high-quality labeled images,
    customers can now use Amazon Rekognition Custom Labels to achieve
    state-of-the-art performance for their unique image analysis needs. To use
    the Demo, you need models trained by Amazon Rekognition.
    <br />
    <br />
    Consult the{" "}
    <a
      href="https://docs.aws.amazon.com/rekognition/latest/customlabels-dg/gs-console.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      Getting Started Documentation
    </a>{" "}
    to learn how to create and train an Amazon Rekognition Custom Labels model.
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
  </div>
);
