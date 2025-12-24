const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Generator Server Running");
});

// Generate Route
app.post("/generate", (req, res) => {
  const articleId = req.body?.id || null;

  console.log("🚀 LLM Generation Triggered");
  console.log("Article ID:", articleId ?? "LATEST ARTICLE");

  // If ID is provided → pass it, else fallback to latest
  const cmd = articleId ? `node index.js ${articleId}` : "node index.js";

  exec(cmd, { timeout: 300000 }, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ LLM Failed", stderr);
      return res.status(500).json({
        success: false,
        message: "Generation Failed",
        error: stderr,
      });
    }

    console.log("✅ LLM Success");
    console.log(stdout);

    res.json({
      success: true,
      message: "Article Generated Successfully",
      output: stdout,
    });
  });
});

app.listen(5000, () => console.log("Generator API running on 5000"));
