import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Info } from '../user/entity/info.entity';
import { v2 as cloudinary } from 'cloudinary';
import * as process from 'node:process';

export class ProfilService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Info) private readonly infoRepository: Repository<Info>,
  ) {}

  async uploadAvatara(imageBase64: string): Promise<string> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
      api_key: process.env.CLOUDINARY_API_KEY ?? '',
      api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
    });

    let avatarUrl: string = '';
    await cloudinary.uploader.upload(
      imageBase64,
      {
        folder: 'UserPhoto',
        width: process.env.AVATAR_SIZE,
        crop: 'scale',
      },
      function (error, result) {

        if (result !== undefined && result.url !== undefined) {
          avatarUrl = result.url;
        }
      },
    );

    return avatarUrl;
  }

  async update(id: number, params: any): Promise<User> {
    const user = await this.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userModel = await this.userRepository.save(user);
    if (user.info) {
      const info = await this.infoRepository.findOne({
        where: {
          userId: id,
        },
      });
      if (info) {
        Object.assign(info, params);
        await this.infoRepository.update(info.id, info);
      }
    } else {
      await this.infoRepository.save(Object.assign({ userId: id }, params));
    }
    return userModel;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['info'],
    });
    if (!user) {
      throw new NotFoundException('User id: ' + id + ' no exist');
    }
    return user;
  }
}
