import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Document from "./pages/Document";
import DocumentEditor from "./components/DocumentEditor";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/document" element={<Document />} />
          <Route path="/documents/:documentId" element={<DocumentEditor />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
