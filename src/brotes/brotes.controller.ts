import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrotesService } from './brotes.service.js';
import { CreateBroteDto } from './dto/create-brote.dto.js';
import { UpdateBroteDto } from './dto/update-brote.dto.js';

@Controller('brotes')
export class BrotesController {
  constructor(private readonly brotesService: BrotesService) {}

  @Post()
  create(@Body() createBroteDto: CreateBroteDto) {
    return this.brotesService.create(createBroteDto);
  }

  @Get()
  findAll() {
    return this.brotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brotesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBroteDto: UpdateBroteDto) {
    return this.brotesService.update(+id, updateBroteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brotesService.remove(+id);
  }
}
