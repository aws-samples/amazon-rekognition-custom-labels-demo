import React, { useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
import { Form } from "react-bootstrap";

export default ({ onChange, onMount, projects }) => {
  const selected = useRef(undefined);

  const changeHandler = () => onChange(findDOMNode(selected.current).value);

  useEffect(() => {
    onMount(findDOMNode(selected.current).value);
  }, [onMount, selected]);

  return (
    <div className="form-element">
      <div className="form-prompt">
        Select your model
        <div className="form-instructions">
          This list contains all the project and versions in the "RUNNING" state
        </div>
      </div>
      <div className="upload-prompt-row">
        <Form.Control
          as="select"
          onChange={changeHandler}
          ref={x => (selected.current = x)}
        >
          {projects.map((project, index) => (
            <option key={index} value={project.details.ProjectVersionArn}>
              {project.project}/{project.version}
            </option>
          ))}
        </Form.Control>
      </div>
    </div>
  );
};
