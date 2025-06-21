import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Token } from './enums/token.enum';
import { Info } from 'src/user/entity/info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Info]),
    JwtModule.register({
      secret: Token.TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
  
})
export class AuthModule {}
