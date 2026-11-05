import {
  getEnrollments,
  createEnrollment,
  updateEnrollement,
} from "../models/enrollements.model.mjs";

export async function get(req, res) {
  const { course, type, name } = req.query;

  try {
    const data = await getEnrollments({ course, type, name });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function post(req, res) {
  const body = req.body;
  try {
    await createEnrollment(body);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function put(req, res) {
  const data = req.body;
  const { id } = req.params;

  const {
    StudentID,
    FirstName,
    LastName,
    Age,
    Sex,
    Phone,
    Residence,
    CourseID,
    Amount,
    Paid,
    Observations,
    DateOf,
    TypeOf,
    Debit,
  } = data;

  try {
    await updateEnrollement(data, id);
    res.status(202).json({ message: "estudiante actualizado con exito" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `hubo un error al actualizar el estudiante: ${error.message}`,
      });
  }
}
