import { getEnrollemtns } from "../models/enrollements.model.mjs";
export default async function enrollementsController(req, res) {
  try {
    const data = await getEnrollemtns();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
