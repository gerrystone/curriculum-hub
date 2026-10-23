
import {
    pgTable,
    pgEnum,
    uuid,
    varchar,
    text,
    integer,
    timestamp,
    jsonb,
    unique,
    index,
    check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", [
    "teacher",
    "curriculum_lead",
]);

export const accountStatusEnum = pgEnum("account_status", [
    "active",
    "inactive",
    "suspended",
]);

export const lessonPlanStatusEnum = pgEnum("lesson_plan_status", [
    "draft",
    "submitted",
    "approved",
    "rejected",
]);

export const lessonPlanVersionStatusEnum = pgEnum(
    "lesson_plan_version_status",
    ["draft", "submitted", "approved", "rejected"],
);


export const users = pgTable(
    "users",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        name: varchar("name", { length: 150 }).notNull(),

        email: varchar("email", { length: 255 })
            .notNull()
            .unique(),

        passwordHash: text("password_hash").notNull(),

        accountStatus: accountStatusEnum("account_status")
            .notNull()
            .default("active"),

        role: userRoleEnum("role").notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
);

// 2. Teacher-to-Curriculum Lead assignment
export const teacherCurriculumLeads = pgTable(
    "teacher_curriculum_lead",
    {
        teacherId: uuid("teacher_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        curriculumLeadId: uuid("curriculum_lead_id")
            .notNull()
            .references(() => users.id, { onDelete: "restrict" }),

        assignedAt: timestamp("assigned_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        unique("teacher_curriculum_lead_pair_unique").on(
            table.teacherId,
            table.curriculumLeadId,
        ),
        unique("teacher_curriculum_lead_teacher_unique").on(
            table.teacherId,
        ),
        check(
            "teacher_curriculum_lead_different_users",
            sql`${table.teacherId} <> ${table.curriculumLeadId}`,
        ),
    ],
);


export type LessonPlanContent = {
    learningOutcomes?: string[];
    introduction?: string;
    learningActivities?: {
        name: string;
        durationMinutes?: number;
        teacherActions?: string[];
        learnerActions?: string[];
        resources?: string[];
    }[];
    assessment?: string[];
    differentiation?: string;
    resources?: string[];
    reflection?: string;
};

// 3. Lesson plans
export const lessonPlans = pgTable(
    "lesson_plans",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        title: varchar("title", { length: 255 }).notNull(),

        createdBy: uuid("created_by")
            .notNull()
            .references(() => users.id, { onDelete: "restrict" }),

        grade: varchar("grade", { length: 50 }).notNull(),

        subject: varchar("subject", { length: 150 }).notNull(),

        topic: varchar("topic", { length: 255 }).notNull(),

        currentVersion: integer("current_version")
            .notNull()
            .default(1),

        status: lessonPlanStatusEnum("status")
            .notNull()
            .default("draft"),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        index("lesson_plans_created_by_idx").on(table.createdBy),
        index("lesson_plans_status_idx").on(table.status),
        index("lesson_plans_curriculum_idx").on(
            table.grade,
            table.subject,
            table.topic,
        ),
        check(
            "lesson_plans_current_version_positive",
            sql`${table.currentVersion} >= 1`,
        ),
    ],
);

// 4. Lesson-plan versions
export const lessonPlanVersions = pgTable(
    "lesson_plan_versions",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        lessonPlanId: uuid("lesson_plan_id")
            .notNull()
            .references(() => lessonPlans.id, { onDelete: "cascade" }),

        version: integer("version").notNull(),

        content: jsonb("content")
            .$type<LessonPlanContent>()
            .notNull(),

        status: lessonPlanVersionStatusEnum("status")
            .notNull()
            .default("draft"),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        createdBy: uuid("created_by")
            .notNull()
            .references(() => users.id, { onDelete: "restrict" }),

        submittedAt: timestamp("submitted_at", {
            withTimezone: true,
        }),

        reviewedAt: timestamp("reviewed_at", {
            withTimezone: true,
        }),

        reviewedBy: uuid("reviewed_by")
            .references(() => users.id, { onDelete: "restrict" }),

        reviewComment: text("review_comment"),
    },
    (table) => [
        unique("lesson_plan_version_number_unique").on(
            table.lessonPlanId,
            table.version,
        ),
        index("lesson_plan_versions_plan_idx").on(
            table.lessonPlanId,
            table.version,
        ),
        check(
            "lesson_plan_versions_version_positive",
            sql`${table.version} >= 1`,
        ),
    ],
);
