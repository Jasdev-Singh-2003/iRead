import React from "react";
import { Routes, Route } from "react-router-dom";
import Reader from "./components/Reader.jsx";
// import { uploadToGithub } from "./components/Upload.jsx";
import UploadForm from "./components/UploadForm.jsx";

const App = () => {
  // const handleUpload = async () => {
  //   const folderName = "hello-world"; // Specify the folder name
  //   const fileContent = "Hello World"; // This should be your file content
  //   const fileName = "test-hello-world.txt"; // Specify the file name
    
  //   await uploadToGithub(fileContent, fileName, folderName);
  // };

  return (
    <>
      {/* <button onClick={handleUpload}>Upload File</button> */}
      <h1>Upload EPUB and Cover Image</h1>
      <UploadForm />

      <Routes>
        <Route path='/reader' element={<Reader />}></Route>
      </Routes>
    </>
  );
};

export default App;
