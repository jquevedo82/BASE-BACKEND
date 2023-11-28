import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Inject,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Rol } from './entities/rol.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RolDecorator } from 'src/decorador/rol.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { RolesGuard } from 'src/guards/rol.guard';
import { RolNombre } from './entities/rol.enum';

@ApiTags('Rol')
@Controller('roles')
@ApiBearerAuth() // para cerrar o abrir con el token en el swagger
@ApiUnauthorizedResponse({ description: 'Unauthorized Bearer Auth.' })
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
   //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Muestra el Rol creado' })
  @ApiResponse({
    status: 201,
    description: 'Mensaje del Rol creado',
    type: Rol,
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Req() request: Request,
    @Body() createRoleDto: CreateRoleDto,
    @Res() res,
  ) {
    const data = await this.rolesService.create(createRoleDto);
    const startTime = Date.now();
    const message = 'OK';
    this.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      message: message,
      data: data,
    });
  }

  @Get()
  //@UseGuards(JwtAuthGuard)//bloquea todo si no trae un token bearer
  //@RolDecorator(RolNombre.DEV) //indicamos que tipo usuario puede accesr a este acces point
  //@UseGuards(JwtAuthGuard, RolesGuard)// autenticacion jwt y que sea el roll antes detallado
  @ApiOperation({ summary: 'Muestra los Roles creados' })
  @ApiResponse({
    status: 200,
    description: 'Datos de los Roles creados',
    type: [Rol],
  })
  async findAll(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
  ): Promise<Rol[]> {
    const startTime = Date.now();

    const data = await this.rolesService.findAll(filterQuery);
    const message = 'OK';

    this.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  public writeLog(
    startTime: any,
    request: any,
    statusCode: number,
    message: string,
  ) {
    this.logger.log({
      level: 'info',
      message: message,
      statusCode: statusCode,
      method: request['method'],
      url: request['url'],
      user: request['user'],
      duration: Date.now() - startTime,
    });
  }
}
