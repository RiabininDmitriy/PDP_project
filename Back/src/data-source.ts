/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';


export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'testUser',
	password: 'password',
	database: 'testDb',
	entities: ['src/entities/*.ts'],
	migrations: ['src/migrations/*.ts'],
	synchronize: false,
	logging: true,
});

//todo move to env file