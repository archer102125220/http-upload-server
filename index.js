const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require('cors');
const multer = require("multer");

const app = express();

if (fs.existsSync("./public/uploads") === false) {
  fs.mkdirSync("./public/uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("upload");

app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/upload-img", function (req, res) {
  const imgList = [];
  fs.readdirSync(path.join(__dirname, "public/uploads")).forEach((file) => {
    imgList.push(file);
  });
  res.json(imgList);
});
app.post("/upload-img", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).end("Error uploading file.");
    }
    // console.log(req);
    // res.end("File is uploaded successfully!");
    res.json({
      uploaded: true,
      url: 'http://localhost:2000/public/uploads/' + req.file.originalname
    })
  });
});

app.listen(2000, function () {
  console.log("Server is running on port 2000");
});
