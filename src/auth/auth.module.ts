import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ForgotPasswordController } from './forgotpassword.controller';
import { AuthService } from './auth.service';
import { ForgotPasswordService } from './forgotpassword.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Token } from './enums/token.enum';
import { Info } from 'src/user/entity/info.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Info]),
    JwtModule.register({
      secret: Token.TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    CommonModule,
  ],
  controllers: [AuthController, ForgotPasswordController],
  providers: [AuthService, ForgotPasswordService],
})
export class AuthModule {}
