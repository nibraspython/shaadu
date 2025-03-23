const express = require("express");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public")); // Serve static files

app.get("/", (req, res) => {
  exec("php -f index.php", (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(stdout);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
