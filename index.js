const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (rep, res) => {
  res.send('hello world!')
})

app.ge('./youtube', (rep, res) = {
  res send('ali')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});