const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' })); // JSON body accept karne ke liye

app.get('/hot', (req, res) => {
  fetch('https://raw.githubusercontent.com/hajrateali/newrepo/main/data.json')
    .then(r => r.json())
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ error: "Failed to fetch data" });
    });
});

// ---- Yaha se naya route start ----

app.put('/upload', (req, res) => {
  const newImages = req.body; // Jo browser se bheja gaya hai

  if (!Array.isArray(newImages)) {
    return res.status(400).send({ error: "Data must be an array of images" });
  }

  // Step 1: Pahle purana data read karo
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ error: "Failed to read existing data" });
    }

    let existingData = [];
    try {
      existingData = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send({ error: "Existing data is not valid JSON" });
    }

    // Step 2: Existing data ke sath naye images jod do
    const updatedData = [...existingData, ...newImages];

    // Step 3: JSON file me updated data wapas likho
    fs.writeFile('data.json', JSON.stringify(updatedData, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).send({ error: "Failed to update data" });
      }
      res.send({ success: true, message: "Images added successfully!" });
    });
  });
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
