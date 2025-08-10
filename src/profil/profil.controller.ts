import { Body, Controller, Param, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/user.entity';
import { ProfilService } from './profil.service';
import { ImageService } from '../common/image.service';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

@UseGuards(AuthGuard)
@Controller('api/profil')
export class ProfilController {
  constructor(
    private readonly imageService: ImageService,
    private readonly profilService: ProfilService,
  ) {}

  @Post(':id')
  async save(
    @Param('id') id: number,
    @Body(ValidationPipe) updateProfilDto: UpdateProfilDto,
  ) {
    try {
      if (updateProfilDto.image !== undefined) {
        if (updateProfilDto.image.base64 == undefined) {
          return { error: true, message: 'Image is required' };
        }
        const imageBase64: string = updateProfilDto.image.base64;
        updateProfilDto.info.avatar =
          await this.imageService.uploadImage(imageBase64);
      }

      await this.profilService.update(id, updateProfilDto.info);
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
