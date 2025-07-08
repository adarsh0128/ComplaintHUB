import mongoose, { Schema, model, models } from 'mongoose';

export interface IComplaint {
  _id?: string;
  title: string;
  description: string;
  category: 'Technical' | 'Billing' | 'Service' | 'Product' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  notes?: string[];
}

const ComplaintSchema = new Schema<IComplaint>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technical', 'Billing', 'Service', 'Product', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerPhone: {
    type: String,
    trim: true,
    match: [/^[\+]?([0-9\s\-\(\)]{7,20})$/, 'Please enter a valid phone number']
  },
  assignedTo: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  notes: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
ComplaintSchema.index({ status: 1, createdAt: -1 });
ComplaintSchema.index({ customerEmail: 1 });
ComplaintSchema.index({ category: 1 });

const Complaint = models.Complaint || model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
