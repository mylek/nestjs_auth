import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageService {
  private cloudinary;

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
      api_key: process.env.CLOUDINARY_API_KEY ?? '',
      api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
    });
  }

  async uploadImage(imageBase64: string): Promise<string> {
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
}
