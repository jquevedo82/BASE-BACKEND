import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const exists = await this.rolesRepository.findOne({
      where: {
        rolNombre: createRoleDto.rolNombre,
      },
    });
    if (exists) throw new ConflictException('El rol que ingresaste ya existe');
    createRoleDto = await this.rolesRepository.save(createRoleDto);

    return createRoleDto;
  }

  async findAll(filterQuery): Promise<Rol[]> {
    const { limit } = filterQuery;
    const roles = await this.rolesRepository.find({
      take: limit,
    });
    if (!roles.length) return [];

    return roles;
  }


  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
