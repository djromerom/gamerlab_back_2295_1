import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private PrismaService: PrismaService, private jwtService: JwtService) {}
    //async getUsers(){
    //    return await this.PrismaService.usuario.findMany();
    //}

    async logIn(email: string, password: string){
        try {
            const user = await this.PrismaService.usuario.findUnique({
                where: {
                    correo: email,
                }
            });
            if (!user) {
                throw new BadRequestException("email o contraseña invalidos");
            }
            if(user.password){
                const isPasswordValid = await compare(password, user.password);
                if(!isPasswordValid){
                    throw new BadRequestException("email o contraseña invalidos");
                }
            }
            const rolesServices = await this.PrismaService.rol_servicio.findMany({
                where: {
                    rol: {
                        usuario_rol: {
                            some: {
                                id_usuario: user.id_usuario,
                                estado: true
                            }
                        }
                    },
                    estado: true
                },
                select: {
                    id_servicio: true
                }
            });
            
            const servicios = rolesServices.map(service => service.id_servicio);
            const {password: _, ...userWithoutPassword} = user;
            const payload = {
                ...userWithoutPassword,
                servicios: servicios,
            };
            const accessToken = await this.jwtService.signAsync(payload);
            return {accessToken};
        
        }catch (error){
            if(error instanceof BadRequestException){
                throw error;
            }else{
                throw new InternalServerErrorException("Error al iniciar sesión", error.message);
            }
        }
    }
}