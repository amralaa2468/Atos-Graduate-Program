import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "exam_engine",
  password: "admin",
  port: 5432,
});

export default pool;
