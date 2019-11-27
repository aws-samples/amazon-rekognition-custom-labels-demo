import React, { useState } from "react";
import { Accordion, Card, useAccordionToggle } from "react-bootstrap";

const ArrowIcon = ({ type }) => (
  <i className={`arrow ${type === "+" ? "right" : "down"}`} />
);

const CustomToggle = ({ children, open }) => {
  const [collapsed, setCollapsed] = useState(!open);
  const [icon, setIcon] = useState(!open ? "+" : "-");

  const toggle = useAccordionToggle("0", () => {
    const newState = !collapsed;
    setCollapsed(newState);
    setIcon(newState ? "+" : "-");
  });

  return (
    <div onClick={toggle} variant="link">
      <ArrowIcon type={icon} /> {children}
    </div>
  );
};

export default ({ labelName, children, open = true }) => {
  return (
    <Accordion
      defaultActiveKey={open ? "0" : undefined}
      className="labels-accordion"
    >
      <Card>
        <Card.Header>
          <CustomToggle open={open}>{labelName}</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>{children}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
