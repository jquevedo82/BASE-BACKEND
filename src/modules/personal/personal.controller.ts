import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { WriteLogService } from 'src/config/writelog.service';

@Controller('personal')
export class PersonalController {
  constructor(
    private readonly personalService: PersonalService,
    private readonly writeLog: WriteLogService, //@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  create(@Body() createPersonalDto: CreatePersonalDto) {
    return this.personalService.create(createPersonalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request: Request, @Query() filterQuery, @Res() res) {
    console.log(filterQuery);
    const startTime = Date.now();
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.personalService.findAll(filterQuery);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @Get('prueba')
  async findPeriodoPrueba(@Req() request: Request, @Query() filterQuery, @Res() res) {

    console.log(filterQuery,1);
    const startTime = Date.now();
    this.writeLog.writeLog(startTime, request, HttpStatus.OK, '');
    const data = await this.personalService.periodoPrueba(filterQuery);;
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
    
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.personalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonalDto: UpdatePersonalDto,
  ) {
    return this.personalService.update(+id, updatePersonalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalService.remove(+id);
  }
}
