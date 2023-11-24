/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolNombre } from './rol.enum';

@Entity({ name: 'rol' })
export class Rol {
  @ApiProperty( {example: 99})
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: `A list of user's roles`,
    example: ['admin','user'],
  })
  @Column({name: 'rolnombre', type: 'varchar', length: 15, nullable: false, unique: true })
  rolNombre: RolNombre;

  @ManyToMany(() => User, usuario => usuario.roles)
  usuarios: User[];

}
