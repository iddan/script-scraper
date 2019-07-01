# Script Scraper

`<script>` HTML tag scraper for Node.js

### Installation

```
npm install script-scraper
```

### Features

- Detects scripts added after load
- Secure
- Simple modern API

### Usage

#### With events

```javascript
const ScriptScraper = require("script-scraper");
const scriptScraper = new ScriptScraper("http://google.com");
scriptScraper.on("data", script => {
  console.log(script);
});
```

#### With async iteration

```javascript
const ScriptScraper = require("script-scraper");
async function example() {
  const scriptScraper = new ScriptScraper("http://google.com");
  for await (const script of scriptScraper) {
    console.log(script);
  }
}
example();
```

### API

`new ScriptScraper(url, userAgent)`

- url: `string` website url to scrape scripts from
- userAgent: `string` user agent to use for requests scraping scripts
