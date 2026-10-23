
import { NextRequest, NextResponse } from "next/server";

import { getLearningOutcomesByGradeAndSubject } from "@/backend/services/learning-outcomes-service";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const gradeParam = searchParams.get("grade");
    const subjectParam = searchParams.get("subject");

    if (!gradeParam || !subjectParam?.trim()) {
        return NextResponse.json(
            {
                error: "Both grade and subject are required.",
            },
            { status: 400 },
        );
    }

    const grade = Number(gradeParam);
    const subject = subjectParam.trim();

    if (!Number.isInteger(grade) || grade <= 0) {
        return NextResponse.json(
            {
                error: "Grade must be a positive integer.",
            },
            { status: 400 },
        );
    }

    try {
        const outcomes =
            await getLearningOutcomesByGradeAndSubject(
                grade,
                subject,
            );

        return NextResponse.json({
            data: outcomes,
        });
    } catch (error) {
        console.error(
            "Failed to fetch curriculum learning outcomes:",
            error,
        );

        return NextResponse.json(
            {
                error: "Failed to retrieve learning outcomes.",
            },
            { status: 500 },
        );
    }
}
