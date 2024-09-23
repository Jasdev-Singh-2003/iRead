import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Reader from './components/Reader.jsx';

const App = () => {
  const [location, setLocation] = useState(0);

  return (
    <>
    hello world
      <Routes>
        <Route path='/reader' element={<Reader />}></Route>
      </Routes>
    </>
  );
};

export default App;
