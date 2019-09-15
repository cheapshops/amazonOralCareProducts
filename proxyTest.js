const { ProxyCrawlAPI } = require('proxycrawl');
const cheerio = require('cheerio');
const api = new ProxyCrawlAPI({ token: '4rclWiQBxHSj4-lMyObTFA' });

var url ="https://www.amazon.com/Spinbrush-Sonic-Radiant-Replacement-Packaging/dp/B001U9JY8O/ref=sr_1_1319?_encoding=UTF8&qid=1568390343&s=beauty-intl-ship&sr=1-1319"

function parseHtml(html) {
  // Load the html in cheerio
  const $ = cheerio.load(html);
  console.log( html )
  // Load the reviews
  const reviews = $('.review');
  reviews.each((i, review) => {
    // Find the text children
    const textReview = $(review).find('.review-text').text();
    console.log(textReview);

  })
}

const requestsThreshold = 10;
var currentIndex = 0;
// setInterval(() => {
//   for (let index = 0; index < requestsThreshold; index++) {
    api.get(url).then(response => {
      // Process if response is success else skip
      if (response.statusCode === 200 && response.originalStatus === 200) {
        parseHtml(response.body);
      } else {
        console.log('Failed: ', response.statusCode, response.originalStatus);
      }
    });
    currentIndex++;
//   }
// }, 1000);