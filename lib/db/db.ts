import mysql from "mysql2/promise"
import { Credentials } from "../types";

// Pool oluşturduk, fonksiyonları ayrı yazacağımız için ayrı bir release connection kod bloğuna ihtiyaç yok. Bkz: https://sidorares.github.io/node-mysql2/docs
export const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

// DB tarafına ait fonksiyonları buraya ekleyebilirsiniz
// Bu tarz bir şey yaptım ama Adapter olmadan çalışmıyor, node ile çözemeyeceğiz gibi, prisma kuralım
export async function authorize( credentials : Credentials ) {
  try {
    const [rows] : any = await pool.query(
      "SELECT * FROM USERS WHERE EMAIL = ? AND PASSWORD = ?",
      [credentials.email, credentials.password]
    );

    const user = rows[0]
    const { email, password } = user

    if (user) {
      return { email, password }
    } else {
      throw new Error("Invalid credentials")
    }
  } catch (err) {
    console.log(err)
  }
}