import React from "react";

export default ({ id, onChange }) => (
  <div className="form-element">
    <div className="form-prompt">
      Use your own image
      <div className="form-instructions">
        Image must be .jpeg or .png format and no larger than 4MB. Your image
        isn't stored.
      </div>
    </div>
    <div className="upload-prompt-row">
      <div>
        <label style={{ display: "inline-table" }} htmlFor={id}>
          <div className="awsui-button awsui-button-size-normal awsui-button-variant-primary awsui-hover-child-icons upload-button">
            <div className="awsui-icon upload awsui-icon-light"></div>
            <div className="button-text">Upload</div>
          </div>
        </label>
        <input
          accept="image/*"
          className="file-upload photo"
          id={id}
          name="file"
          onChange={onChange}
          type="file"
        />
      </div>
    </div>
  </div>
);
