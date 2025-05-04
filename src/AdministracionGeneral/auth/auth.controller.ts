import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface UserDTO{
    email: string,
    password: string,
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('log-in')
    logIn(@Body() user: UserDTO){
        //return this.authService.getUsers();
        return this.authService.logIn(user.email, user.password);
    }

}
