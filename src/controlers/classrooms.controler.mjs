import getClassrooms from "../models/classrooms.models.mjs";

export default async function get(req, res) {
  try {
    const result = await getClassrooms();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).josn({ mesage: `error: ${error.message}` });
  }
}
