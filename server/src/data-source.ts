import { DataSource } from 'typeorm';
import { getEnvOrDefault } from './utils/env';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: getEnvOrDefault('DATABASE_HOST', 'localhost'),
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'b8gt5k98c',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsRun: true,
});

export default AppDataSource;
