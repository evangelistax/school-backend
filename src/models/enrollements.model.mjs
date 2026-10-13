import { pool } from "./dbsettings.mjs";
import { enrollementSchrema } from "./validations.mjs";

export async function getEnrollemtns() {
  try {
    const [result] = await pool.query(
      "SELECT Amount, Debit, Paid, DateOf, Observations, TypeOf, StudentID, FirstName, LastName FROM enrollements INNER JOIN students ON enrollement.StudentID = students.StudentID",
    );
    return result;
  } catch (error) {
    throw new Error(error);
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
