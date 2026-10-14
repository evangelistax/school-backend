import { pool } from "./dbsettings.mjs";
import { enrollementSchrema } from "./validations.mjs";

export async function getEnrollemtns() {
  try {
    const [result] = await pool.query(
      "SELECT e.Amount, e.Debit, e.Paid, e.DateOf, e.Observations, e.TypeOf, e.StudentID, s.FirstName, s.LastName FROM enrollements AS e INNER JOIN students AS s ON e.StudentID = s.StudentID",
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function saveData(data) {
  try {
    const validData = enrollementSchrema.parse(data);
    const { Amount, Paid, Observations, DateOf, TypeOf, StudentID } = validData;
    const Debit = Amount - Paid;

    const result = await pool.query(
      "INSERT INTO enrollements (Amount, Paid, Observations, DateOf, TypeOf, Debit ) VALUES (?,?,?,?,?,?)",
      [Amount, Paid, Observations, DateOf, TypeOf, Debit],
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
