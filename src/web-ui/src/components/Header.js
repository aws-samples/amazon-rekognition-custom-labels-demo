import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export default ({ onHelp, loadProjectList }) => (
  <Navbar
    style={{ backgroundColor: "#000", marginBottom: "20px" }}
    variant="dark"
  >
    <Container>
      <Navbar.Brand>Amazon Rekognition Custom Labels Demo</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <Nav.Link
            eventKey={1}
            href="https://github.com/aws-samples/amazon-rekognition-custom-labels-demo"
            target="_blank"
          >
            Fork me in github
          </Nav.Link>
        </Nav>
        <Nav style={{ paddingTop: "8px" }} />
        <Nav className="ml-auto">
          <Button onClick={loadProjectList} variant="primary">Projects</Button>
          <Button onClick={onHelp} variant="light">Help</Button>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
