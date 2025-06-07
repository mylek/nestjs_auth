import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly appService;
    private readonly jwtService;
    constructor(appService: AuthService, jwtService: JwtService);
    register(username: string, email: string, password: string): Promise<import("./user.entity").User>;
    login(email: string, password: string, response: Response): Promise<{
        message: string;
    }>;
    user(request: Request): Promise<import("./user.entity").User | null>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
