const express = require("express");
const mongoose = require("mongoose");
require("./userSchema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { ImageAnnotatorClient } = require("@google-cloud/vision");

const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const { fileURLToPath } = require("url");
const fs = require("fs");

const port = 3000;
const mongoUrl = process.env.MONGO_URL;
const User = mongoose.model("User");

const jwt_secret = process.env.JWT_SECRET;
const api_key = process.env.PLANT_ID_API_KEY;
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ data: "User already exist" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).send({ status: "Ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res
        .status(404)
        .send({ status: "Error", message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .send({ status: "Error", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      jwt_secret,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).send({ status: "Ok", token });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .send({ status: "Error", message: "Internal server error" });
  }
});

app.post("/profile", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(401)
      .send({ status: "Error", message: "Token is missing" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwt_secret);
    const userEmail = decoded.email;

    // Find user by email
    const user = await User.findOne({ email: userEmail }).select("-password"); // Exclude password from response

    if (!user) {
      return res
        .status(404)
        .send({ status: "Error", message: "User not found" });
    }

    // Send user data
    return res.status(200).send({ status: "Ok", data: user });
  } catch (error) {
    console.error("User data error:", error.message);
    return res
      .status(401)
      .send({ status: "Error", message: "Invalid or expired token" });
  }
});

app.post("/upload", upload.single("image"), async (req, res) => {
  const { token } = req.body;

  // Check if the user is authenticated before proceeding
  if (!token) {
    return res
      .status(401)
      .send({ status: "Error", message: "Token is missing" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwt_secret);
    const category = req.body.category || "plants";

    // Prepare FormData for Flask API request
    const form = new FormData();
    form.append("category", category);
    form.append(
      "image",
      fs.createReadStream(req.file.path),
      req.file.originalname
    );

    // Send the image for analysis to the Flask app
    const response = await axios.post(`${process.env.MODEL_API_URL}`, form, {
      headers: form.getHeaders(),
    });

    // Delete the uploaded file after sending
    fs.unlinkSync(req.file.path);

    // Return the analysis result
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Pland.Id Server

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Read file and convert to base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    // Send to Plant.id API
    const plantIdResponse = await axios.post(
      "https://api.plant.id/v2/identify",
      {
        api_key: api_key,
        images: [imageBase64],
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: [
          "common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
          "synonyms",
        ],
      }
    );

    const suggestions = plantIdResponse.data?.suggestions || [];
    if (suggestions.length === 0) {
      return res.status(404).json({ message: "No plant identified." });
    }

    const top = suggestions[0];

    res.json({
      scientific_name: top.plant_name,
      confidence_percent: (top.probability * 100).toFixed(2),
      invasive:
        top.plant_details?.wiki_description?.value
          ?.toLowerCase()
          .includes("invasive") || false,
    });

    // Optional: clean up uploaded file
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error(
      "Error analyzing image:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to identify plant" });
  }
});

// Google Visoion API
// const INVASIVE_LIST = require("./invasiveList");
// const normalize = require("./normalize");

// process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
//   require("os").homedir(),
//   ".gcloud",
//   "NatureShieldAPIKey.json"
// );

// const visionClient = new ImageAnnotatorClient();

// app.post("/analyze", upload.single("image"), async (req, res) => {
//   try {
//     const imagePath = req.file.path;
//     const imageBytes = fs.readFileSync(imagePath);

//     const [result] = await visionClient.labelDetection({
//       image: { content: imageBytes },
//       imageContext: { languageHints: ["en"] },
//     });

//     const labels = result.labelAnnotations;
//     if (!labels || labels.length === 0) {
//       return res.status(404).json({ message: "No plant detected." });
//     }

//     const topLabel = labels[0];
//     const name = topLabel.description;
//     const confidence = Math.round(topLabel.score * 100);
//     const isInvasive = INVASIVE_LIST.has(normalize(name));

//     // Clean up uploaded file
//     fs.unlinkSync(imagePath);

//     return res.json({
//       scientific_name: name,
//       confidence_percent: confidence,
//       invasive: isInvasive,
//     });
//   } catch (error) {
//     console.error("Error during image analysis:", error.message);
//     res.status(500).json({ error: "Failed to analyze image." });
//   }
// });

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
