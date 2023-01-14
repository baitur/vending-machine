import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();


export const connectionSource = new DataSource({
    type: "mysql",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: true,
    logging: false,
    entities: ["src/api/models/**/*.ts"],
    migrations: ["src/db/migrations/*.ts"],
});
