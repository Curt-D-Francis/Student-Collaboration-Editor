const express = require('express');
const Document = require('./models/Document');

const router = express.Router();

// Endpoint to update user permissions
router.put('/documents/:documentId/permissions', async (req, res) => {
  const { documentId } = req.params;
  const { userId, newPermission } = req.body;

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is already in collaborators
    const collaboratorIndex = document.collaborators.findIndex(
      (collaborator) => collaborator.userId.toString() === userId
    );

    if (collaboratorIndex === -1) {
      // User is not a collaborator, so add them with the new permission
      document.collaborators.push({ userId, permission: newPermission });
    } else {
      // User is already a collaborator, so update their permission
      document.collaborators[collaboratorIndex].permission = newPermission;
    }

    await document.save();
    return res.json({ message: 'Permission updated successfully', document });
  } catch (error) {
    console.error('Error updating permission:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
