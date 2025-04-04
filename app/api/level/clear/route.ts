import { connectToDB } from "@/lib/mongodb";
import Levels from "@/lib/models/Level";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDB();

    const levels = await Levels.find();

    const updatedLevels = await Promise.all(
      levels.map(async (level: any) => {
        const updatedSpots = level.spots.map((spot: any) => ({
          ...spot,
          isAvailable: true,
          vehicleType: null,
        }));

        level.spots = updatedSpots;
        return level.save();
      })
    );

    return NextResponse.json(
      { message: "✅ Vehicles cleared", updatedCount: updatedLevels.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Clear Error:", error);
    return NextResponse.json({ error: "Failed to clear vehicles" }, { status: 500 });
  }
}