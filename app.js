//jshint esversion:6
require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bsCustomFileInput = ('bs-custom-file-input');
const multer = require('multer');
const path = require("path");
const nodemailer = require("nodemailer");



const app = express();
const port = process.env.PORT || 3000;

//App settings
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('*/css', express.static('public/css'));
app.use('*/scripts', express.static('public/scripts'));
app.use('*/images', express.static('public/images'));


//Initialize DB and collections
mongoose.connect(process.env.DBPATH, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

// DB Schema
const articleSchema = new mongoose.Schema({
  image: String,
  title: String,
  detail: String,
  content: String,
  type: String
});

const Article = mongoose.model('Article', articleSchema);

// Picture Storage file path
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
// File check - only jpeg || png files
const fileFilter = function(req, file, cb) {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true);
  } else {
    cb(null, false); // Send error codes here
  }
}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

//--- Requests
//Home Page
app.get("/", function(req, res) {
  res.render("home");
});
//Portfolio
app.get("/portfolio", function(req, res) {
  Article.find({}, function(err, articles) {
    res.render("portfolio", {
      articles: articles
    });
  });
});
//Article
app.get("/portfolio/:selectArticle", function(req, res) {
  let articleSelect = req.params.selectArticle;
  Article.findOne({
    title: articleSelect
  }, function(err, article) {
    if (!err) {
      if (article.type === "article") {
        res.render("article", {
          article: article
        });
      } else if (article.type === "expo") {
        res.render("expo-piece", {
          article: article
        });
      }
    }
  });
});
//Contact page
app.get("/contact", function(req, res) {
  res.render("contact");
});
//Success page
app.get("/success", function(req, res) {
  res.render("success");
});
//Post-entry page
app.get("/post-entry", function(req, res) {
  res.render("post-entry");
});
//Post requests
//New Article to DB
app.post("/entryData", upload.single('postImg'), function(req, res, next) {
  article = new Article({
    image: req.file.filename,
    title: req.body.postTitle.trim(),
    detail: req.body.postDetail,
    content: req.body.postCont,
    type: req.body.postType
  });
  console.log(article);
  //Save Post to DB
  article.save(function(err) {
    if (!err) {
      res.redirect("/portfolio");
    }
  });
});

//Contact info to email
app.post("/contactForm", function(req, res) {
  let data = req.body;
  //Config SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.ionos.es",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //Email options
  transporter.sendMail({
    from: data.contactEmail,
    to: "info@laparanoia.com",
    subject: "Email desde la web",
    html: req.body.contactDetail
  }, function(error, response) { //callback
    if (error) {
      console.log(error);
    } else {
      res.redirect("/success");
    }
    transporter.close();
  });
});




//--- Listen
app.listen(port, function() {
  console.log("Server running on Port " + port);
})