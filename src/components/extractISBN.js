import Epub from 'epubjs';
import axios from 'axios';

export const extractMetadataFromEPUB = async (file) => {
  return new Promise(async (resolve, reject) => {
    const book = new Epub(file);

    try {
      await book.opened; // Wait for the book to open
      const metadata = book.package.metadata;
      const title = metadata.title || 'Title not found';
      const author = metadata.creator || 'Author not found';

      // Initialize variables for additional info
      let additionalInfo = [];

      // Try fetching information based on title and author
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`${author} ${title}`)}`);

      // Collect the first 10 options
      if (response.data.totalItems > 0) {
        additionalInfo = response.data.items.slice(0, 10).map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || ['Author not found'],
          coverImageUrl: `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w240-h345`, // Constructed URL
          description: item.volumeInfo.description || 'Description not available',
          publishedDate: item.volumeInfo.publishedDate || 'Published date not available',
          isbn13: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 'ISBN-13 not found',
          isbn10: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || 'ISBN-10 not found',
        }));
      }

      // Resolve with metadata including additional info
      resolve({
        title,
        author,
        additionalInfo,
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Custom search function for manual user input
export const searchByISBNOrTitle = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);

      let additionalInfo = [];

      if (response.data.totalItems > 0) {
        additionalInfo = response.data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          subtitle: item.volumeInfo.subtitle || '',
          authors: item.volumeInfo.authors || ['Author not found'],
          coverImageUrl: `https://books.google.com/books/publisher/content/images/frontcover/${item.id}?fife=w240-h345`, // Constructed URL
          description: item.volumeInfo.description || 'Description not available',
          publishedDate: item.volumeInfo.publishedDate || 'Published date not available',
          isbn13: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 'ISBN-13 not found',
          isbn10: item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || 'ISBN-10 not found',
        }));
      }

      resolve(additionalInfo);
    } catch (err) {
      reject(err);
    }
  });
};
