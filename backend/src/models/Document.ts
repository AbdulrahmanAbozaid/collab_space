// Document.ts

import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

interface VersionHistory {
  version_id: mongoose.Types.ObjectId;
  content: string;
  updated_at: Date;
}

interface MediaFile {
  file_url: string;
  file_type: string;
  local_path?: string; // Local file storage path
}

interface IDocument extends MongooseDocument {
  title: string;
  type: string;
  content: string;
  created_by: mongoose.Types.ObjectId; // User who created the document
  collaborators: mongoose.Types.ObjectId[]; // Users collaborating on the document
  version_history: VersionHistory[];
  media_files?: MediaFile[];
  local_file_path?: string;
  created_at: Date;
  updated_at: Date;
}

const VersionHistorySchema = new Schema<VersionHistory>({
  version_id: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});

const MediaFileSchema = new Schema<MediaFile>({
  file_url: { type: String, required: true },
  file_type: { type: String, required: true },
  local_path: { type: String },
});

const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  collaborators: { type: [Schema.Types.ObjectId], ref: "User", default: [] }, // Collaborators
  version_history: { type: [VersionHistorySchema], default: [] },
  media_files: { type: [MediaFileSchema], default: [] },
  local_file_path: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const DocumentModel = mongoose.model<IDocument>("Document", DocumentSchema);
export default DocumentModel;
