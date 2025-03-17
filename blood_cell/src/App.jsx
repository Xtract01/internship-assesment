import React from "react";
import WSIViewer from "./Wsiview";
import BloodCellBoundingBoxes from "./BloodCellBoundingBoxes"; // Ensure correct path

function App() {
  return (
    <>
      <WSIViewer />
      <h1>Blood Cell Detection</h1>
      <BloodCellBoundingBoxes />
    </>
  );
}

export default App;
