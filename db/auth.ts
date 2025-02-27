import { getConnection, releaseConnection } from "./config";

interface CredentialsInterface {
  email: string;
  password: string;
}

const checkEmail = async (credentials: CredentialsInterface): Promise<boolean> => {
  const connection = await getConnection();
  try {
    const [rows]: any = await connection.execute(
      "SELECT * FROM USERS WHERE ROLE = 'USER' AND EMAIL = ?",
      [credentials.email]
    );

    return Array.isArray(rows) && rows.length > 0;
  } catch (error: any) {
    await connection.execute(
      "INSERT INTO LOGS (ACTION_NAME, ACTION_SOURCE, DESCRIPTION) VALUES (?, ?, ?)",
      ["SELECT", "db/auth.ts", "checkEmail() işlemi gerçekleştirilememiştir"]
    );
    return false;
  } finally {
    releaseConnection(connection);
  }
};

export { checkEmail };