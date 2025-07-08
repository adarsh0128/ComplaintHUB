export interface ComplaintFormData {
  title: string;
  description: string;
  category: 'Technical' | 'Billing' | 'Service' | 'Product' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface ComplaintResponse {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  notes?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ComplaintFilters {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    pages: number;
    limit: number;
  };
}

export interface IComplaint extends ComplaintFormData {
  _id?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  notes?: string[];
  assignedTo?: string;
}
