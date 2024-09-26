import React, { useState } from "react";
import { extractMetadataFromEPUB, searchByISBNOrTitle } from "./extractISBN"; // Import functions

const UploadForm = () => {
  const [metadata, setMetadata] = useState({});
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isbn, setIsbn] = useState(""); // New state for ISBN search query
  const [title, setTitle] = useState(""); // New state for title
  const [author, setAuthor] = useState(""); // New state for author

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];

    try {
      const result = await extractMetadataFromEPUB(file);
      setMetadata(result);
      setError("");
    } catch (err) {
      setError("Error extracting metadata: " + err.message);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    let query = "";

    // Construct the query string
    if (isbn) {
      query = isbn;
    } else if (title && author) {
      query = `${title} ${author}`;
    } else {
      setError("Please enter either ISBN or both title and author.");
      return;
    }

    try {
      const result = await searchByISBNOrTitle(query);
      setMetadata({ additionalInfo: result });
      setError("");
    } catch (err) {
      setError("Error searching for the book: " + err.message);
    }
  };

  return (
    <div>
      {/* EPUB Upload Form */}
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" accept=".epub" required />
        <button type="submit">Extract Metadata</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display search results */}
      {metadata.additionalInfo && (
        <div>
          <h3>Select the best fit:</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {metadata.additionalInfo.map((book) => (
              <div
                key={book.id}
                onClick={() => handleSelectBook(book)}
                style={{
                  cursor: "pointer",
                  margin: "10px",
                  textAlign: "center",
                }}
              >
                <h4>{book.title}</h4>
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  style={{ width: "100px" }}
                />
                <p>Authors: {book.authors.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Search Form */}
      <form onSubmit={handleManualSearch}>
        <h3>Can't find the book? Search manually:</h3>
        <div>
          <label>
            ISBN-10 or ISBN-13:
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Enter ISBN"
            />
          </label>
        </div>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter Author"
            />
          </label>
        </div>
        <button type="submit">Search</button>
      </form>

      {/* Display selected book details */}
      {selectedBook && (
        <div>
          <h4>Selected Book:</h4>
          <h5>Title: {selectedBook.title}
          {selectedBook.subtitle && <span>: {selectedBook.subtitle}</span>}
          </h5>
          {/* <h5>Subtitle: {selectedBook.subtitle}</h5> */}
          <p>Authors: {selectedBook.authors.join(", ")}</p>
          <p>ISBN-13: {selectedBook.isbn13}</p>
          <p>ISBN-10: {selectedBook.isbn10}</p>
          <p>Description: {selectedBook.description}</p>
          <p>Published Date: {selectedBook.publishedDate}</p>
          <img src={selectedBook.coverImageUrl} alt={selectedBook.title} />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
