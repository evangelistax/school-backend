import { pool } from "./dbsettings.mjs";

const getCourses = async () => {
  try {
    const [result] = await pool.query("SELECT * FROM courses");
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default getCourses;
