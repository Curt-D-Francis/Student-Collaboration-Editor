const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'; //Have to change when using vercel

// Function to create a new document
export const createDocument = async (title, content, ownerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, owner: ownerId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Function to fetch a specific document by its ID
export const fetchDocument = async (documentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Function to update document content
export const updateDocument = async (documentId, newContent) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newContent }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Function to add or update collaborator permissions
export const updateCollaboratorPermission = async (documentId, userId, newPermission) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newPermission }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating collaborator permission:', error);
    throw error;
  }
};

// Function to delete a document
export const deleteDocument = async (documentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};