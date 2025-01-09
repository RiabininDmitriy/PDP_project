/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppService } from './app.service'; 
import { UserRepository } from './modules/user/user.repo';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { WinstonLoggerService } from './utlis/logger.service';

@Module({
  imports: [
    //change to  TypeOrmModule.forRoot(AppDataSource.options)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testUser',
      password: 'password',
      database: 'testDb',
      entities: [User], 
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AuthModule,
  ],
  controllers: [UserController, AuthController],
  providers: [
    AppService, 
    UserService, 
    UserRepository, 
    AuthService, 
    WinstonLoggerService, 
  ],
})
export class AppModule {}
