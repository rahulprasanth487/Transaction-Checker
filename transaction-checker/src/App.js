import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload/fileUpload';
import ExtractParams from './components/Extraction/ExtractParams';

const App = () => {

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="h-[calc(100vh-4rem)]">
        <div className="bg-gray-200 p-1 h-full flex flex-row w-full">
          <div id='file-upload' className="bg-white h-full w-1/4 m-1">
            <FileUpload />
          </div>
          <div id='extraction' className="bg-white h-full w-3/4 m-1">
            <ExtractParams />
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;