import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';
import { ComplaintFormData, ApiResponse, ComplaintFilters } from '@/types';
import { sendEmail } from '@/lib/sendEmail';

// GET /api/complaints - Get all complaints with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter query
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [complaints, totalCount] = await Promise.all([
      Complaint.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Complaint.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const response: ApiResponse = {
      success: true,
      data: {
        complaints,
        pagination: {
          current: page,
          total: totalCount,
          pages: totalPages,
          limit
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// POST /api/complaints - Create a new complaint
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: ComplaintFormData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'customerName', 'customerEmail'];
    for (const field of requiredFields) {
      if (!body[field as keyof ComplaintFormData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create new complaint
    const complaint = new Complaint(body);
    await complaint.save();

    // Send email notifications
    try {
      // Email to user
      await sendEmail({
        to: complaint.customerEmail,
        subject: 'Your complaint has been received',
        html: `<h2>Thank you for your complaint</h2>
          <p>Hi ${complaint.customerName},</p>
          <p>Your complaint titled <b>${complaint.title}</b> has been received. Our team will review and get back to you soon.</p>
          <p><b>Complaint ID:</b> ${complaint._id}</p>
          <p>Status: ${complaint.status}</p>
          <hr/>
          <p>ComplaintHub Team</p>`
      });
      // Email to admin
      await sendEmail({
        to: process.env.EMAIL_USER!,
        subject: 'New complaint submitted',
        html: `<h2>New Complaint Submitted</h2>
          <p><b>Title:</b> ${complaint.title}</p>
          <p><b>Description:</b> ${complaint.description}</p>
          <p><b>Customer:</b> ${complaint.customerName} (${complaint.customerEmail})</p>
          <p><b>Category:</b> ${complaint.category}</p>
          <p><b>Priority:</b> ${complaint.priority}</p>
          <p><b>Status:</b> ${complaint.status}</p>
          <p><b>Complaint ID:</b> ${complaint._id}</p>`
      });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr);
      // Do not fail the request if email fails
    }

    const response: ApiResponse = {
      success: true,
      data: complaint,
      message: 'Complaint created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating complaint:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}
