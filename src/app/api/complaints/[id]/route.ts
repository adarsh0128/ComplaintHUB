import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';
import { ApiResponse } from '@/types';

// GET /api/complaints/[id] - Get a specific complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const complaint = await Complaint.findById(params.id);

    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: complaint
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

// PUT /api/complaints/[id] - Update a complaint
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();

    // If status is being changed to "Resolved", set resolvedAt
    if (body.status === 'Resolved') {
      body.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: complaint,
      message: 'Complaint updated successfully'
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating complaint:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

// DELETE /api/complaints/[id] - Delete a complaint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const complaint = await Complaint.findByIdAndDelete(params.id);

    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      message: 'Complaint deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete complaint' },
      { status: 500 }
    );
  }
}
