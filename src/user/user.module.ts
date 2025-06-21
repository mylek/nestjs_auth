import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../auth/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { Info } from './entity/info.entity';
import { JwtModule } from '@nestjs/jwt';
import { Token } from '../auth/enums/token.enum';

@Module({
  controllers: [UserController, RoleController],
  imports: [
    TypeOrmModule.forFeature([User, Info]),
    JwtModule.register({
      secret: Token.TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
