import * as bcrypt from 'bcrypt';

//encriptacion de contraseñas 
export const encrypt = async(password: string, saltOrRounds: number) => {
    return await bcrypt.hash(password, saltOrRounds);
}

//compara la contraseña encriptada con la contraseña sin encriptar
export const compare = async(password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}