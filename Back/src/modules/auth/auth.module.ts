import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { WinstonLoggerService } from 'src/utils/logger.service';
import { JWT_SECRET } from 'src/utils/constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, WinstonLoggerService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
