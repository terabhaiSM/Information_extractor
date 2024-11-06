// App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/extract-info/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data);
      setError("");
    } catch (err) {
      setError("Failed to extract document details. Please try again.");
    }
  };

  return (
    <div>
      <h1>Document Data Extractor</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Extract Info</button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div>
          <h3>Extracted Details:</h3>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Document Number:</strong> {data.document_number}</p>
          <p><strong>Expiration Date:</strong> {data.expiration_date}</p>
        </div>
      )}
    </div>
  );
}

export default App;
