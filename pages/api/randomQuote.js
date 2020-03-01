import allQuotes from '../../quotes.json';

export default (req, res) => {
  const { movie } = req.query;
  let quotes = allQuotes;

  if (movie) {
    quotes = quotes.filter(quote => quote.movie.toLowerCase().includes(movie.toLowerCase()));
  }
  if (!quotes.length) {
    quotes = allQuotes.filter(quote => quote.movie.toLowerCase() === 'unknown');
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(200).json(quote);
};
