import React, { useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import { Col, Container, Row } from "react-bootstrap";
import Webcam from "react-webcam";

import CameraHelp from "./CameraHelp";
import LabelsSummary from "./LabelsSummary";
import RekognitionButton from "./RekognitionButton";

export default ({ gateway }) => {
  const [detectedLabels, setDetectedLabels] = useState([]);
  const [readyToStream, setReadyToStream] = useState(false);
  const [webcamCoordinates, setWebcamCoordinates] = useState({});

  const iterating = useRef(false);
  const webcam = useRef(undefined);

  const getSnapshot = () => {
    const node = findDOMNode(webcam.current);
    if (!node) return;
    setWebcamCoordinates(node.getBoundingClientRect());

    const image = webcam.current.getScreenshot();
    const b64Encoded = image.split(",")[1];

    gateway.detectLabels(b64Encoded).then(response => {
      setDetectedLabels(response.Labels);

      if (iterating.current) {
        setTimeout(getSnapshot, 1000);
      }
    });
  };
  const setupWebcam = instance => {
    webcam.current = instance;

    const checkIfReady = () => {
      if (
        webcam.current &&
        webcam.current.state &&
        webcam.current.state.hasUserMedia
      ) {
        setReadyToStream(true);
      } else setTimeout(checkIfReady, 250);
    };

    checkIfReady();
  };

  const toggleRekognition = () => {
    iterating.current = !iterating.current;
    if (iterating.current) getSnapshot();
  };

  return (
    <>
      <CameraHelp show={!readyToStream} />
      <Row>
        <Col md={12} sm={6} className="h100">
          <Container>
            <Row>
              <Col md={8} sm={6}>
                <Webcam
                  ref={setupWebcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 640,
                    facingMode: "user"
                  }}
                  width="100%"
                  height="320"
                />
              </Col>
              {readyToStream && (
                <Col md={4} sm={6} className="scrollable-panel">
                  <RekognitionButton
                    onClick={toggleRekognition}
                    enabled={readyToStream}
                  />
                  <LabelsSummary
                    detectedLabels={detectedLabels}
                    showLabelBoundingBoxes={iterating.current}
                    containerCoordinates={webcamCoordinates}
                  />
                </Col>
              )}
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  );
};
