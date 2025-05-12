import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Get the category from the request body (default to 'plants')
    const category = req.body.category || "plants";

    // Prepare the FormData to send to the Flask app
    const form = new FormData();
    form.append("category", category);
    form.append(
      "image",
      fs.createReadStream(req.file.path),
      req.file.originalname
    );

    // Make a POST request to the Flask app for image analysis
    const response = await axios.post("http://127.0.0.1:5000/analyze", form, {
      headers: form.getHeaders(),
    });

    // Delete the uploaded file after sending it
    fs.unlinkSync(req.file.path);

    // Return the response data from the Flask app
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Start the Node.js server
app.listen(3000, () => {
  console.log("Node.js app listening on http://localhost:3000");
});
