import React, { useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Button, TextField, Paper, CircularProgress, Alert } from "@mui/material";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/extract-info/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to extract document details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Document Data Extractor
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!file || loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Extract Info"}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {data && (
          <Box sx={{ mt: 3, textAlign: "left" }}>
            <Typography variant="h6">Extracted Details:</Typography>
            <Typography><strong>Name:</strong> {data.name}</Typography>
            <Typography><strong>Document Number:</strong> {data.document_number}</Typography>
            <Typography><strong>Expiration Date:</strong> {data.expiration_date}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
