import { Router } from "express";
import {
  createDocument,
  getDocument,
  getMyDocuments,
  updateDocument,
  deleteDocument,
  addCollaborator,
} from "../../controllers/documentController";
import { authorize } from "../../utils/auth";

const router = Router();

// Apply protect middleware to all routes to ensure only authenticated users can access these routes
router.use(authorize);

// Route to create a new document
router.post("/", createDocument);

// Route to get all documents of the authenticated user
router.get("/me", getMyDocuments);

// Route to get a single document by its ID
router.get("/:id", getDocument);

// Route to update a document by its ID
router.put("/:id", updateDocument);

// Route to add a collaborator to  a document by its ID
router.patch("/:id/collaborate", addCollaborator);

// Route to delete a document by its ID
router.delete("/:id", deleteDocument);

export default router;
