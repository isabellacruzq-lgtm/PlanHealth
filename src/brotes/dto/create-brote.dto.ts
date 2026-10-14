import { Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsString } from "class-validator";

export class CreateBroteDto {
        @IsInt()
        plantaId: number;

        @IsInt()
        enfermedadId: number;
        
        @IsDate()
        @Type(() => Date)
        fecha: Date;
        
        @IsString()
        region: string;
        
        @IsNumber()
        hectareasAfectadas: number;

        @IsInt()
        fk_brotes_plantaId: number;

        @IsInt()
        fk_brotes_enfermedad: number;

        @IsDate()
        @Type(() => Date)       
        fk_brotes_fecha: Date;

        @IsString()
        fk_brotes_region: string;
}