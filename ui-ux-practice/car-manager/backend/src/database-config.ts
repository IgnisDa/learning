import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

export const DatabaseConfig = {
  type: 'postgres',
  url: `${process.env.DATABASE_URL}/car_db`,
  autoLoadEntities: true,
  logging: process.env.NODE_ENV === 'development',
  synchronize: false,
  entities: [__dirname + '/src/**/**.entity.ts'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  cli: { migrationsDir: 'migrations' },
};

export default DatabaseConfig;
