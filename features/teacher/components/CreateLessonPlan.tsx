"use client"
import {useLearningOutcomes} from "@/services/hooks/useLearningOutcomes";
import {useState} from "react";
import {Button} from "@/app/components/Button";

export default function CreateLessonPlan(){
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState<number | null>();
    const [selectedOutcome, setSelectedOutcome] = useState("");
    const {data:outcomes, isLoading, isError} = useLearningOutcomes(grade === null ? "" : String(grade), subject)
    const outcomesList = outcomes?.data ?? []
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4 bg-stone-100 p-4 rounded-md">
                <h6 className={"text-teal-900 font-semibold text-xl"}>Create Lesson Plan</h6>
                <div>
                    <label htmlFor="grade">Grade</label>
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
                        className="block w-full rounded border p-2"
                    >
                        <option value="">Select grade</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="subject">Subject</label>
                    <select
                        id="subject"
                        value={subject}
                        onChange={(event) =>
                            setSubject(event.target.value)
                        }
                        className="block w-full rounded border p-2"
                    >
                        <option value="">Select subject</option>
                        <option value="Mathematics">
                            Mathematics
                        </option>
                        <option value="Integrated Science">
                            Integrated Science
                        </option>
                    </select>
                </div>

                {grade !== null && subject !== "" && (
                    <div>
                        <label htmlFor="learningOutcome">
                            Learning Outcomes
                        </label>

                        {isLoading ? (
                            <p>Loading outcomes...</p>
                        ) : isError ? (
                            <p>Failed to load learning outcomes.</p>
                        ) : outcomesList.length > 0 ? (
                            <select
                                id="learningOutcome"
                                defaultValue=""
                                className="block w-full rounded border p-2"
                                onChange={(event) =>(
                                    setSelectedOutcome(event.target.value)
                                )}
                            >
                                <option value="" disabled>
                                    Select learning outcome
                                </option>

                                {outcomesList.map((outcome) => (
                                    <option
                                        value={outcome.outcomeId}
                                        key={outcome.outcomeId}
                                    >
                                        {outcome.outcomeText}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>No outcomes found.</p>
                        )}
                    </div>
                )}

                {
                    selectedOutcome && (
                       <div className={"flex justify-end"}>
                           <Button>
                               Create Lesson Plan
                           </Button>
                       </div>
                    )
                }
            </div>

            <div>

            </div>
        </div>
    );
}