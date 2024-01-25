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
  HttpStatus,
  Inject,
  UnauthorizedException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WriteLogService } from 'src/config/writelog.service';
import { RolDecorator } from 'src/decorador/rol.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { RolesGuard } from 'src/guards/rol.guard';
import { RolNombre } from 'src/usuariosS/roles/entities/rol.enum';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { Logger } from 'winston';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly writeLog: WriteLogService, //@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  //@UseGuards(JwtAuthGuard) //bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @Get()
  @ApiOperation({ summary: 'Lista  Los Usuario Del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Usuarios o Mensaje Error',
    type: [User],
  })
  async findAll(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
  ): Promise<User[]> {
    const startTime = Date.now();
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');

    const data = await this.authService.findAll(filterQuery);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('login')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Conectarse al Sistema' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async login(
    @Req() request: Request,
    @Body() dto: LoginUsuarioDto,
    @Res() res,
  ): Promise<TokenDto> {
    const startTime = Date.now();
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');

    const data = await this.authService.login(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard) //bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Refresh del Token de Conexion' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async refresh(
    @Req() request: Request,
    @Body() dto: TokenDto,
    @Res() res,
  ): Promise<TokenDto> {
    const startTime = Date.now();
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.authService.refresh(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('dev')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Crear un Usuario Nuevo' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async createDev(
    @Req() request: Request,
    @Body() dto: NuevoUsuarioDto,
    @Res() res,
  ): Promise<any> {
    const startTime = Date.now();
    // console.log(dto);
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.authService.createDev(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('super')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  @RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Crear un Usuario Nuevo' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async createSuper(
    @Req() request: Request,
    @Body() dto: NuevoUsuarioDto,
    @Res() res,
  ): Promise<any> {
    const startTime = Date.now();
    // console.log(dto);
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.authService.createSuper(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('admin')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  @RolDecorator(RolNombre.DEV, RolNombre.SUPER) //indicamos que tipo usuario puede accesr a este acces point
  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Crear un Usuario Nuevo' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async createAdmin(
    @Req() request: Request,
    @Body() dto: NuevoUsuarioDto,
    @Res() res,
  ): Promise<any> {
    const startTime = Date.now();
    //  console.log(dto);
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.authService.createAdmin(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('user')
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  @RolDecorator(RolNombre.DEV, RolNombre.SUPER, RolNombre.ADMIN) //indicamos que tipo usuario puede accesr a este acces point
  @UseGuards(JwtAuthGuard, RolesGuard) // autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Crear un Usuario Nuevo' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje exito o Error',
    type: String,
  })
  async createUser(
    @Req() request: Request,
    @Body() dto: NuevoUsuarioDto,
    @Res() res,
  ): Promise<any> {
    const startTime = Date.now();
    // console.log(dto);
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.authService.createUser(dto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

}
