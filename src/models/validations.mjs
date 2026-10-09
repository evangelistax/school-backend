import { string, z } from "zod";

export const studentSchema = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  Age: z.number().positive().max(20, "revise la edad"),
  Sex: z.string().min(1).max(1),
  Phone: z.string().min(9).max(9),
  Residence: z.string(),
});

export const partialStudent = studentSchema.partial();

export const teacherSchema = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  Salary: z.number().positive(),
  Age: z.number().positive(),
  Sex: z.string().min(1).max(1),
  Titulation: z.string(),
  Phone: z.string().min(9).max(9),
  Residence: z.string(),
});

export const partialTeacher = teacherSchema.partial();
