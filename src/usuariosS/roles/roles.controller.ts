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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Rol } from './entities/rol.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Rol')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
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
    this.writeLog(startTime, request, HttpStatus.OK);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.CREATED,
      message: 'OK',
      data: data,
    });
  }

  @Get()
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
    this.writeLog(startTime, request, HttpStatus.OK);

    const data = await this.rolesService.findAll(filterQuery);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  public writeLog(startTime: any, request: any, statusCode: number) {
    this.logger.log({
      level: 'info',
      message: '',
      statusCode: statusCode,
      method: request['method'],
      url: request['url'],
      user: request['user'],
      duration: Date.now() - startTime,
    });
  }
}
