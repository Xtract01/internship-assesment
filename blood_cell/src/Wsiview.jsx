import { useEffect, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./App.css";

const WSIViewer = () => {
  const [viewer, setViewer] = useState(null);
  const [detectionResults, setDetectionResults] = useState([]);

  useEffect(() => {
    // Initialize OpenSeadragon Viewer
    const osdViewer = OpenSeadragon({
      id: "wsi-viewer",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: {
        type: "image",
        url: "/assets/images/7_20241209_024613.png", // Fixed Path
      },
      showNavigationControl: true,
      minZoomLevel: 0.5,
      maxZoomLevel: 10,
    });

    setViewer(osdViewer);

    // Load JSON bounding boxes
    fetch("/assets/data/output.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded Detection Data:", data);
        const boxes = data.inference_results.output.detection_results;
        setDetectionResults(boxes);
      })
      .catch((error) =>
        console.error("Error loading detection results:", error)
      );

    return () => osdViewer.destroy();
  }, []);

  useEffect(() => {
    if (!viewer || detectionResults.length === 0) return;

    viewer.clearOverlays(); // Clear old boxes

    const imageWidth = viewer.world.getItemAt(0).getContentSize().x;
    const imageHeight = viewer.world.getItemAt(0).getContentSize().y;

    detectionResults.forEach(([x, y, x2, y2, label]) => {
      const normalizedX = x / imageWidth;
      const normalizedY = y / imageHeight;
      const normalizedWidth = (x2 - x) / imageWidth;
      const normalizedHeight = (y2 - y) / imageHeight;

      const rect = new OpenSeadragon.Rect(
        normalizedX,
        normalizedY,
        normalizedWidth,
        normalizedHeight
      );

      const overlayElement = document.createElement("div");
      overlayElement.className = "overlay-box";
      overlayElement.style.border = "2px solid red";
      overlayElement.style.position = "absolute";
      overlayElement.title = `${label}`;

      viewer.addOverlay({
        element: overlayElement,
        location: rect,
      });
    });
  }, [viewer, detectionResults]);

  return (
    <div>
      <header>
        <h1>Design a Page based on the Wireframe</h1>
        <p>{new Date().toString()}</p>
      </header>

      <div className="container">
        <div className="left-panel">
          <button className="back-btn">←</button>
          <Section
            title="RBC"
            data={[
              ["Angled Cells", 222, "67%"],
              ["Borderline Ovalocytes", 50, "20%"],
              ["Burr Cells", 87, "34%"],
              ["Fragmented Cells", 2, "0.12%"],
              ["Ovalocytes", "-", "-"],
              ["Rounded RBC", "-", "-"],
              ["Teardrops", "-", "-"],
            ]}
          />
          <Section
            title="WBC"
            data={[
              ["Basophil", 80, "67%"],
              ["Eosinophil", 50, "20%"],
              ["Lymphocyte", 87, "34%"],
              ["Monocyte", 2, "0.12%"],
            ]}
          />
          <Section title="Platelets" data={[["Count", 222, 222]]} />
        </div>

        <div className="central-panel">
          <div id="wsi-viewer"></div>
        </div>

        <div className="right-panel">
          <div className="hub-view">
            <h3>WSI Zoomed Out View (Hub)</h3>
            <div id="hub-viewer">
              <img
                src="/assets/images/7_20241209_024613.png"
                alt="WSI Thumbnail"
                id="hub-image"
              />
              <div id="hub-pointer"></div>
            </div>
          </div>
          <div className="patient-info">
            <p>
              <strong>Patient ID:</strong> 7
            </p>
            <p>
              <strong>Sample Type:</strong> Blood
            </p>
          </div>
        </div>
      </div>

      <footer>
        <button id="report-btn" className="report-btn">
          Report
        </button>
      </footer>
    </div>
  );
};

const Section = ({ title, data }) => (
  <div className="section">
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.map(([name, count, percentage], index) => (
          <tr key={index}>
            <td>{name}</td>
            <td>{count}</td>
            <td>{percentage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WSIViewer;
