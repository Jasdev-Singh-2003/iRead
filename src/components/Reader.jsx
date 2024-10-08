import React, { useState } from "react";
import { ReactReader } from "react-reader";

const Reader = () => {
  const [location, setLocation] = useState(0);
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url="https://jasdev-singh-2003.github.io/iRead-Data/epubs/project-hail-mary.epub"
        location={location}
        locationChanged={(epubcfi) => setLocation(epubcfi)}
      />
    </div>
  );
};

export default Reader;
