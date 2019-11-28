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
    <div className="intro">
      <h2>Amazon Rekognition Custom Labels Projects</h2>
      To use the demo, you need{" "}
      <a
        href="https://aws.amazon.com/rekognition/custom-labels-features/"
        target="_blank"
        rel="noopener noreferrer"
      >
        some project versions
      </a>{" "}
      in a "RUNNING" state. Currently, these are all the project versions in
      this account:
      <Table striped bordered className="intro">
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
    </div>
  );
};
