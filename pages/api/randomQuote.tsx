import allQuotes from "../../quotes.json";
import { NextApiRequest, NextApiResponse } from "next";

const getRandomQuote = (req: NextApiRequest, res: NextApiResponse) => {
  let { movie } = req.query;
  let quotes = allQuotes;

  // NextApiRequest query could either be a string or an array of string
  const movieStr: string = Array.isArray(movie) ? movie[0] : movie;

  if (movieStr) {
    quotes = quotes.filter(quote =>
      quote.movie.toLowerCase().includes(movieStr.toLowerCase())
    );
  }

  if (!quotes.length) {
    quotes = allQuotes.filter(quote => quote.movie.toLowerCase() === "unknown");
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(200).json(quote);
};

export default getRandomQuote;
