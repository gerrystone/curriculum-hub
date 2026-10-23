import { NextResponse } from "next/server";
import {getLessonPlans} from "@/backend/services/get-lesson-plans";

export async function GET() {
    try {
        const lessonPlans = await getLessonPlans();

        return NextResponse.json(
            {
                data: lessonPlans,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to retrieve lesson plans:", error);

        return NextResponse.json(
            { message: "Failed to retrieve lesson plans." },
            { status: 500 },
        );
    }
}