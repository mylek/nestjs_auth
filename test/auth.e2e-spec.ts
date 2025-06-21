import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '../src/auth/enums/role.enum';
import { User } from '../src/auth/user.entity';
import { DataSource, getConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';


describe('AppController (e2e)', () => {
    let app: INestApplication<App>;
    let cookies;
    let testUser = { id: 1, email: "test@o2.pl", username: 'test', password: 'test', role: Role.USER } as User;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: '0.0.0.0',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: process.env.NODE_ENV === 'test' ? 'nest_auth_test' : 'nest_auth',
                    entities: [User],
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        app.enableCors({
            origin: 'http://localhost:3000',
            credentials: true
        });
        await app.init();
    });

    it('register new user', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/register')
            .send({
                "username": testUser.username,
                "email": testUser.email,
                "password": testUser.password
            })
            .expect(201);
    });

    it('login succesful', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                "email": testUser.email,
                "password": testUser.password
            })
            .expect(201);

        cookies = response.headers['set-cookie'];
        const jwtToken = JSON.stringify(cookies).split(';')[0].replace('["jwt=', '');

        expect(response.body.message).toBe('Login successful');
        expect(jwtToken !== "").toBe(true);
    });

    it('get user data by jwt', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/auth/user')
            .set('Cookie', cookies)
            .expect(200);

        expect(response.body.username).toBe(testUser.username);
    });

    it('login to bed jwt token', async () => {
        await request(app.getHttpServer())
            .get('/api/auth/user')
            .set('Cookie', 'bed_token')
            .expect(401);
    });

    it('logout user', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/logout')
            .set('Cookie', cookies)
            .expect(201);
        expect(response.body.message).toBe('Logout successful');

        await request(app.getHttpServer())
            .get('/api/auth/user')
            .expect(401);
    });

    it('login bad password', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                "email": testUser.email,
                "password": 'badpass'
            })
            .expect(400);

        expect(response.body.message).toBe('Invalid credentials');
    });

    afterAll(async () => {
        const dataSource = new DataSource({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME,
            entities: [User],
            synchronize: true,
        });
        await dataSource.initialize();
        await dataSource.synchronize(true); // Usuwa i odtwarza wszystkie tabele
        await app.close();
    });

});
