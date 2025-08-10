import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/user.entity';

@Entity('info')
export class Info {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    postcode: string;

    @Column()
    userId: number;

    @Column({ nullable: true })
    avatar: string;

    @OneToOne(() => User, user => user.info, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
}