import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
  }
  const existing = await Admin.findOne({ email });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Email already registered.' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashed });
  return NextResponse.json({ success: true, data: { email: admin.email } });
}
