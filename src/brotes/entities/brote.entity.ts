    import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

    @Entity("brotes")
    export class Brote {

        @PrimaryGeneratedColumn()
        id:number;

        @Column({type:"int"})
        plantaId: number;

        @Column({type:"int"})
        enfermedadId: number;

        @Column({type:"date"})
        fecha: Date;

        @Column({type:"varchar", length: 100})
        region: string;

        @Column({type:"decimal", precision: 12, scale: 2})
        hectareasAfectadas: number;

        @Column({type:"int"})
        fk_brotes_plantaId: number;
        
        @Column({type:"int"})
        fk_brotes_enfermedad: number;

        @Column({type:"date"})
        fk_brotes_fecha: Date;

        @Column({type:"varchar", length: 100})
        fk_brotes_region: string;






        
    }
