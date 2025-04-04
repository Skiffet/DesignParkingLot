import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Levels from "@/lib/models/Level";


export async function POST(req: Request) {
  console.log("🛠 API POST route hit!");
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectToDB();

    const request = await req.json();
    console.log("📩 Request Body:", request);

    const { spots, floor } = request;
    console.log("📩 Received Data:", { spots, floor });

    const newLevel = new Levels({ spots, floor });
    console.log("📝 Level Before Saving:", newLevel)
    
    await newLevel.save();

    return NextResponse.json(
      { message: "Create Level Success" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving user:", error);
    return NextResponse.json({ error: "Error saving user" }, { status: 500 });
  }
}

export async function GET() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await connectToDB();
    
        const levels = await Levels.find();
        // console.log("📩 Retrieved Levels:", levels);
    
        return NextResponse.json(levels);
    } catch (error) {
        console.error("❌ Error retrieving levels:", error);
        return NextResponse.json({ error: "Error retrieving levels" }, { status: 500 });
    }
}