import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../roles/entities/rol.entity';
import { RolNombre } from '../roles/entities/rol.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
  ) {}

  async create(dto: CreateUserDto): Promise<any> {
    const { username, email } = dto;
    const exists = await this.userRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
    if (exists) throw new ConflictException('El rol que ingresaste ya existe');

    const rolUser = await this.rolesRepository.findOne({
      where: [{ rolNombre: RolNombre.USER }],
    });
    if (!rolUser)
      throw new BadRequestException('los roles no han sido creados');
    const user = this.userRepository.create(dto);
    user.roles = [rolUser];
    const newU = await this.userRepository.save(user);
    return newU;
  }

  async findAll(filterQuery): Promise<User[]> {
    const { limit } = filterQuery;
    const users = await this.userRepository.find({
      take: limit,
    });
    if (!users.length) return [];

    return users;
  }

  async findByName(filterQuery): Promise<User> {
    const { name } = filterQuery;
    const user = await this.userRepository.findOne({
      where: { username: name },
    });
    if (!user) return null;

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) return null;

    return user;
  }

  async update(
    codigoId: number,
    updateUsuarioDto: UpdateUserDto,
  ): Promise<any> {
    // puedo seleccionar de updateUsuarioDto los atributos q solo quiero actualizar
    // const newU: UpdateUserDto = { nivel: 2, denominacion: 'Prueba' };
    console.log(updateUsuarioDto);
    if (Object.keys(updateUsuarioDto).length === 0)
      throw new ConflictException('No actuliza ningun dato');

    const toUpdate = await this.userRepository.findOne({
      where: { id: codigoId },
    });

    if (!toUpdate) throw new ConflictException('User no encontrado');

    const updated = Object.assign(toUpdate, updateUsuarioDto);

    const updateU = await this.userRepository.save(updated);
    //console.log('s: ', s);
    //return updated;
    return updateU;
  }

  async remove(usuarioId: number): Promise<any> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) throw new ConflictException('EL Usuario No existe');

    const remove = await this.userRepository.remove(usuario);
    return remove;
  }

  async remove2(usuarioId: number): Promise<any> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) throw new ConflictException('EL Usuario No existe');

    usuario.isActivo = false;
    const disabled = await this.userRepository.save(usuario);
    return disabled;
  }
}
