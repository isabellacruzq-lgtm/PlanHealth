import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { compareGeneticSequences } from './genetics.js';

describe('compareGeneticSequences', () => {
  it('cuenta las posiciones diferentes', () => {
    expect(compareGeneticSequences(12, 'ACGTACGT', 'ACTTAGGT')).toMatchObject({
      cultivoId: 12,
      mutaciones: 2,
    });
  });

  it('acepta secuencias idénticas con cero mutaciones', () => {
    expect(compareGeneticSequences(1, 'ACGT', 'ACGT').mutaciones).toBe(0);
  });

  it('rechaza secuencias de longitud diferente', () => {
    expect(() => compareGeneticSequences(1, 'ACGT', 'ACG')).toThrow(BadRequestException);
  });

  it('rechaza minúsculas y caracteres no permitidos', () => {
    expect(() => compareGeneticSequences(1, 'acgt', 'ACGT')).toThrow(BadRequestException);
    expect(() => compareGeneticSequences(1, 'ACGX', 'ACGT')).toThrow(BadRequestException);
  });
});
