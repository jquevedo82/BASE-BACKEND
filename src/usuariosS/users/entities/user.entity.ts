/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { Rol } from 'src/usuariosS/roles/entities/rol.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @ApiProperty({ example: 99 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ example: 'Nombre y Apellido Usuario' })
  @Column({ type: 'varchar', length: 15, nullable: true })
  nombre: string;

  @ApiProperty({ example: 'UserName nombre del usuario' })
  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  username: string;

  @ApiProperty({ example: 'Email' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @ApiProperty({ example: 'Contraseña o Password' })
  @Column({ type: 'varchar', nullable: false , select: false})
  password: string;

  @ApiProperty({ example: 'Descripcion del Usuario del usuario' })
  @Column({ type: 'varchar', nullable: false })
  denominacion: string;

  @ApiProperty({ example: 'Nivel del Usuario' })
  @Column({ type: 'int', nullable: false })
  nivel: number;

  @ApiProperty({ example: 'Nivel del Usuario' })
  @Column({ type: 'boolean', nullable: false, default: true})
  isActivo: boolean;

  @ManyToMany(() => Rol, (rol) => rol.usuarios, { eager: true })
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: { name: 'usuario_id' },
    inverseJoinColumn: { name: 'rol_id' },
  })
  roles: Rol[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }
}

