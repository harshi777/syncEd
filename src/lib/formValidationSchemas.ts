import z from "zod";
import { coerce } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Class name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: z.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.coerce.string().min(1, { message: "Parent is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const lessonSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Lesson name is required"),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  subjectId: z.coerce.number({ message: "Subject is required" }),
  classId: z.coerce.number({ message: "Class is required" }),
  teacherId: z.string(),
});
export type LessonSchema = z.infer<typeof lessonSchema>;

export const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  classId: z.number().nullable().optional(),
});
export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Announcement title is required!" }),
  description: z
    .string()
    .min(1, { message: "Announcement description is required!" }),
  date: z.coerce.date({ message: "Announcement date is required!" }),
  classId: z.coerce.number().optional().or(z.literal("")),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const resultSchema = z
  .object({
    id: z.number().optional(),
    studentId: z.string().min(1, { message: "Student is required" }),
    examId: z.number().nullable().optional(),
    assignmentId: z.number().nullable().optional(),
    score: z.number().min(0, { message: "Score is required" }),
  })
  .refine((data) => data.examId || data.assignmentId, {
    message: "Either exam or assignment must be selected",
  });

export type ResultSchema = z.infer<typeof resultSchema>;

export const parentSchema = z.object({
  id: z.string(), // editing only
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string(),
  surname: z.string(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(5, "Phone must be valid"),
  address: z.string().min(5, "Address should be descriptive"),
  studentIds: z.array(z.string()).optional(),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const assignmentSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Maximum 50 characters allowed"),
  startDate: z.coerce.date({
    message: "Invalid due date",
  }),
  dueDate: z.coerce.date({
    message: "Invalid due date",
  }),
  lessonId: z.coerce.number().min(1, "Lesson is required"),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;
