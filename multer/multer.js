const multer = require("multer");
const express = require("express");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

const uploads = multer({
  storage: fileStorageEngine,
  fileFilter: fileFilter,
});

module.exports = { uploads };
