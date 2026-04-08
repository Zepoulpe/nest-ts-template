import 'dotenv/config';
import { DataSource } from 'typeorm';
import { loadConfig } from '../config/config.loader';

const config = loadConfig();
const pg = config.postgres;

const ormConfig = new DataSource({
  type: 'postgres',
  host: pg.host,
  port: pg.port,
  username: pg.username,
  password: pg.password,
  database: pg.database,
  ssl: pg.ssl ? { rejectUnauthorized: false } : false,
  migrationsTableName: 'migrations_typeorm',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: ['error', 'warn'],
});

export default ormConfig;
