import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tratamiento, TipoTratamiento } from './tratamiento.entity.js';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto.js';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto.js';
@Injectable()
export class TratamientosService {
  constructor(@InjectRepository(Tratamiento) private readonly repo:Repository<Tratamiento>){}
  private texto(v:unknown,campo:string,max=120):string{if(typeof v!=='string'||!v.trim())throw new BadRequestException(`${campo} es obligatorio`);const s=v.trim();if(s.length>max)throw new BadRequestException(`${campo} no puede superar ${max} caracteres`);return s;}
  private id(v:unknown):number{const n=Number(v);if(!Number.isInteger(n)||n<=0)throw new BadRequestException('enfermedadId debe ser un entero positivo');return n;}
  private tipo(v:unknown):TipoTratamiento{if(!Object.values(TipoTratamiento).includes(v as TipoTratamiento))throw new BadRequestException(`tipo debe ser uno de: ${Object.values(TipoTratamiento).join(', ')}`);return v as TipoTratamiento;}
  private async validarEnfermedad(id:number){const rows=await this.repo.manager.query('SELECT id FROM enfermedades WHERE id = ?', [id]);if(!rows.length)throw new NotFoundException(`No existe una enfermedad con ID ${id}`);}
  async crear(dto:CreateTratamientoDto){const enfermedadId=this.id(dto.enfermedadId);await this.validarEnfermedad(enfermedadId);return this.repo.save(this.repo.create({nombre:this.texto(dto.nombre,'nombre'),descripcionAplicacion:this.texto(dto.descripcionAplicacion,'descripcionAplicacion',5000),tipo:this.tipo(dto.tipo),enfermedadId}));}
  async listar(f:{tipo?:string;enfermedadId?:string;nombre?:string}){const qb=this.repo.createQueryBuilder('t');if(f.tipo)qb.andWhere('t.tipo = :tipo',{tipo:this.tipo(f.tipo)});if(f.enfermedadId!==undefined)qb.andWhere('t.enfermedadId = :eid',{eid:this.id(f.enfermedadId)});if(f.nombre)qb.andWhere('t.nombre LIKE :nombre',{nombre:`%${f.nombre}%`});return qb.orderBy('t.id','ASC').getMany();}
  async buscarPorId(id:number){const r=await this.repo.findOneBy({id});if(!r)throw new NotFoundException(`No existe un tratamiento con ID ${id}`);return r;}
  async actualizar(id:number,dto:UpdateTratamientoDto){const r=await this.buscarPorId(id);if(dto.nombre!==undefined)r.nombre=this.texto(dto.nombre,'nombre');if(dto.descripcionAplicacion!==undefined)r.descripcionAplicacion=this.texto(dto.descripcionAplicacion,'descripcionAplicacion',5000);if(dto.tipo!==undefined)r.tipo=this.tipo(dto.tipo);if(dto.enfermedadId!==undefined){r.enfermedadId=this.id(dto.enfermedadId);await this.validarEnfermedad(r.enfermedadId);}return this.repo.save(r);}
  async eliminar(id:number){await this.buscarPorId(id);await this.repo.delete(id);return {mensaje:`Tratamiento ${id} eliminado correctamente`};}
}
