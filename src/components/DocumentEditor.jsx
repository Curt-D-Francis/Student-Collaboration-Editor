import React, { useEffect, useState } from "react";
import { fetchDocument, updateCollaboratorPermission } from "../api/editorAPI";
function DocumentEditor() {
  const [document, setDocument] = useState(null);
  useEffect(() => {
    // Fetch document data on component mount
    const loadDocument = async () => {
      try {
        const docData = await fetchDocument(documentId);
        setDocument(docData);
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };

    loadDocument();
  }, [documentId]);

  const handleAddCollaborator = async (userId, permission) => {
    try {
      const result = await updateCollaboratorPermission(
        documentId,
        userId,
        permission
      );
      console.log("Collaborator updated:", result);
    } catch (error) {
      console.error("Failed to update collaborator:", error);
    }
  };
  return (
    <>
      <div>
        <h1>{document?.title}</h1>
        <p>{document?.content}</p>
        {/* Render UI for editing and adding collaborators here */}
      </div>
    </>
  );
}

export default DocumentEditor;
