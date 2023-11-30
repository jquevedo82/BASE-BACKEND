import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Res,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolDecorator } from 'src/decorador/rol.decorator';
import { RolNombre } from '../roles/entities/rol.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { RolesGuard } from 'src/guards/rol.guard';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { WriteLogService } from 'src/config/writelog.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth() // para cerrar o abrir con el token en el swagger
@ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly writeLog: WriteLogService, //@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Consultar Listado de Usuarios del Sistemas' })
  @ApiOkResponse({ description: 'Listados de Usuarios', type: [User] })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  async findAll(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
  ): Promise<User[]> {
    const startTime = Date.now();

    const data = await this.usersService.findAll(filterQuery);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  @Get(':id')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Consultar Listado de Usuarios del Sistemas' })
  @ApiOkResponse({ description: 'Usuario Buscado por id', type: User })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  // //public writeLog(
  //   startTime: any,
  //   request: any,
  //   statusCode: number,
  //   message: string,
  // ) {
  //   this.logger.log({
  //     level: 'info',
  //     message: message,
  //     statusCode: statusCode,
  //     method: request['method'],
  //     url: request['url'],
  //     user: request['user'],
  //     duration: Date.now() - startTime,
  //   });
  // }
}
