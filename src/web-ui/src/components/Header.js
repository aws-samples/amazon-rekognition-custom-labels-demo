import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export default ({ currentPage, onHelp, loadProjectList }) => (
  <Navbar
    style={{ backgroundColor: "#232f3e", marginBottom: "20px" }}
    variant="dark"
  >
    <Container>
      <Navbar.Brand>
        <div className="awslogo" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="ml-auto">
          {currentPage !== "projects" && (
            <Button onClick={loadProjectList} variant="primary">
              Projects
            </Button>
          )}
          {currentPage !== "help" && (
            <Button onClick={onHelp} variant="light">
              Help
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
