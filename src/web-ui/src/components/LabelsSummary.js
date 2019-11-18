import React, { useRef, useState } from "react";
import { Form, Table } from "react-bootstrap";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const filterAndSortLabels = (labels, showChildren) =>
  labels
    .map(label => ({
      boundingBoxes: label.Instances.map(instance => instance.BoundingBox),
      confidence: label.Confidence,
      name: label.Name,
      parents: label.Parents.map(parent => parent.Name)
    }))
    .filter(x => x.confidence > 0)
    .filter(x => (showChildren ? true : x.parents.length === 0))
    .sort((a, b) => {
      if (a.confidence > b.confidence) {
        return -1;
      } else if (a.confidence < b.confidence) {
        return 1;
      } else return 0;
    });

const percentageToString = percentage => Math.round(percentage * 10) / 10;

export default ({
  detectedLabels,
  showLabelBoundingBoxes,
  containerCoordinates
}) => {
  const colors = useRef({});
  const [childrenVisible, showChildren] = useState(true);

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
      <Form>
        <Form.Check
          checked={childrenVisible}
          id="show-children"
          inline={true}
          label="Show Children"
          onChange={e => showChildren(e.target.checked)}
          style={{ marginBottom: "10px" }}
          type="checkbox"
        />
      </Form>
      <Table responsive>
        {detectedLabels.length > 0 && (
          <thead>
            <tr>
              <th>Name</th>
              <th>Confidence</th>
              {childrenVisible && <th>Parents</th>}
            </tr>
          </thead>
        )}
        <tbody>
          {filterAndSortLabels(detectedLabels, childrenVisible).map(
            (label, index) => {
              const color = getColor(label.name);
              return (
                <tr
                  key={index}
                  onMouseOver={() => highlight(index, color)}
                  onMouseOut={() => removeHighlight(index)}
                >
                  <td
                    style={{
                      color: label.boundingBoxes.length > 0 ? color : "#fff"
                    }}
                  >
                    {label.name}
                    {showLabelBoundingBoxes &&
                      label.boundingBoxes.map((boundingBox, bbIndex) => (
                        <div
                          key={`bb-${bbIndex}`}
                          className={`bb-${index}`}
                          style={{
                            border: `1px solid ${color}`,
                            color: "#fff",
                            fontWeight: "bold",
                            position: "fixed",
                            height:
                              containerCoordinates.height * boundingBox.Height,
                            left:
                              containerCoordinates.left +
                              boundingBox.Left * containerCoordinates.width,
                            top:
                              containerCoordinates.top +
                              boundingBox.Top * containerCoordinates.height,
                            width:
                              containerCoordinates.width * boundingBox.Width
                          }}
                        >
                          {label.name}
                        </div>
                      ))}
                  </td>
                  <td>{percentageToString(label.confidence)}%</td>
                  {childrenVisible && <td>{label.parents.join(", ")}</td>}
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    </div>
  );
};
