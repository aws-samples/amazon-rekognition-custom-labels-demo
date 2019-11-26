import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { mapResults } from "../utils";

export default ({ gateway }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    gateway
      .describeProjects()
      .then(x =>
        Promise.all(
          x.ProjectDescriptions.map(project =>
            gateway.describeProjectVersions(project.ProjectArn)
          )
        ).then(x => setProjects(mapResults(x)))
      );
  }, [gateway]);

  return (
    <>
      <p className="intro">
        Amazon Rekognition Custom Labels is a new feature of Amazon Rekognition
        that enables customers to build their own specialized machine learning
        (ML) based image analysis capabilities to detect unique objects and
        scenes integral to their specific use case. Instead of having to train a
        model from scratch, which requires specialized machine learning
        expertise and millions of high-quality labeled images, customers can now
        use Amazon Rekognition Custom Labels to achieve state-of-the-art
        performance for their unique image analysis needs.
        <br />
        <br />
        To use the demo, you need{" "}
        <a
          href="https://aws.amazon.com/rekognition/custom-labels-features/"
          target="_blank"
          rel="noopener noreferrer"
        >
          some project versions
        </a>{" "}
        in a "RUNNING" state. Currently, these are the ones available in this
        account:
      </p>
      <Table striped bordered size="sm" variant="dark" className="intro">
        <thead>
          <tr>
            <td>Project</td>
            <td>Project Version</td>
            <td>State</td>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.project}</td>
              <td>{project.version}</td>
              <td>{project.details.Status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
