import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Complaint from '@/models/Complaint';

export async function GET() {
  await connectToDatabase();
  const total = await Complaint.countDocuments();
  const open = await Complaint.countDocuments({ status: 'Open' });
  const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
  const resolved = await Complaint.countDocuments({ status: 'Resolved' });
  const critical = await Complaint.countDocuments({ priority: 'Critical' });
  const high = await Complaint.countDocuments({ priority: 'High' });
  const medium = await Complaint.countDocuments({ priority: 'Medium' });
  const low = await Complaint.countDocuments({ priority: 'Low' });
  return NextResponse.json({
    success: true,
    data: { total, open, inProgress, resolved, critical, high, medium, low }
  });
}
