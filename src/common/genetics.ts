import { BadRequestException } from '@nestjs/common';

/** Compara dos secuencias de ADN de igual longitud y cuenta las posiciones distintas. */
export function compareGeneticSequences(cultivoId: number, referencia: string, semilla: string) {
  if (!/^[ACGT]+$/.test(referencia) || !/^[ACGT]+$/.test(semilla)) {
    throw new BadRequestException(
      'Las secuencias genéticas deben contener únicamente A, C, G y T en mayúsculas y no estar vacías.',
    );
  }

  if (referencia.length !== semilla.length) {
    throw new BadRequestException(
      `No se pueden comparar las secuencias: la referencia tiene longitud ${referencia.length} y la semilla longitud ${semilla.length}.`,
    );
  }

  let mutaciones = 0;
  for (let i = 0; i < referencia.length; i += 1) {
    if (referencia[i] !== semilla[i]) mutaciones += 1;
  }

  return {
    cultivoId,
    longitudReferencia: referencia.length,
    longitudSemilla: semilla.length,
    mutaciones,
  };
}
