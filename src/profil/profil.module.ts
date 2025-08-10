import { Module } from '@nestjs/common';
import { ProfilController } from './profil.controller';
import { User } from '../auth/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Token } from '../auth/enums/token.enum';
import { Info } from '../user/entity/info.entity';
import { ProfilService } from './profil.service';

@Module({
  controllers: [ProfilController],
  imports: [
    TypeOrmModule.forFeature([User, Info]),
    JwtModule.register({
      secret: Token.TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ProfilService],
})
export class ProfilModule {}
