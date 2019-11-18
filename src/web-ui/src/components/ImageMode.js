import React, { useCallback, useEffect, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import {
  Alert,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
  Spinner
} from "react-bootstrap";

import LabelsSummary from "./LabelsSummary";

export default ({ gateway }) => {
  const [detectedLabels, setDetectedLabels] = useState([]);
  const [errorDetails, setErrorDetails] = useState("");
  const [formState, setFormState] = useState("initial");
  const [image, setImage] = useState(undefined);
  const [imageCoordinates, setImageCoordinates] = useState({});

  const imageContainer = useRef(undefined);

  const resetSummary = () => setDetectedLabels([]) && setErrorDetails("");

  const isValidImage = type =>
    ["data:image/jpeg;base64", "data:image/png;base64"].includes(type);

  const processImage = file => {
    resetSummary();
    const reader = new FileReader();

    reader.onload = () => {
      const [type, content] = reader.result.split(",");
      const isValid = isValidImage(type);
      setImage(isValid ? content : undefined);
      setFormState(isValid ? "ready" : "error");
      if (!isValid) setErrorDetails("The image format is not valid");
    };
    reader.onerror = () => setFormState("error");

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      setFormState("error");
    }
  };

  const calculateImageCoordinates = () => {
    const node = findDOMNode(imageContainer.current);
    if (!node) return;
    setImageCoordinates(node.getBoundingClientRect());
  };

  const scrollHandler = useCallback(() => calculateImageCoordinates(), []);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);

    if (formState === "ready") {
      calculateImageCoordinates();
      gateway
        .detectLabels(image)
        .then(response => {
          setDetectedLabels(response.Labels);
          setFormState("processed");
        })
        .catch(e => {
          setFormState("error");
          setErrorDetails("There was a network issue");
        });
    }

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [formState, gateway, image, scrollHandler]);

  return (
    <Row>
      <Col md={12} sm={6} className="h100">
        <Container>
          <Alert
            variant="danger"
            style={{
              display: formState === "error" ? "block" : "none"
            }}
          >
            An error happened{errorDetails && `: ${errorDetails}`}.{" "}
            <a href={window.location.href}>Retry</a>.
          </Alert>
          <Row>
            <Col md={8} sm={6}>
              {image && (
                <img
                  alt="The uploaded content"
                  ref={x => (imageContainer.current = x)}
                  src={`data:image/png;base64, ${image}`}
                  style={{ width: "100%" }}
                />
              )}
            </Col>
            <Col md={4} sm={6} className="scrollable-panel">
              <Form>
                <FormGroup>
                  <FormControl
                    type="file"
                    onChange={e => processImage(e.target.files[0])}
                    id="image"
                  />
                </FormGroup>
              </Form>
              {formState === "ready" && (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
              <LabelsSummary
                detectedLabels={detectedLabels}
                showLabelBoundingBoxes={true}
                containerCoordinates={imageCoordinates}
              />
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};
