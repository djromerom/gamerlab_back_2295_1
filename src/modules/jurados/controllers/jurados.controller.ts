import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { JuradosService } from '../services/jurados.service';
import { CreateJuradoDto } from '../dto/create-jurado.dto';

@Controller('jurados')
export class JuradosController {
  constructor(private readonly juradosService: JuradosService) {}

  @Post()
  create(@Body() createJuradoDto: CreateJuradoDto) {
    return this.juradosService.create(createJuradoDto);
  }

  @Get()
  findAll() {
    return this.juradosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.juradosService.findOne(+id);
  }

  @Get('confirm/:token')
  async confirmEmail(@Param('token') token: string, @Res() res: Response) {
    // Confirma el correo (puedes dejarlo vacío si solo quieres la pantalla)
    // await this.juradosService.confirmEmail(token);

    // Devuelve un HTML simple para crear la contraseña
    return res.send(`
      <html>
        <body>
          <h2>Crear contraseña</h2>
          <form method="POST" action="/jurados/set-password">
            <input type="hidden" name="token" value="${token}" />
            <label>Nueva contraseña:</label>
            <input type="password" name="password" required />
            <button type="submit">Guardar contraseña</button>
          </form>
        </body>
      </html>
    `);
  }

  @Post('set-password')
  async setPassword(@Body() body: { token: string; password: string }) {
    return this.juradosService.setPassword(body.token, body.password);
  }
}