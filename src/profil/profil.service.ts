import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Info } from '../user/entity/info.entity';

export class ProfilService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Info) private readonly infoRepository: Repository<Info>,
  ) {}

  async update(id: number, params: any): Promise<User> {
    console.log(params);
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
        console.log(params, 333);
        console.log(info, 11);
        await this.infoRepository.update(info.id, info);
      }
    } else {
      console.log(Object.assign({ userId: id }, params), 22);
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
