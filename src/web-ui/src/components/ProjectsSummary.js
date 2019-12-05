import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner, Table } from "react-bootstrap";
import { formatErrorMessage, mapResults } from "../utils";

import ProjectActions from "./ProjectActions";

export default ({ gateway, onHelp, onVersionClick }) => {
  const [projects, setProjects] = useState(undefined);
  const [errorDetails, setErrorDetails] = useState(undefined);
  const [projectsRefreshCycle, setProjectsRefreshCycle] = useState(1);

  const refreshProjects = () =>
    setProjectsRefreshCycle(projectsRefreshCycle + 1);

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
      .catch(e => setErrorDetails(formatErrorMessage(e)));
  }, [gateway, projectsRefreshCycle]);

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
      {projects && Object.keys(projects).length === 0 && (
        <div className="no-projects">
          There are no projects available in the current account. Check the{" "}
          <Button variant="link" onClick={onHelp}>
            help page
          </Button>{" "}
          if you need help on getting started.
        </div>
      )}
      {projects &&
        Object.keys(projects).map((projectName, index) => (
          <Card key={index}>
            <Card.Header>{projectName}</Card.Header>
            <Card.Body>
              <Table>
                <tbody>
                  {projects[projectName].map((version, index) => (
                    <tr key={`v-${index}`}>
                      <td>
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
                        )}
                      </td>
                      <td>{version.details.Status}</td>
                      <td style={{ textAlign: "right" }}>
                        <ProjectActions
                          project={version.details}
                          gateway={gateway}
                          onError={e => setErrorDetails(e.toString())}
                          refreshProjects={refreshProjects}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
};
