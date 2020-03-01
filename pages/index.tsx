import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { colors } from "../colors";
import { useState } from "react";
import Header from "../components/Header";
import { NextPage } from "next";

function fetcher(url: string) {
  return fetch(url).then(r => r.json());
}

const Index: NextPage<{}> = () => {
  const [reveal, setReveal] = useState(false);
  const { query } = useRouter();
  const { data, error } = useSWR(
    `/api/randomQuote${query.movie ? "?movie=" + query.movie : ""}`,
    fetcher
  );
  // The following line has optional chaining, added in Next.js v9.1.5,
  // is the same as `data && data.movie`
  const movie = data?.movie;
  const year = data?.year;
  let quote = data?.quote;

  const revealAnswer = () => {
    setReveal(true);
  };

  const fetchNewQuote = () => {
    setReveal(false);
    mutate(`/api/randomQuote`);
  };

  if (!data) quote = "Loading...";
  if (error) quote = "Failed to fetch the quote.";

  return (
    <main className="center">
      <Header />
      <div className="quoteContainer">
        <div className="quote">{quote}</div>
        {reveal && movie ? (
          <span className="movie">{`${movie} (${year})`}</span>
        ) : (
          "..."
        )}
      </div>
      <div className="footer">
        <div
          className={reveal ? "textButton disbled" : "textButton"}
          onClick={revealAnswer}
        >
          Which movie is this taken from?
        </div>
        <div className="textButton" onClick={fetchNewQuote}>
          New random quote
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          height: 100vh;
          margin: 0;
          font-family: Poppins;
        }
        #__next {
          height: 100vh;
          background-color: ${colors.navy};
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <style jsx>{`
        main {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          height: 100vh;
          text-align: center;
          background-color: ${colors.navy};
          color: ${colors.white};
        }
        .quote {
          font-size: 32px;
          padding-bottom: 10px;
          margin: 0px 20px;
        }
        .movie {
          font-size: 18px;
        }
        .textButton {
          background-color: ${colors.white};
          color: ${colors.navy};
          border-radius: 8px;
          padding: 8px;
          margin: 12px;
          font-size: 18px;
          cursor: pointer;
          text-decoration: none;
          width: -moz-fit-content;
        }
        .disbled {
          cursor: auto;
          background-color: transparent;
          color: ${colors.gray};
        }
        .footer {
          display: flex;
          flex-direction: row;
          padding-bottom: 32px;
          justify-content: center;
        }
      `}</style>
    </main>
  );
};

export default Index;
