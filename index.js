import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Express Server ON");
});

app.listen(1048, () => {
  console.log("Server is running on port${port}");
});
