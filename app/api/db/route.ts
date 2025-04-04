import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json({ dbName: mongoose.connection.name });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}