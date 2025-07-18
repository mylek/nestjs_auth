import { Controller, Post, Body} from '@nestjs/common';
import { ForgotPasswordService } from './forgotpassword.service';


@Controller('api/auth/forgot-password')
export class ForgotPasswordController {

    constructor(private readonly forgotPasswordService: ForgotPasswordService) {
    }

    @Post('')
    async forgotPassword(
        @Body('email') email: string,
    ) {
        try {
            await this.forgotPasswordService.sendMail(email);
        } catch (error) {
            return {error: true, message: error.message};
        }

        return {error: false, message: 'Email sent successfully'};
    }

    @Post('change-password')
    async changePassword(
        @Body('token') token: string,
        @Body('password') password: string,
    ) {
        try {
            const emailFromToken = this.forgotPasswordService.verifyResetPasswordToken(token);
            if (!emailFromToken) {
                return { error: true, message: 'Invalid or expired token' };
            }

            await this.forgotPasswordService.changePassword(emailFromToken, password);
            return { error: false, message: 'Password changed successfully' };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    @Post('check-token')
    async checkToken(
        @Body('token') token: string,
        @Body('email') email: string,
    ) {
        try {
            const emailFromToken = this.forgotPasswordService.verifyResetPasswordToken(token);
            if (emailFromToken !== email) {
                return { error: true, message: 'Email does not match the token' };
            }
            return { error: false, email: emailFromToken };
        } catch (error) {
            return { error: true, message: error.message };
        }
    }
}