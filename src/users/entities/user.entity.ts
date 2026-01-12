import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type: 'varchar', length: 50, nullable: true})
    firstName: string ;

    @Column({type: 'varchar', length: 50, nullable: true})
    lastName: string ;

}
