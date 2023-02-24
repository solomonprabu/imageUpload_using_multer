const express = require("express");
const app = express();
const path = require("path");         //Importing required libraries
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");                //creating a storage destination for the uploaded files
  },

  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      file.originalname.replace(/\.[^/.]/, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)  //Adding timestamp to the file name to make it as an unique ID
    );
  },
});

const maxSize = 5 * 1000 * 1000;    //Limiting the file size within 5MB to upload

let upload = multer({
  storage: storage,                             //File conditions for uploading (i.e: size, type)
  limits: {
    fileSize: maxSize,
    fileFilter: function (res, file, cb) {
      let filetypes = /jpeg,jpg,png/;
      let mimetype = filetypes.test(file.mimetype);
      let extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(
        "Error: File upload only supports the following filetypes: " + filetypes
      );
    },
  },
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("uploads");
});

app.post("/uploads", upload.single("image"), (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError && err.code == "LIMIT_FILE_SIZE") {
        return res.send("file exceeds the allowed limit");
      }
      res.send(err);
    } else {
      res.send("uploaded successfully");
    }
  });
});

app.listen(3001);
console.log("3001 is the port");
