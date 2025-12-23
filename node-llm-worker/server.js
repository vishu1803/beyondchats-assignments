const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.post("/generate", (req, res) => {
  exec("node index.js", (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr);
    res.send(stdout);
  });
});

app.listen(5000, () => console.log("Generator API running on 5000"));
