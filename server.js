const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
// Middleware to process req before recieving
app.use(express.json());
// Middleware to avoid cors error
app.use(cors());

const base_url = "https://rateain.com/blog";

function extractAndFormatDate(text) {
  // Regular expression to match date in "Month DD, YYYY" format
  const datePattern =
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4}/;
  const match = text.match(datePattern);

  if (match) {
    // Create a new Date object from the matched date
    const date = new Date(match[0]);

    // Format the date in "YYYY-MM-DD" format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } else {
    return "No date found in the text";
  }
}

async function scrapeBlogData() {
  let blogData = [];
  let pageNum = 1;

  while (true) {
    let url = `${base_url}/page/${pageNum}/`;
    if (pageNum === 1) url = base_url;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    if (response.status === 200) {
      const root = cheerio.load(response.data);
      const articles = root("article.blog-item");

      if (articles.length === 0) break;

      articles.each((index, element) => {
        const blogDetails = {};

        const titleElement = root(element).find("h6");
        blogDetails.title = titleElement.text().trim();

        const dateElement = root(element).find("div.bd-item span");
        blogDetails.date = dateElement.text().trim();
        blogDetails.date = extractAndFormatDate(blogDetails.date);

        const imageElement = root(element).find("a.rocket-lazyload");
        blogDetails.imageUrl = imageElement.attr("data-bg");

        const likesElement = root(element).find("a.zilla-likes span");
        blogDetails.likes = parseInt(likesElement.text().replace(" likes", ""));

        blogData.push({
          "page number": pageNum,
          "blog title": blogDetails.title,
          "blog date": blogDetails.date,
          "image URL": blogDetails.imageUrl,
          "likes count": blogDetails.likes,
        });
      });

      pageNum++;
    } else {
      break;
    }
  }

  return blogData;
}

async function scrapePageData(pageNum) {
  let blogData = [];
  let url = `${base_url}/page/${pageNum}/`;
  if (pageNum === 1) url = base_url;

  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    },
  });

  if (response.status === 200) {
    const root = cheerio.load(response.data);
    const articles = root("article.blog-item");

    articles.each((index, element) => {
      const blogDetails = {};

      const titleElement = root(element).find("h6");
      blogDetails.title = titleElement.text().trim();

      const dateElement = root(element).find("div.bd-item span");
      blogDetails.date = dateElement.text().trim();
      blogDetails.date = extractAndFormatDate(blogDetails.date);


      const imageElement = root(element).find("a.rocket-lazyload");
      blogDetails.imageUrl = imageElement.attr("data-bg");

      const likesElement = root(element).find("a.zilla-likes span");
      blogDetails.likes = parseInt(likesElement.text().replace(" likes", ""));

      blogData.push({
        "page number": pageNum,
        "blog title": blogDetails.title,
        "blog date": blogDetails.date,
        "image URL": blogDetails.imageUrl,
        "likes count": blogDetails.likes,
      });
    });
  }

  return blogData;
}

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.get("/all_pages", async (req, res) => {
  const blogData = await scrapeBlogData();
//   console.log(blogData);
  res.json(blogData);
});

app.get("/page/:page_number", async (req, res) => {
  const pageNum = req.params.page_number;
  const blogData = await scrapePageData(pageNum);
//   console.log(blogData);
  if (blogData.length === 0) res.send("Page is empty or does not exist");
  res.json(blogData);
});

app.listen(5000, () => {
  console.log("Server is running");
});
