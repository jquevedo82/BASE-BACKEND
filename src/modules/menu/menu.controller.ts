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

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get('padres')
  findAll() {
    return this.menuService.findAll();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
