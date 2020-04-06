import axios from "axios";
import parser from "node-html-parser";

const URL_THRILLIST =
  "https://www.thrillist.com/entertainment/nation/best-movie-quotes";

axios.get(URL_THRILLIST).then(
  response => {
    if (response.status === 200) {
      const html = response.data;
      var root = parser.parse(html);

      // select all the quote containers
      const quoteContainers = root.querySelectorAll(
        '[data-page-element-has-header="1"]'
      );

      console.log(`Parsing ${quoteContainers.length} quotes`);

      // actually parse the quotes: content, movie title and year
      let quotesArray = [];
      quoteContainers.map(qc => {
        const rawQuote = qc.querySelector("h2").rawText;
        const quote = extractQuote(rawQuote);

        const rawDesc = qc.querySelector("strong").rawText;
        const title = extractTitle(rawDesc);
        const year = extractYear(rawDesc, title);

        quotesArray.push({ quote: quote, movie: title, year: year });
      });

      console.log(JSON.parse(JSON.stringify(quotesArray)));
    }
  },
  error => console.log(err)
);

/**
 * Extract the real quote from the raw text.
 * Ex of a raw quote: '100. "I don't have friends. I got family."'
 * @param {*} rawQuote
 */
const extractQuote = rawQuote => {
  const regex = /[0-9]{1,3}. "/;
  const titleArray = rawQuote.match(regex);

  if (!titleArray || titleArray.length < 1) {
    return undefined;
  }

  console.log(rawQuote.substring(titleArray[0].length, rawQuote.length));

  return rawQuote
    .substring(titleArray[0].length, rawQuote.length - 1)
    .replace(/"/g, "");
};

/**
 * Extract the title from the raw text.
 * Ex of raw text: 'Furious 7 (2015)'
 * @param {*} rawText
 */
const extractTitle = rawText => {
  return rawText.substring(0, rawText.indexOf("(")).trim();
};

/**
 * Extract the year from the raw text.
 * Ex of raw text: 'Furious 7 (2015)'
 * @param {*} rawText
 * @param {*} title
 */
const extractYear = (rawText, title) => {
  return rawText
    .substring(title.length, rawText.length)
    .trim()
    .replace("(", "")
    .replace(")", "")
    .replace(/'/g, "");
};
