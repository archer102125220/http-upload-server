const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require('cors');
const multer = require("multer");

const app = express();

if (fs.existsSync("./uploads") === false) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("upload");

app.use(cors());
app.use("/comps", express.static(path.join(__dirname, "comps")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/uploadjavatpoint", function (req, res) {
  const imgList = [];
  fs.readdirSync(__dirname + "/uploads").forEach((file) => {
    imgList.push(file);
  });
  res.json(imgList);
});
app.post("/upload-img", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Error uploading file.");
    }
    // console.log(req);
    // res.end("File is uploaded successfully!");
    res.json({
      uploaded: true,
      url: 'http://localhost:2000/uploads/' + req.file.originalname
    })
  });
});

app.listen(2000, function () {
  console.log("Server is running on port 2000");
});
