// Notification.ts

import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface INotification extends MongooseDocument {
  user_id: mongoose.Types.ObjectId; // User to whom the notification belongs
  type: string;
  message: string;
  read: boolean;
  created_at: Date;
}

export const NotificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
export default NotificationModel;
