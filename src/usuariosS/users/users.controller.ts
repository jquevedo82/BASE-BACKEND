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
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolDecorator } from 'src/decorador/rol.decorator';
import { RolNombre } from '../roles/entities/rol.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { RolesGuard } from 'src/guards/rol.guard';
import { User } from './entities/user.entity';
import { Request } from 'express';

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

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Crear un Usuario Nuevo' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async create(
    @Req() request: Request,
    @Body() dto: CreateUserDto,
    @Res() res,
  ): Promise<any> {
    const startTime = Date.now();
     console.log(dto);
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.usersService.create(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK, Ingresado Con Exito!!',
      data: data,
    });
  }
  @Get('alta')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Consultar Listado de Usuarios del Sistemas para alta' })
  @ApiOkResponse({ description: 'Listados de Usuarios', type: [User] })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  async findAlta(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
//  ): Promise<User[]> {
  ): Promise<any> {
    const startTime = Date.now();

    const data = await this.usersService.findAlta(filterQuery);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }
  @Get()
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Consultar Listado de Usuarios del Sistemas' })
  @ApiOkResponse({ description: 'Listados de Usuarios', type: [User] })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  async findAll(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
//  ): Promise<User[]> {
  ): Promise<any> {
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
  @Get('name')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Consultar Listado de Usuarios del Sistemas' })
  @ApiOkResponse({ description: 'Usuario Buscado por name', type: User })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  async findOneName(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
  ): Promise<User> {
    const startTime = Date.now();

    const data = await this.usersService.findByName(filterQuery);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Get(':id')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Consultar Listado de Usuarios del Sistemas' })
  @ApiOkResponse({ description: 'Usuario Buscado por id', type: User })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  async findOne(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Res() res,
  ): Promise<User> {
    const startTime = Date.now();

    const data = await this.usersService.findById(id);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

 // @UsePipes(new ValidationPipe({ whitelist: true })) //limpia los que no tiene validacion en el dto
  //@RolDecorator(RolNombre.ADMIN)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un Usuario específico' })
  @ApiResponse({
    status: 200,
    description: 'Datos del Usuario modificar',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  //remove(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
  async update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) codigoId: number,
    @Body() updateUsuarioDto: UpdateUserDto,
    @Res() res,
  ): Promise<User> {
    const startTime = Date.now();

    const data = await this.usersService.update(codigoId, updateUsuarioDto);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  //@RolDecorator(RolNombre.ADMIN)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un Usuario específico' })
  @ApiResponse({
    status: 200,
    description: 'Datos del Usuario eliminado',
    type: User,
  })
  @ApiForbiddenResponse({ description: 'Forbidden..' })
  //remove(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
  async remove(
    //@Param('entidad', ParseIntPipe) entidad: number,
    @Req() request: Request,
    @Param('id', ParseIntPipe) codigoId: number,
    @Res() res,
  ): Promise<User> {
    //console.log("codigoId: ", codigoId);

    const startTime = Date.now();

    const data = await this.usersService.remove2(codigoId);
    const message = 'Elemento Eliminado Logicamente';

    // const data = await this.usersService.remove(codigoId);
    // const message = 'Elemento Eliminado Totalmente';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }
}
