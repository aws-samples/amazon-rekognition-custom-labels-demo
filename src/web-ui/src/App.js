import {
  AmplifyAuthenticator,
  AmplifySignIn,
} from "@aws-amplify/ui-react/legacy";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import Header from "./components/Header";
import ImageMode from "./components/ImageMode";
import ProjectsSummary from "./components/ProjectsSummary";
import SettingsHelp from "./components/SettingsHelp";
import Help from "./components/Help";

import gateway from "./utils/gateway";

const App = () => {
  const [authState, setAuthState] = useState(undefined);
  const [currentPage, setCurrentPage] = useState("projects");
  const [selectedProjectVersion, setSelectedProjectVersion] =
    useState(undefined);

  const onHelp = () => setCurrentPage("help");
  const loadProjectList = () => setCurrentPage("projects");
  const loadProjectVersion = (projectVersionArn) => {
    setSelectedProjectVersion(projectVersionArn);
    setCurrentPage("image");
  };

  useEffect(() => {
    return onAuthUIStateChange((s) => setAuthState(s));
  }, []);
  console.log(authState)
  const signedIn = authState === "signedin";

  return (
    <div className="App">
      {signedIn ? (
        <>
          <Header
            currentPage={currentPage}
            onHelp={onHelp}
            loadProjectList={loadProjectList}
          />
          <Container>
            <SettingsHelp show={!window.rekognitionSettings} />
            {currentPage === "projects" && (
              <ProjectsSummary
                gateway={gateway}
                onHelp={onHelp}
                onVersionClick={loadProjectVersion}
              />
            )}
            {currentPage === "help" && <Help />}
            {currentPage === "image" && (
              <ImageMode
                gateway={gateway}
                projectVersionArn={selectedProjectVersion}
              />
            )}
          </Container>
        </>
      ) : (
        <div className="amplify-auth-container">
          <AmplifyAuthenticator usernameAlias="email">
            <AmplifySignIn
              slot="sign-in"
              usernameAlias="email"
              formFields={[
                {
                  type: "email",
                  label: "Username *",
                  placeholder: "Enter your username",
                  required: true,
                  inputProps: { autoComplete: "off" },
                },
                {
                  type: "password",
                  label: "Password *",
                  placeholder: "Enter your password",
                  required: true,
                  inputProps: { autoComplete: "off" },
                },
              ]}
            >
              <div slot="secondary-footer-content"></div>
            </AmplifySignIn>
          </AmplifyAuthenticator>
        </div>
      )}
    </div>
  );
};

export default App;
