import { Body, Controller, Param, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/user.entity';
import { ProfilService } from './profil.service';

@UseGuards(AuthGuard)
@Controller('api/profil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}

  @Get(':id')
  index() {
    return { error: true, message: 111 };
  }

  @Post(':id')
  async save(@Param('id') id: number, @Body() data: any) {
    try {
      const imageBase64: string = data.image.base64;
      data.info.avatar = await this.profilService.uploadAvatara(imageBase64);

      await this.profilService.update(id, data.info);
      return { error: false, message: 'Saved' };
    } catch (er) {
      return { error: true, message: er.message };
    }
  }

  @Get('getUserInfo/:id')
  async getUserInfo(@Param('id') id: number): Promise<User> {
    return await this.profilService.getById(id);
  }
}
