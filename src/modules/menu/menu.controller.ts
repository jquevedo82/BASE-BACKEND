import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { WriteLogService } from 'src/config/writelog.service';
import { JwtAuthGuard } from 'src/guards/jwt.guards';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly writeLog: WriteLogService, //@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('padre')
  async create(@Req() request: Request, @Body() datos, @Res() res) {
    const startTime = Date.now();

    const data = await this.menuService.create(datos);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('padres')
  async findAll(@Req() request: Request, @Query() filterQuery, @Res() res) {
    const startTime = Date.now();

    const data = await this.menuService.findAll();
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('hijos/:id')
  async findAllhijos(
    @Req() request: Request,
    @Param('id') id: number,
    @Query() filterQuery,
    @Res() res,
  ) {
    const startTime = Date.now();

    const data = await this.menuService.findAllhijos(id);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async findone(
    @Req() request: Request,
    @Query() filterQuery,
    @Res() res,
  ): Promise<any> {
    const startTime = Date.now();

    const data = await this.menuService.findOne(filterQuery);
    const message = 'OK';

    this.writeLog.writeLog(startTime, request, HttpStatus.OK, message);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  @Patch('padre/:id')
  async update(@Param('id') id: number, @Body() datos: any) {
    return await this.menuService.update(id, datos);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.menuService.remove(id);
  }
}
