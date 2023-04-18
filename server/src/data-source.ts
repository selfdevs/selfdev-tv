import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "postgres",
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  migrationsRun: true,
});

export default AppDataSource;
