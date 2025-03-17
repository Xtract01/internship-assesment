import React, { useEffect, useState } from "react";

const BloodCellBoundingBoxes = () => {
  // Example detected bounding box data (x, y, width, height)
  const [boundingBoxes, setBoundingBoxes] = useState([]);

  useEffect(() => {
    // Simulated bounding box data (Replace this with actual data)
    setBoundingBoxes([
      { x: 50, y: 60, width: 30, height: 30 },
      { x: 120, y: 150, width: 35, height: 35 },
      { x: 200, y: 100, width: 40, height: 40 },
      { x: 300, y: 200, width: 38, height: 38 },
      // More boxes...
    ]);
  }, []);

  return (
    <div style={{ position: "relative", width: "600px", height: "400px" }}>
      {/* Blood Cell Image */}
      <img
        src="/blood_cells.png"
        alt="Blood Cells"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />

      {boundingBoxes.map((box, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: box.y,
            left: box.x,
            width: box.width,
            height: box.height,
            border: "2px solid blue",
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
};

export default BloodCellBoundingBoxes;
