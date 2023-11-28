import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Rol } from 'src/usuariosS/roles/entities/rol.entity';
import { RolNombre } from 'src/usuariosS/roles/entities/rol.enum';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { TokenDto } from './dto/token.dto';
import { PayLoadInterface } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(filterQuery): Promise<User[]> {
    const { limit } = filterQuery;
    const usuarios = await this.authRepository.find({
      take: limit,
    });
    return usuarios;
  }

  async createDev(dto: NuevoUsuarioDto): Promise<any> {
    const { username, email } = dto;
    const exists = await this.authRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
    if (exists)
      throw new BadRequestException('El usuario que ingresaste ya existe');
    const rolAdmin = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.ADMIN }],
    });
    const rolUser = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.USER }],
    });
    const rolSuper = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.SUPER }],
    });
    const rolDev = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.DEV }],
    });
    if (!rolUser || !rolAdmin || !rolSuper || !rolDev)
      throw new InternalServerErrorException('los roles no han sido creados');

    const dev = this.authRepository.create(dto);
    dev.roles = [rolUser, rolAdmin, rolDev, rolSuper];
    const nuevo = this.authRepository.save(dev);

    return nuevo;
  }

  async createSuper(dto: NuevoUsuarioDto): Promise<any> {
    const { username, email } = dto;
    const exists = await this.authRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
    if (exists)
      throw new BadRequestException('El usuario que ingresaste ya existe');
    const rolAdmin = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.ADMIN }],
    });
    const rolUser = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.USER }],
    });
    const rolSuper = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.SUPER }],
    });
    if (!rolUser || !rolAdmin || !rolSuper)
      throw new InternalServerErrorException('los roles no han sido creados');

    const sup = this.authRepository.create(dto);
    sup.roles = [rolUser, rolAdmin, rolSuper];
    const nuevo = this.authRepository.save(sup);

    return nuevo;
  }

  async createAdmin(dto: NuevoUsuarioDto): Promise<any> {
    const { username, email } = dto;
    const exists = await this.authRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
    if (exists)
      throw new BadRequestException('El usuario que ingresaste ya existe');
    const rolAdmin = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.ADMIN }],
    });
    const rolUser = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.USER }],
    });

    if (!rolUser || !rolAdmin)
      throw new InternalServerErrorException('los roles no han sido creados');

    const admin = this.authRepository.create(dto);
    admin.roles = [rolUser, rolAdmin];
    const nuevo = this.authRepository.save(admin);

    return nuevo;
  }
  async createUser(dto: NuevoUsuarioDto): Promise<any> {
    const { username, email } = dto;
    const exists = await this.authRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
    if (exists)
      throw new BadRequestException('El usuario que ingresaste ya existe');

    const rolUser = await this.rolRepository.findOne({
      where: [{ rolNombre: RolNombre.USER }],
    });

    if (!rolUser)
      throw new InternalServerErrorException('los roles no han sido creados');

    const admin = this.authRepository.create(dto);
    admin.roles = [rolUser];
    const nuevo = this.authRepository.save(admin);

    return nuevo;
  }
  async login(dto: LoginUsuarioDto): Promise<any> {
    const { username } = dto;
    /*  
    const usuario = await this.authRepository.findOne({
      where: [{ username: username }, { email: username }],
    });
    console.log("usuario: ", usuario);
*/
    //console.log('usuario2: ', username);

    const usuario = await this.authRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password') // Recupera la contraseña
      .leftJoinAndSelect('usuario.roles', 'roles') // Carga los roles relacionados
      .where('usuario.username = :username', { username })
      .getOne();

    //console.log('usuario: ', usuario);

    if (!usuario) throw new UnauthorizedException('No existe el usuario2');
    const passwordOK = await compare(dto.password, usuario.password);
    //console.log('usuario.password: ', usuario.password);
    //console.log('dto.password: ', dto.password);
    //$2a$10$Cjbo5PmGopuvi7WiFSe3Uu58dnpT2dF1Q0HnaZno9qHeLcypH09Ji

    if (!passwordOK) throw new UnauthorizedException('Contraseña Erronea');
    const payload: PayLoadInterface = {
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      roles: usuario.roles.map((rol) => rol.rolNombre as RolNombre),
    };
    const token = await this.jwtService.sign(payload);
    //console.log(token);
    return token;
  }

  async refresh(dto: TokenDto): Promise<any> {
    if (!dto.token)
      throw new UnauthorizedException('Token No Encontrado o Ausente');
    const usuario = await this.jwtService.decode(dto.token);
    if (!usuario) throw new UnauthorizedException('Token Inválido o No Válido');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload: PayLoadInterface = {
      id: usuario['id'],
      username: usuario['username'],
      email: usuario['email'],
      roles: usuario['roles'],
    };
    const token = await this.jwtService.sign(payload);
    return token;
  }
}
