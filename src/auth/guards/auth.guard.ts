
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../enums/token.enum';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token: string = request.cookies['jwt'];

    if (token === undefined) {
      token = request.headers.authorization;
    }

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: Token.TOKEN_SECRET,
        }
      );
      request['user'] = payload;
      
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
