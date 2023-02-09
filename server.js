require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbConnect = require("./configs/db.js");
const URL = require("./models/url");
const methodeOverride = require("method-override");
const url = require("./models/url");
// require db connect function from configs
// require routes

// middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodeOverride("_method"));
app.set("view engine", "ejs");

//routes
app.get("/", async (req, res) => {
  res.redirect("/page-1");
});

// pagination
app.get("/page-:pageNo", async (req, res, next) => {
  const LINKS_PER_PAGE = 5;
  // checking if it is a page number or something else like short link
  const reg = new RegExp("^[0-9]$");
  if (!reg.test(req.params.pageNo)) next();

  // varibales to send
  const totalLinks = parseInt(await URL.countDocuments({}));
  const pages = parseInt(Math.ceil(totalLinks / LINKS_PER_PAGE));
  const pageNo = parseInt(req.params.pageNo);
  const skipLinks = (pageNo - 1) * LINKS_PER_PAGE;

  // retriveing urls according to the pages
  const urls = await getUrls(skipLinks, LINKS_PER_PAGE);
  res.render("index", { urls, pages, pageNo });
});

async function getUrls(skipLinks, limitLinks) {
  return await URL.find()
    .sort({ timestamp: -1 })
    .skip(skipLinks)
    .limit(limitLinks);
}

//new Short Url
app.post("/", async (req, res) => {
  await URL.create({
    fullUrl: req.body.fullUrl,
  });
  res.redirect("/");
});

// shortUrl Route
app.get("/:shortUrl", async (req, res) => {
  const url = await URL.findOne({ shortUrl: req.params.shortUrl });
  console.log(url);
  if (url == null) return res.sendStatus(404);

  url.clicks++;
  await url.save();

  res.redirect(url.fullUrl);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await URL.findByIdAndDelete(id);
    console.log(result);
    res.redirect("/");
  } catch (e) {
    console.log(e.message);
  }
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  await URL.findByIdAndUpdate(id, { fullUrl: req.body.fullUrl });
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const url = await URL.findById(req.params.id);
  res.render("edit.ejs", { url: url });
});

//route for delete and update

//listening to the requests
app.listen(process.env.PORT, () => {
  console.log("server is listening");
  dbConnect();
});
