import fs from 'fs';

/**
 * Quantidade de registros sintéticos
 */
const TOTAL_ROWS = 500;

/**
 * Definição das colunas
 */
const columns = [
  'id',
  'Idade',
  'Dias desde a cirurgia',
  'Dias desde a retirada da sonda',
  'IMC',
  'Ciclo atual',
  'Semana atual',
  'Execuções nos últimos 7 dias',
  'Execuções hoje',
  'Absorventes Hoje',
  'Perda de urina hoje',
  'Ingestão de líquidos hoje'
];

/**
 * Gera número aleatório contínuo
 */
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Gera inteiro com arredondamento padrão
 */
function randomInt(min, max) {
  return Math.round(randomFloat(min, max));
}

/**
 * Trunca casas decimais
 */
function truncate(value, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.trunc(value * factor) / factor;
}

/**
 * Gera um registro sintético
 */
function generateRow(id) {
  /**
   * Dias desde cirurgia
   */
  const surgeryDays = randomInt(30, 730);

  /**
   * A sonda deve ser retirada entre
   * 5 e 30 dias após a cirurgia.
   *
   * Logo:
   * retiradaSonda = cirurgia - intervalo
   */
  const catheterRemovalOffset = randomInt(5, 30);

  const catheterRemovalDays =
    surgeryDays - catheterRemovalOffset;

  return {
    'id': id,

    'Idade': randomInt(18, 65),

    'Dias desde a cirurgia': surgeryDays,

    'Dias desde a retirada da sonda':
      catheterRemovalDays,

    // IMC contínuo truncado para 1 casa decimal
    'IMC': truncate(randomFloat(16, 39.9), 1),

    'Ciclo atual': randomInt(1, 12),

    'Semana atual': randomInt(1, 8),

    'Execuções nos últimos 7 dias':
      randomInt(0, 28),

    'Execuções hoje':
      randomInt(0, 6),

    'Absorventes Hoje':
      randomInt(0, 10),

    'Perda de urina hoje':
      randomInt(0, 1000),

    'Ingestão de líquidos hoje':
      randomInt(0, 3000)
  };
}

/**
 * Escapa caracteres especiais do CSV
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  const escaped = str.replace(/"/g, '""');

  if (
    escaped.includes(',') ||
    escaped.includes('"') ||
    escaped.includes('\n')
  ) {
    return `"${escaped}"`;
  }

  return escaped;
}

/**
 * Converte objetos em CSV
 */
function generateCSV(columns, rows) {
  const header = columns.join(',');

  const body = rows.map(row => {
    return columns
      .map(column => escapeCSV(row[column]))
      .join(',');
  });

  return [header, ...body].join('\n');
}

/**
 * Gera dataset sintético
 */
const rows = [];

for (let i = 0; i < TOTAL_ROWS; i++) {
  rows.push(generateRow(i + 1));
}

/**
 * Gera conteúdo CSV
 */
const csvContent = generateCSV(columns, rows);

/**
 * Exporta arquivo
 */
const outputFile = './dados_sinteticos.csv';

fs.writeFileSync(outputFile, csvContent, 'utf8');

console.log(`CSV gerado com sucesso: ${outputFile}`);
console.log(`Total de registros: ${TOTAL_ROWS}`);