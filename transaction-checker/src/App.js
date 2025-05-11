import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload/fileUpload';
import ExtractParams from './components/Extraction/ExtractParams';
import LandingPage from './landing';

const Dashboard = () => (
  <main className="h-[calc(100vh-4rem)]">
    <Navbar />
    <div className="bg-gray-200 p-1 h-full flex flex-row w-full">
      <div id='file-upload' className="bg-white h-full w-1/4 m-1">
        <FileUpload />
      </div>
      <div id='extraction' className="bg-white h-full w-3/4 m-1">
        <ExtractParams />
      </div>
    </div>
  </main>
);

const App = () => {

  return (
    <Router>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;