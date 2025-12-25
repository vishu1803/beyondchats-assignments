require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const winston = require("winston");

const app = express();
app.use(cors());
app.use(express.json());

// ================= LOGGING =================
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// ================= QUEUE =================
let queue = [];
let running = false;

function runQueue() {
  if (running || queue.length === 0) return;

  running = true;
  const job = queue.shift();

  logger.info("🧠 Processing LLM Job", { articleId: job.articleId });

  exec(job.command, { timeout: 300000 }, (err, stdout, stderr) => {
    running = false;

    if (err) {
      logger.error("❌ LLM FAILED", { stderr });

      try {
        job.res.status(500).json({
          success: false,
          message: "Generation Failed",
          error: stderr,
        });
      } catch (_) {}
    } else {
      logger.info("✅ LLM SUCCESS");

      try {
        job.res.json({
          success: true,
          message: "Article Generated Successfully",
          output: stdout,
        });
      } catch (_) {}
    }

    runQueue();
  });
}

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Generator Server Running 🚀");
});

// ================= GENERATE =================
app.post("/generate", (req, res) => {
  const articleId = req.body?.id || null;

  logger.info("⚡ Generation Requested", {
    articleId: articleId ?? "LATEST ARTICLE",
  });

  const cmd = articleId ? `node index.js ${articleId}` : "node index.js";

  queue.push({
    articleId,
    command: cmd,
    res,
  });

  runQueue();
});

// ================= START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Generator API running on ${PORT}`));
