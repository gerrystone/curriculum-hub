import { NextRequest, NextResponse } from "next/server";
import {getLessonPlanById} from "@/backend/services/get-lesson-plan-by-id";

type RouteContext = {
    params: Promise<{
        planId: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { planId } = await params;

        const lessonPlan = await getLessonPlanById(planId);

        if (!lessonPlan) {
            return NextResponse.json(
                { message: "Lesson plan not found." },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { data: lessonPlan },
            { status: 200 },
        );
    } catch (error) {
        console.error("Failed to retrieve lesson plan:", error);

        return NextResponse.json(
            { message: "Failed to retrieve lesson plan." },
            { status: 500 },
        );
    }
}