import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

import Header from "./components/Header";
import ImageMode from "./components/ImageMode";
import SettingsHelp from "./components/SettingsHelp";
import WebCamMode from "./components/WebCamMode";

import gateway from "./utils/gateway";

export default () => (
  <div className="App">
    <Header />
    <Container>
      <SettingsHelp show={!window.rekognitionSettings} />
      <Tabs
        defaultActiveKey={1}
        transition={false}
        id="noanim-tab-example"
        unmountOnExit={true}
        variant="pills"
      >
        <Tab eventKey={1} title="Welcome">
          Leverage agile frameworks to provide a robust synopsis for high level
          overviews. Iterative approaches to corporate strategy foster
          collaborative thinking to further the overall value proposition.
          Organically grow the holistic world view of disruptive innovation via
          workplace diversity and empowerment.
          <br />
          <br />
          Bring to the table win-win survival strategies to ensure proactive
          domination. At the end of the day, going forward, a new normal that
          has evolved from generation X is on the runway heading towards a
          streamlined cloud solution. User generated content in real-time will
          have multiple touchpoints for offshoring.
          <br />
          <br />
          Capitalize on low hanging fruit to identify a ballpark value added
          activity to beta test. Override the digital divide with additional
          clickthroughs from DevOps. Nanotechnology immersion along the
          information highway will close the loop on focusing solely on the
          bottom line.
          <br />
          <br />
          Podcasting operational change management inside of workflows to
          establish a framework. Taking seamless key performance indicators
          offline to maximise the long tail. Keeping your eye on the ball while
          performing a deep dive on the start-up mentality to derive convergence
          on cross-platform integration.
          <br />
          <br />
          Collaboratively administrate empowered markets via plug-and-play
          networks. Dynamically procrastinate B2C users after installed base
          benefits. Dramatically visualize customer directed convergence without
          revolutionary ROI.
          <br />
          <br />
          Efficiently unleash cross-media information without cross-media value.
          Quickly maximize timely deliverables for real-time schemas.
          Dramatically maintain clicks-and-mortar solutions without functional
          solutions.
        </Tab>
        <Tab eventKey={2} title="Image Mode">
          <ImageMode gateway={gateway} />
        </Tab>
        <Tab eventKey={3} title="Webcam Mode">
          <WebCamMode gateway={gateway} />
        </Tab>
      </Tabs>
    </Container>
  </div>
);
