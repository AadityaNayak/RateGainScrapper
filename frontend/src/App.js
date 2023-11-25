import React, { useState } from "react";
import { CSVLink } from "react-csv";
import "./App.css";

function App() {
  const problemStatementName = "Web scraping challenge";

  const url = "https://rate-gain-scraper.onrender.com";
  const [page, setPage] = useState("");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [downloadAll, setDownloadAll] = useState(false);
  const [downloadOne, setDownloadOne] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setPage(event.target.value);
  };

  const handlePageSubmit = async () => {
    if (!page || isNaN(page) || page <= 0) {
      window.alert("Please enter a valid page number");
      return;
    }

    // Additional checks for URL validity
    if (!isValidURL(url)) {
      window.alert("Invalid URL");
      return;
    }

    setDownloadOne(true);
    setDownloadAll(false);
    setLoading(true);

    try {
      const response = await fetch(`${url}/page/${page}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Additional checks for the sanity of the response
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid data format received from the server");
      }

      setData(jsonData);
    } catch (error) {
      console.error("Error fetching page data:", error.message);
      window.alert("Error fetching page data. Please try again later.");
    } finally {
      setLoading(false);
    }
    if (!page || isNaN(page) || page <= 0) {
      window.alert("Please enter a valid page number");
      return;
    }

    // Additional checks for URL validity
    if (!isValidURL(url)) {
      window.alert("Invalid URL");
      return;
    }

    setDownloadOne(true);
    setDownloadAll(false);
    setLoading(true);

    try {
      const response = await fetch(`${url}/page/${page}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching page data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAllPagesSubmit = async () => {
    setDownloadAll(true);
    setDownloadOne(false);
    setPage("");
    setLoading(true);

    try {
      const response = await fetch(`${url}/all_pages`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch all pages. Status: ${response.status}`
        );
      }

      const jsonData = await response.json();

      // Additional checks for the sanity of the response
      if (!Array.isArray(jsonData)) {
        throw new Error("Invalid data format received from the server");
      }

      setAllData(jsonData);
    } catch (error) {
      console.error("Error fetching all pages data:", error.message);
      window.alert("Error fetching all pages data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const startServer = async () => {
    setDownloadAll(false);
    setDownloadOne(false);
    setLoading(true);
    setPage("");

    try {
      await fetch(`${url}/`);
    } catch (error) {
      console.error("Error starting the server:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidURL = (url) => {
    // Implement your URL validation logic here
    // Example: Check if the URL starts with "http://" or "https://"
    return /^https?:\/\//.test(url);
  };

  return (
    <div>
      <div className="App">
        <h1 className="banner-heading">{problemStatementName}</h1>
        <h5>
          <h6>
            Scraping from{" "}
            <b>
              {" "}
              {" <<< "}
              <a
                href="https://rategain.com/blog"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"https://rategain.com/blog"}
              </a>
              {" >>>"}
            </b>
          </h6>
        </h5>
        <br />
        <h6>
          <i>Extracting following fields for each blog</i>
        </h6>
        <h6>
          <b>[blog title, blog date, image url, likes count]</b>
        </h6>
        <input
          type="number"
          className="input-field"
          value={page}
          onChange={handleInputChange}
          placeholder="Enter page number"
        />
        <div className="button-container">
          <button className="btn" onClick={handlePageSubmit}>
            Extract Page
          </button>
          {downloadOne && data.length > 0 && (
            <CSVLink className="btn" data={data} filename={"page-data.csv"}>
              Download Page Data
            </CSVLink>
          )}

          <button className="btn" onClick={handleAllPagesSubmit}>
            Extract All Pages
          </button>
          {downloadAll && allData.length > 0 && (
            <CSVLink
              className="btn"
              data={allData}
              filename={"all-pages-data.csv"}
            >
              Download All Pages Data
            </CSVLink>
          )}

          <button className="btn" onClick={startServer}>
            Start Server
          </button>
        </div>
          
        {loading && <div className="loading">Loading...</div>}
        <div className="data-display">
          {(downloadOne ? data : allData).map((item, index) => (
            <div key={index} className="data-item">
              <h3>{`${item["blog title"]}` || "No Title"}</h3>
              <a
                target="__blank"
                rel="noopener noreferrer"
                href={`${item["link"]}`}
              >

                Visit &#128279;
              </a>
              <p></p>
              <p>Date: {item["blog date"] || "No Date"}</p>
              <p>{`Page number: ${item["page number"]}`}</p>
              <img
                src={item["image URL"]}
                alt="blog"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if the same image URL is repeatedly invalid
                  e.target.src = "fallback-image-url"; // Provide a fallback image URL or handle the error in another way
                }}
              />
              <p>
                <span role="img" aria-label="like emoji">
                  &#128077;
                </span>
                <span> {item["likes count"] || 0} </span>
              </p>
            </div>
          ))}
        </div>

        
        <p style={{"maxWidth": "600px", color: "#f77000", fontWeight: "bold", padding: "10px"}}><i>*NOTE: The backend server is hosted on free hosting platform render.com and may enter a sleep state after a period of inactivity (no requests for a period of time). To resume, simply click "Start Server" and wait for the loading process to complete (max 4 or 5 min). Once done, you can freely use the application for other tasks. Note that this action is required when returning to the application after a break of 15 minutes. Happy Extracting! 🚀</i></p>
      </div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4>About</h4>
              <p className="footer-about">
                This web application systematically navigates through the pages
                of https://rategain.com/blog to comprehensively gather data. The
                collected information is then organized into a CSV file,
                allowing users to conveniently download and perform detailed
                analysis.
              </p>
            </div>
            <div class="col-md-4">
              <h4>Developer</h4>
              <ul>
                <li>
                  <a
                    href="https://www.linkedin.com/in/aaditya-nayak-an73a8208/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Aaditya Nayak
                  </a>
                  <a
                    href="https://github.com/AadityaNayak"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i> | GitHub | </i>
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-md-4">
              <h4>Contact</h4>
              <p>
                Email:{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=aadityanayak7@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aadityanayak7@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="copyright">&copy; 2023</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
