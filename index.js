const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

const REPO_OWNER = "hajrateali"; // Tumhara GitHub username
const REPO_NAME = "newrepo";     // Tumhara GitHub repo name

app.put('/upload', async (req, res) => {
  const images = req.body;

  if (!Array.isArray(images)) {
    return res.status(400).send({ error: "Data must be an array of images" });
  }

  try {
    for (const img of images) {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${img.name}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Upload ${img.name}`,
          content: img.content
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'GitHub upload failed');
      }
    }

    res.send({ success: true, message: "All images uploaded to GitHub!" });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
