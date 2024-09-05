// RealTimeCollaborationSession.ts

import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

interface ActivityLog {
  user_id: mongoose.Types.ObjectId;
  action: string;
  timestamp: Date;
}

interface IRealTimeCollaborationSession extends MongooseDocument {
  document_id: mongoose.Types.ObjectId;
  connected_users: mongoose.Types.ObjectId[]; // Users connected in real-time
  activity_log: ActivityLog[];
  voice_call: boolean;
  created_at: Date;
  updated_at: Date;
}

const ActivityLogSchema = new Schema<ActivityLog>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const RealTimeCollaborationSessionSchema = new Schema<IRealTimeCollaborationSession>({
  document_id: { type: Schema.Types.ObjectId, ref: "Document", required: true },
  connected_users: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  activity_log: { type: [ActivityLogSchema], default: [] },
  voice_call: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const RealTimeCollaborationSessionModel = mongoose.model<IRealTimeCollaborationSession>(
  "RealTimeCollaborationSession",
  RealTimeCollaborationSessionSchema
);
export default RealTimeCollaborationSessionModel;
