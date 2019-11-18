import React from "react";
import { Col, Row } from "react-bootstrap";

export default props => {
  const currentUrl = window.location.href;
  if (props.show) {
    return (
      <Row>
        <Col md={12}>
          When prompted, you need to click <i>Allow</i> to use the application
          with your webcamera.
          <br />
          If you don't see the dialog, try{" "}
          <a href={currentUrl}>opening the application</a> in a new incognito
          window, or review your webcam settings on your browser.
        </Col>
      </Row>
    );
  }
  return "";
};
