
"use client";

import { useState } from "react";
import {LessonPlan} from "@/backend/lib/validation/lesson-plan-validation";
import {GeneratedLessonPlanProps} from "@/features/teacher/types";
import TextAreaField from "@/app/components/TextAreaField";
import ListTextAreaField from "@/app/components/ListTextAreaField";
import {useSaveLessonPlan} from "@/features/lessons/hooks/useCurriculum";
import {toast} from "react-toastify";
import {Button} from "@/app/components/Button";

export default function GeneratedLessonPlan({data, clearPlan,}: GeneratedLessonPlanProps) {
    const [plan, setPlan] = useState<LessonPlan>(data.plan);
    function updatePlan<K extends keyof LessonPlan>(
        key: K,
        value: LessonPlan[K],
    ) {
        setPlan((current) => ({
            ...current,
            [key]: value,
        }));
    }

    function updateStarter(
        updates: Partial<LessonPlan["starter"]>,
    ) {
        setPlan((current) => ({
            ...current,
            starter: { ...current.starter, ...updates },
        }));
    }

    function updateConclusion(
        updates: Partial<LessonPlan["conclusion"]>,
    ) {
        setPlan((current) => ({
            ...current,
            conclusion: { ...current.conclusion, ...updates },
        }));
    }

    function updateMainActivity(
        index: number,
        updates: Partial<LessonPlan["mainActivities"][number]>,
    ) {
        setPlan((current) => ({
            ...current,
            mainActivities: current.mainActivities.map(
                (activity, i) =>
                    i === index ? { ...activity, ...updates } : activity,
            ),
        }));
    }

    function updateAssessment(
        updates: Partial<LessonPlan["assessment"]>,
    ) {
        setPlan((current) => ({
            ...current,
            assessment: { ...current.assessment, ...updates },
        }));
    }

    function updateUnderstanding(
        updates: Partial<LessonPlan["checkForUnderstanding"]>,
    ) {
        setPlan((current) => ({
            ...current,
            checkForUnderstanding: {
                ...current.checkForUnderstanding,
                ...updates,
            },
        }));
    }

    const saveLessonPlanMutation = useSaveLessonPlan()

    const handleSaveLessonPlan = () =>{
        const payload = {
            plan,
            topic: plan.title,
            sources: data.sources,
            groundingStatus: data.groundingStatus,
        }
        saveLessonPlanMutation.mutate(payload, {
            onSuccess:()=>{
                toast.success("Lesson plan saved successfully")
                clearPlan()
            }
        })
    }
    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-10">
            <header>
                <p className="text-sm font-medium text-violet-600">
                    Curriculum Design Hub
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                    Review lesson plan
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Edit the generated lesson plan before saving or submitting it.
                </p>
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                    Grounding status: {data.groundingStatus}
                </span>
            </header>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">Lesson details</h2>

                <TextAreaField
                    label="Title"
                    value={plan.title}
                    onChange={(value) => updatePlan("title", value)}
                />

                <TextAreaField
                    label="Grade"
                    value={String(plan.grade)}
                    onChange={(value) =>
                        updatePlan("grade", Number(value))
                    }
                />

                <TextAreaField
                    label="Subject"
                    value={plan.subject}
                    onChange={(value) => updatePlan("subject", value)}
                />

                <TextAreaField
                    label="Duration (minutes)"
                    value={String(plan.durationMinutes)}
                    onChange={(value) =>
                        updatePlan("durationMinutes", Number(value))
                    }
                />

                <TextAreaField
                    label="Learning outcome"
                    value={"oo"}
                    onChange={(value) =>
                        setPlan((current) => ({
                            ...current,
                            outcomeText: value,
                            learningOutcome: {
                                ...current.learningOutcome,
                                outcomeText: value,
                            },
                        }))
                    }
                    rows={3}
                />

                <ListTextAreaField
                    label="Objectives"
                    items={plan.objectives}
                    onChange={(objectives) =>
                        updatePlan("objectives", objectives)
                    }
                />

                <ListTextAreaField
                    label="Materials"
                    items={plan.materials}
                    onChange={(materials) =>
                        updatePlan("materials", materials)
                    }
                />
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">1. Lesson starter</h2>

                <TextAreaField
                    label="Duration (minutes)"
                    value={String(plan.starter.durationMinutes)}
                    onChange={(value) =>
                        updateStarter({ durationMinutes: Number(value) })
                    }
                />

                <ListTextAreaField
                    label="Teacher actions"
                    items={plan.starter.teacherActions}
                    onChange={(teacherActions) =>
                        updateStarter({ teacherActions })
                    }
                />

                <ListTextAreaField
                    label="Learner actions"
                    items={plan.starter.learnerActions}
                    onChange={(learnerActions) =>
                        updateStarter({ learnerActions })
                    }
                />
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">2. Main activities</h2>

                {plan.mainActivities.map((activity, index) => (
                    <div key={index} className="space-y-4 rounded-lg bg-gray-50 p-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Activity {index + 1}
                        </h3>

                        <TextAreaField
                            label="Activity title"
                            value={activity.title}
                            onChange={(title) =>
                                updateMainActivity(index, { title })
                            }
                        />

                        <TextAreaField
                            label="Duration (minutes)"
                            value={String(activity.durationMinutes)}
                            onChange={(value) =>
                                updateMainActivity(index, {
                                    durationMinutes: Number(value),
                                })
                            }
                        />

                        <ListTextAreaField
                            label="Teacher actions"
                            items={activity.teacherActions}
                            onChange={(teacherActions) =>
                                updateMainActivity(index, { teacherActions })
                            }
                        />

                        <ListTextAreaField
                            label="Learner actions"
                            items={activity.learnerActions}
                            onChange={(learnerActions) =>
                                updateMainActivity(index, { learnerActions })
                            }
                        />

                        <button
                            type="button"
                            onClick={() =>
                                updatePlan(
                                    "mainActivities",
                                    plan.mainActivities.filter((_, i) => i !== index),
                                )
                            }
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                            Remove activity
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() =>
                        updatePlan("mainActivities", [
                            ...plan.mainActivities,
                            {
                                title: "",
                                durationMinutes: 10,
                                sourceChunkIds: [],
                                teacherActions: [""],
                                learnerActions: [""],
                            },
                        ])
                    }
                    className="text-sm font-medium text-violet-600 hover:text-violet-800"
                >
                    + Add activity
                </button>
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">
                    3. Check for understanding
                </h2>

                <ListTextAreaField
                    label="Questions"
                    items={plan.checkForUnderstanding.questions}
                    onChange={(questions) =>
                        updateUnderstanding({ questions })
                    }
                />
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">4. Conclusion</h2>

                <TextAreaField
                    label="Duration (minutes)"
                    value={String(plan.conclusion.durationMinutes)}
                    onChange={(value) =>
                        updateConclusion({ durationMinutes: Number(value) })
                    }
                />

                <ListTextAreaField
                    label="Teacher actions"
                    items={plan.conclusion.teacherActions}
                    onChange={(teacherActions) =>
                        updateConclusion({ teacherActions })
                    }
                />

               {/* <ListTextAreaField
                    label="Learner actions"
                    items={plan.conclusion.learnerActions}
                    onChange={(learnerActions) =>
                        updateConclusion({ learnerActions })
                    }
                />*/}
            </section>

            <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">5. Assessment</h2>

                <TextAreaField
                    label="Assessment method"
                    value={plan.assessment.method}
                    onChange={(method) => updateAssessment({ method })}
                />

                <ListTextAreaField
                    label="Success criteria"
                    items={plan.assessment.successCriteria}
                    onChange={(successCriteria) =>
                        updateAssessment({ successCriteria })
                    }
                />
            </section>

            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="font-semibold text-gray-900">Curriculum sources</h2>
                <p className="text-sm text-gray-500">
                    These references are read-only evidence used to ground the generated plan.
                </p>

                {data.sources.map((source) => (
                    <div
                        key={source.chunkId}
                        className="rounded-lg border border-gray-200 p-4"
                    >
                        <p className="text-sm font-medium text-gray-900">
                            {source.documentTitle}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Topic: {source.topic}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            Source entry: {source.sourceEntryId}
                        </p>
                    </div>
                ))}
            </section>

            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    onClick={() => setPlan(data.plan)}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Reset changes
                </button>

               <Button onClick={handleSaveLessonPlan}  disabled={saveLessonPlanMutation.isPending}>
                   {
                       saveLessonPlanMutation.isPending ? "Saving..." : "Save Lesson Plan"
                   }
               </Button>
            </div>
        </div>
    );
}
