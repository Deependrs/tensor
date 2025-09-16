import React, { useState } from "react";
import "./App.css";
import catIcon from "./assets/cat.jpg";// cat icon image in src folder
import dogIcon from "./assets/dog.jpg"; // dog icon image in src folder

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please upload an image");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setPrediction("");

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setPrediction(data.prediction);
      }
    } catch (err) {
      alert("Error connecting to backend");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="card">
        <h1>🐾 Pet Recognition App</h1>

        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button className="predict-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>

        {prediction && (
          <div className="result">
            <h2>Result: {prediction}</h2>
            <img
              src={prediction === "Cat" ? catIcon : dogIcon}
              alt={prediction}
              className="pet-icon"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
