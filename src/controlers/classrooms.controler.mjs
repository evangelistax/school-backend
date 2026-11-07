import {
  assignStudents,
  getClassroomByName,
  getEligibleStudents,
} from "../models/classrooms.models.mjs";
import getClassrooms from "../models/classrooms.models.mjs";

export async function get(req, res) {
  try {
    const result = await getClassrooms();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: `error: ${error.message}` });
  }
}

export async function getByName(req, res) {
  try {
    const classroom = await getClassroomByName(req.params.classroomName);
    if (!classroom) {
      return res.status(404).json({ message: "No existe el aula indicada." });
    }
    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getEligible(req, res) {
  try {
    const students = await getEligibleStudents(req.params.classroomName);
    if (students === null) {
      return res.status(404).json({ message: "No existe el aula indicada." });
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addStudents(req, res) {
  const { StudentIDs } = req.body;
  if (!Array.isArray(StudentIDs) || StudentIDs.length === 0) {
    return res.status(400).json({ message: "Selecciona al menos un estudiante." });
  }
  try {
    const added = await assignStudents(req.params.classroomName, StudentIDs);
    res.status(201).json({ message: "Estudiantes añadidos al aula.", added });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}
