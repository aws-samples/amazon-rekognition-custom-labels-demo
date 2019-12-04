import React, { useRef } from "react";
import { Table } from "react-bootstrap";

import LabelsAccordion from "./LabelsAccordion";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const filterAndSortLabels = labels =>
  labels
    .map(label => ({
      boundingBoxes:
        label.Geometry && label.Geometry.BoundingBox
          ? [label.Geometry.BoundingBox]
          : [],
      confidence: label.Confidence,
      name: label.Name
    }))
    .filter(x => x.confidence > 0)
    .sort((a, b) => {
      if (a.confidence > b.confidence) {
        return -1;
      } else if (a.confidence < b.confidence) {
        return 1;
      } else return 0;
    });

const percentageToString = percentage => Math.round(percentage * 10) / 10;

export default ({
  apiResponse,
  containerCoordinates,
  detectedLabels,
  image,
  projectVersionArn,
  showLabelBoundingBoxes
}) => {
  const colors = useRef({});

  const getColor = labelName => {
    colors.current[labelName] =
      colors.current[labelName] || generateRandomColor();
    return colors.current[labelName];
  };

  const highlight = (index, color) => {
    const boxes = document.getElementsByClassName(`bb-${index}`);
    Array.from(boxes).forEach(box => {
      box.style.opacity = 0.5;
      box.style.filter = "alpha(opacity=50)";
      box.style.backgroundColor = color;
    });
  };

  const removeHighlight = index => {
    const boxes = document.getElementsByClassName(`bb-${index}`);
    Array.from(boxes).forEach(box => {
      box.style.opacity = 1;
      box.style.filter = "alpha(opacity=100)";
      box.style.backgroundColor = null;
    });
  };

  return (
    <div>
      {detectedLabels && (
        <>
          <LabelsAccordion labelName="Results">
            {detectedLabels.length === 0 && (
              <span>No custom labels detected for the given image.</span>
            )}
            {detectedLabels.length > 0 && (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {detectedLabels &&
                    filterAndSortLabels(detectedLabels).map((label, index) => {
                      const color = getColor(label.name);
                      return (
                        <tr
                          key={index}
                          onMouseOver={() => highlight(index, color)}
                          onMouseOut={() => removeHighlight(index)}
                        >
                          <td>
                            {label.name}
                            {showLabelBoundingBoxes &&
                              label.boundingBoxes.map(
                                (boundingBox, bbIndex) => (
                                  <div
                                    key={`bb-${bbIndex}`}
                                    className={`bb-${index} custom-label-box`}
                                    style={{
                                      border: `1px solid ${color}`,
                                      color: "#fff",
                                      fontWeight: "bold",
                                      position: "fixed",
                                      height:
                                        containerCoordinates.height *
                                        boundingBox.Height,
                                      left:
                                        containerCoordinates.left +
                                        boundingBox.Left *
                                          containerCoordinates.width,
                                      top:
                                        containerCoordinates.top +
                                        boundingBox.Top *
                                          containerCoordinates.height,
                                      width:
                                        containerCoordinates.width *
                                        boundingBox.Width
                                    }}
                                  >
                                    {label.name}
                                  </div>
                                )
                              )}
                          </td>
                          <td>{percentageToString(label.confidence)}%</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            )}
          </LabelsAccordion>
          <LabelsAccordion labelName="Request" open={false}>
            <div className="prettify-json">
              {JSON.stringify(
                {
                  Image: { Bytes: image },
                  ProjectVersionArn: projectVersionArn
                },
                undefined,
                2
              )}
            </div>
          </LabelsAccordion>
          <LabelsAccordion labelName="Response" open={false}>
            <div className="prettify-json">
              {JSON.stringify(apiResponse, undefined, 2)}
            </div>
          </LabelsAccordion>
        </>
      )}
    </div>
  );
};
