import {
  getEnrollments,
  createEnrollment,
} from "../models/enrollements.model.mjs";

export async function get(req, res) {
  const { course, type } = req.query;

  try {
    const data = await getEnrollments({ course, type });
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
