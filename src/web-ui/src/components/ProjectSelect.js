import React, { useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
import { Form } from "react-bootstrap";

export default ({ onChange, onMount, projects, preSelected }) => {
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
          defaultValue={preSelected}
        >
          {Object.keys(projects).map((project, i) =>
            projects[project].map((version, j) => (
              <option
                key={`${i}/${j}`}
                value={version.details.ProjectVersionArn}
              >
                {project}/{version.version}
              </option>
            ))
          )}
        </Form.Control>
      </div>
    </div>
  );
};
