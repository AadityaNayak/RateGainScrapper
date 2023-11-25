# RateGain Extractor

## Overview

Welcome to the RateGain Data Extractor, a web application designed to systematically gather and organize data from the RateGain blog. The application utilizes web scraping techniques to extract blog titles, publication dates, image URLs, and likes counts from various blog posts.

## Tech Stack

### Frontend
- **Markup:** HTML
- **Style:** CSS, Bootstrap
- **Scripting:** JavaScript
- **Libraries:** ReactJS, npm

### Backend
- **Server Environment:** Node.js
- **Library:** Express, npm

### Scraping Library
- **Cheerio**

### Hosting
- **Backend:** [render.com](https://render.com/)
- **Frontend:** [netlify.com](https://www.netlify.com/)

## Features

- Extraction of data on a particular page.
- Download single-page data.
- Extraction of all pages data at once in CSV format.
- Download all pages data at once in CSV format.

## Limitations

The backend server, hosted on [render.com](https://render.com/), may go to sleep due to inactivity. To resume, click "Start Server" and wait for loading. Once done, freely use the app. This is needed after a 15-minute break.

## Usage

To run the application, follow these steps:

1. Install [Node.js](https://nodejs.org/) on your PC.
2. Navigate to the `frontend` folder in the command line interface (CLI).
3. Run `npm install` to install the necessary dependencies.
4. Run `npm start` to start the frontend application.

5. Navigate to the `backend` folder in the CLI.
6. Run `npm install` to install the necessary dependencies.
7. Run `node index.js` to start the backend server.

Access the application through the live link hosted on [Netlify](https://rate-gain-extractor.netlify.app/).

## GitHub Repository

Find the source code and additional information on the [GitHub repository](https://github.com/AadityaNayak/rate-gain-extractor).

## Demo

Watch a demonstration of the application on [YouTube](https://youtu.be/DqkUTlX5D10).
