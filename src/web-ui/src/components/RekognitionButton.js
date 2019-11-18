import React, { useState } from "react";
import { Button } from "react-bootstrap";

export default props => {
  const [started, setStarted] = useState(false);

  return (
    <Button
      variant={started ? "danger" : "success"}
      disabled={!props.enabled}
      onClick={e => {
        setStarted(!started);
        props.onClick(e);
      }}
      style={{ marginBottom: "10px" }}
    >
      {started ? "Stop" : "Start"} Rekognition
    </Button>
  );
};
