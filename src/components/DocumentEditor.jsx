import React, { useState } from "react";

function DocumentEditor() {
  const [textContent, setTextContent] = useState("");

  return (
    <>
      <div>
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          rows="5"
          cols="40"
        />
      </div>
    </>
  );
}

export default DocumentEditor;
