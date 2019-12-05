import React, { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import { formatErrorMessage } from "../utils";

export default ({ gateway, onError, project, refreshProjects }) => {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [formState, setFormState] = useState("initial");
  const [minInferenceUnits, setMinInferenceUnits] = useState("");
  const [show, setShow] = useState(false);

  const toggle = reset => {
    const hiding = show;
    setShow(!show);
    if (reset) {
      setFormState("initial");
      setMinInferenceUnits("");
    }
    if (hiding && formState === "saved") refreshProjects();
  };

  const submitForm = e => {
    setFormState("saving");
    e.preventDefault();

    gateway
      .startProjectVersion(
        project.ProjectVersionArn,
        parseInt(minInferenceUnits, 10)
      )
      .then(() => setFormState("saved"))
      .catch(e => {
        setErrorMessage(formatErrorMessage(e));
        setFormState("error");
      });
  };

  const stopModel = e => {
    e.preventDefault();

    gateway
      .stopProjectVersion(project.ProjectVersionArn)
      .then(() => refreshProjects())
      .catch(e => onError(e));
  };

  const isFormValid = parseInt(minInferenceUnits, 10) > 0;

  const validationAttributes = isValid =>
    isValid ? { isValid: true } : { isInvalid: true };

  if (project.Status === "RUNNING")
    return (
      <Button
        variant="danger"
        className="model-action-button"
        onClick={stopModel}
      >
        Stop the model
      </Button>
    );

  if (project.Status === "TRAINING_COMPLETED" || project.Status === "STOPPED")
    return (
      <>
        <Button
          variant="success"
          className="model-action-button"
          onClick={() => toggle(true)}
        >
          Start the model
        </Button>
        <Modal show={show} onHide={toggle} style={{ textAlign: "left" }}>
          <Modal.Header closeButton>
            <Modal.Title>Start a model</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              A model might take a while to start. To check the current state of
              the model, refresh the Projects page.
              <br />
              <br />
              <b>
                NOTE:
                <br />
                You are charged for the amount of time that the model is
                running. To stop a running model, press the Stop button.
              </b>
            </p>
            <hr />
            {formState === "saving" && (
              <Alert variant="warning">Please wait</Alert>
            )}
            {formState === "error" && (
              <Alert variant="danger">{errorMessage}</Alert>
            )}
            {formState === "saved" && (
              <Alert variant="success">The model is starting.</Alert>
            )}
            {formState === "initial" && (
              <Form>
                <Form.Group controlId="minInferenceUnits">
                  <Form.Label>
                    Plase specify the minimum number of inference units to use.
                    A single inference unit represents 1 hour of processing and
                    can support up to 5 Transactions Per Second (TPS). Use a
                    higher number to increase the TPS throughput of your model.
                    You are charged for the number of inference units that you
                    use.
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={minInferenceUnits}
                    placeholder="Needs to be more than 0"
                    onChange={e => setMinInferenceUnits(e.target.value)}
                    style={{ width: "100%" }}
                    {...validationAttributes(isFormValid)}
                  />
                  <Form.Control.Feedback />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={submitForm}
              variant="success"
              type="submit"
              disabled={!isFormValid || formState !== "initial"}
              show="false"
            >
              Start the model
            </Button>
            <Button onClick={toggle}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );

  return "";
};
