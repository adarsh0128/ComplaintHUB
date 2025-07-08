import mongoose, { Schema, model, models } from 'mongoose';

export interface IAdmin {
  _id?: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admin = models.Admin || model<IAdmin>('Admin', AdminSchema);
export default Admin;
