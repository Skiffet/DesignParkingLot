import { connectToDB } from "@/lib/mongodb";
import Levels from "@/lib/models/Level";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { levels } = await req.json();
    await Levels.deleteMany({});

    const inserted = await Levels.insertMany(levels);

    return NextResponse.json(
      { message: "Levels saved successfully", insertedCount: inserted.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}