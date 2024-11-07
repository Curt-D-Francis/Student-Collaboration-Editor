import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { fetchDocuments } from "../api/editorAPI"; // Import the function to fetch all documents

function Document() {
  const [documents, setDocuments] = useState([]); // Store the list of documents
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docList = await fetchDocuments(); // Fetch list of documents
        setDocuments(docList);
      } catch (error) {
        console.error("Failed to load documents:", error);
      }
    };

    loadDocuments();
  }, []);

  const handleEditDocument = (documentId) => {
    // Navigate to DocumentEditor with the specific documentId
    navigate(`/documents/${documentId}`);
  };

  return (
    <>
      <Header />
      <div>
        <h1>Documents</h1>
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
              <button onClick={() => handleEditDocument(doc.id)}>
                Edit Document
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Document;
