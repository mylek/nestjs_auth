import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from './enums/role.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    role: Role;
}