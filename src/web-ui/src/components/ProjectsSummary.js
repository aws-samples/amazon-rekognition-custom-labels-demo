import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner } from "react-bootstrap";
import { mapResults } from "../utils";

export default ({ gateway, onVersionClick }) => {
  const [projects, setProjects] = useState(undefined);
  const [errorDetails, setErrorDetails] = useState(undefined);

  useEffect(() => {
    gateway
      .describeProjects()
      .then(x =>
        Promise.all(
          x.ProjectDescriptions.map(project =>
            gateway.describeProjectVersions(project.ProjectArn)
          )
        ).then(x => setProjects(mapResults(x)))
      )
      .catch(e => setErrorDetails(e.toString()));
  }, [gateway]);

  return (
    <div className="projects tab-content">
      <div className="logo">
        <img src="/cllogo.png" alt="Amazon Rekognition Custom Labels Logo" />
      </div>
      <h2>Amazon Rekognition Custom Labels Demo</h2>
      <div className="powered">powered by Amazon Rekognition</div>
      {errorDetails && (
        <Alert variant="danger" style={{ marginTop: "30px" }}>
          An error happened: {errorDetails}.{" "}
          <a href={window.location.href}>Retry</a>.
        </Alert>
      )}
      {!errorDetails && !projects && (
        <Spinner animation="border" role="status" style={{ marginTop: "30px" }}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {projects &&
        Object.keys(projects).map((projectName, index) => (
          <Card key={index}>
            <Card.Header>{projectName}</Card.Header>
            <Card.Body>
              <ul>
                {projects[projectName].map((version, index) => (
                  <li key={`v-${index}`}>
                    {version.details.Status === "RUNNING" ? (
                      <Button
                        variant="link"
                        onClick={() =>
                          onVersionClick(version.details.ProjectVersionArn)
                        }
                      >
                        {version.version}
                      </Button>
                    ) : (
                      version.version
                    )}{" "}
                    ({version.details.Status})<br />
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
};
