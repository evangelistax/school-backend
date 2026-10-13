import getCourses from "../models/courses.model.mjs";

async function coursesControler(req, res) {
  try {
    const courses = await getCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default coursesControler;
