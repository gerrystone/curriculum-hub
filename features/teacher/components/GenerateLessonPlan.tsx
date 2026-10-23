"use client"
import {useCurriculum, useGenerateLessonPlan} from "@/features/lessons/hooks/useCurriculum";
import {useState} from "react";
import {Button} from "@/app/components/Button";
import {toast} from "react-toastify";
import {LessonPlanGenerationResult} from "@/backend/services/lesson-plan-generation-service";
import GeneratedLessonPlan from "@/features/teacher/components/GeneratedLessonPlan";

export default function GenerateLessonPlan() {
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState<number | null>();
    const [duration, setDuration] = useState<number | null>(null);
    const [selectedOutcome, setSelectedOutcome] = useState("");
    const [lessonPlan, setLessonPlan] = useState<LessonPlanGenerationResult  | null>(null);
    const {data:outcomes, isLoading, isError} = useCurriculum(grade === null ? "" : String(grade), subject)
    const outcomesList = outcomes?.data ?? []

    const generateLessonPlanMutation = useGenerateLessonPlan()

    const handleGenerateLessonPlan = () => {
        if (
            duration === null ||
            duration <= 0 ||
            grade === null ||
            !subject ||
            !selectedOutcome
        ) {
            toast.error("Please select a grade, subject, learning outcome, and valid duration.");
            return;
        }

        generateLessonPlanMutation.mutate(
            {
                outcomeId: selectedOutcome,
                durationMinutes: duration,
            },
            {
                onSuccess: (result) => {
                    toast.success("Lesson generated successfully.");
                    setLessonPlan(result.data);
                    setDuration(null);
                    setSelectedOutcome("");
                    setSubject("");
                    setGrade(null);
                },
                onError: () => {
                    toast.error("Failed to generate the lesson plan.");
                },
            },
        );
    };
    const clearPlan = () => {
        setLessonPlan(null);
    };
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4 bg-stone-100 p-4 rounded-md">
                <h6 className={"text-teal-900 font-semibold text-xl"}>Create Lesson Plan</h6>

                <div className="space-y-2">
                    <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Duration in minutes
                    </label>

                    <input
                        id="duration"
                        type="number"
                        min={1}
                        step={5}
                        value={duration ?? ""}
                        placeholder="e.g. 40"
                        onChange={(e) =>
                            setDuration(
                                e.target.value === "" ? null : Number(e.target.value)
                            )
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />

                    <p className="text-xs text-gray-500">
                        Enter the total lesson duration in minutes.
                    </p>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="grade"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Grade
                    </label>

                    <select
                        id="grade"
                        value={grade ?? ""}
                        onChange={(event) =>
                            setGrade(
                                event.target.value
                                    ? Number(event.target.value)
                                    : null
                            )
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="">Select grade</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Subject
                    </label>

                    <select
                        id="subject"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="">Select subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Integrated Science">Integrated Science</option>
                    </select>
                </div>

                {grade !== null && subject !== "" && (
                    <div className="space-y-2">
                        <label
                            htmlFor="learningOutcome"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Learning Outcome
                        </label>

                        {isLoading ? (
                            <p className="text-sm text-gray-500">
                                Loading learning outcomes...
                            </p>
                        ) : isError ? (
                            <p className="text-sm text-red-600">
                                Failed to load learning outcomes.
                            </p>
                        ) : outcomesList.length > 0 ? (
                            <>
                                <select
                                    id="learningOutcome"
                                    value={selectedOutcome}
                                    onChange={(event) =>
                                        setSelectedOutcome(event.target.value)
                                    }
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                                >
                                    <option value="">Select learning outcome</option>

                                    {outcomesList.map((outcome) => (
                                        <option
                                            value={outcome.outcomeId}
                                            key={outcome.outcomeId}
                                        >
                                            {outcome.outcomeText}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-xs text-gray-500">
                                    Choose the learning outcome for your lesson plan.
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No learning outcomes found for this grade and subject.
                            </p>
                        )}
                    </div>
                )}

                {
                    selectedOutcome && (
                       <div className={"flex justify-end"}>
                           <Button onClick={handleGenerateLessonPlan}>
                               {
                                   generateLessonPlanMutation.isPending ? "Generating" : "Generate Lesson Plan"
                               }
                           </Button>
                       </div>
                    )
                }
            </div>

            <div>
                {
                    lessonPlan && (
                        <GeneratedLessonPlan data={lessonPlan} clearPlan={clearPlan} viewType={"create"} />
                    )
                }
            </div>
        </div>
    );
}