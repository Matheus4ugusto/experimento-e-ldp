import { generatePrivateInterval } from "ldp-interval"

const epsilon = 5

function calculateEpsilon(relativeError = 0.1) {

    if (relativeError <= 0 || relativeError >= 1) {
        throw new Error("relativeError must be between 0 and 1");
    }

    return 1 / relativeError;
}

const idade = {
    value: 25,
    min: 18,
    max: 65,
    epsilon: calculateEpsilon(0.05)
}
const diasCirurgia = {
    value: 676,
    min: 30,
    max: 730,
    epsilon: calculateEpsilon(0.05)
}
const diasRetirada = {
    value: 655,
    min: 25,
    max: 725,
    epsilon: calculateEpsilon(0.05)
}
const IMC = {
    value: 28.6,
    min: 16,
    max: 39.9,
    epsilon: calculateEpsilon(0.01)
}
const cicloAtual = {
    value: 4,
    min: 1,
    max: 12,
    epsilon: calculateEpsilon(0.01)
}
const semanaAtual = {
    value: 5,
    min: 1,
    max: 8,
    epsilon: calculateEpsilon(0.01)
}
const execucoesUltimaSemana = {
    value: 3,
    min: 0,
    max: 28,
    epsilon: calculateEpsilon(0.01)
}
const execucoesHoje = {
    value: 3,
    min: 0,
    max: 6,
    epsilon: calculateEpsilon(0.01)
}
const absorventesHoje = {
    value: 8,
    min: 0,
    max: 10,
    epsilon: calculateEpsilon(0.01)
}
const perdaUrinaHoje = {
    value: 948,
    min: 0,
    max: 1000,
    epsilon: calculateEpsilon(0.1)
}
const ingestaoLiquidosHoje = {
    value: 18,
    min: 0,
    max: 3000,
    epsilon: calculateEpsilon(0.1)
}

const idadePrivatizada = generatePrivateInterval(idade.value, idade.epsilon, idade.min, idade.max)
const diasCirurgiaPrivatizada = generatePrivateInterval(diasCirurgia.value, diasCirurgia.epsilon, diasCirurgia.min, diasCirurgia.max)
const diasRetiradaPrivatizada = generatePrivateInterval(diasRetirada.value, diasRetirada.epsilon, diasRetirada.min, diasRetirada.max)
const IMCPrivatizado = generatePrivateInterval(IMC.value, IMC.epsilon, IMC.min, IMC.max)
const cicloAtualPrivatizado = generatePrivateInterval(cicloAtual.value, cicloAtual.epsilon, cicloAtual.min, cicloAtual.max)
const semanaAtualPrivatizada = generatePrivateInterval(semanaAtual.value, semanaAtual.epsilon, semanaAtual.min, semanaAtual.max)
const execucoesUltimaSemanaPrivatizadas = generatePrivateInterval(execucoesUltimaSemana.value, execucoesUltimaSemana.epsilon, execucoesUltimaSemana.min, execucoesUltimaSemana.max)
const execucoesHojePrivatizadas = generatePrivateInterval(execucoesHoje.value, execucoesHoje.epsilon, execucoesHoje.min, execucoesHoje.max)
const absorventesHojePrivatizados = generatePrivateInterval(absorventesHoje.value, absorventesHoje.epsilon, absorventesHoje.min, absorventesHoje.max)
const perdaUrinaHojePrivatizada = generatePrivateInterval(perdaUrinaHoje.value, perdaUrinaHoje.epsilon, perdaUrinaHoje.min, perdaUrinaHoje.max)
const ingestaoLiquidosHojePrivatizada = generatePrivateInterval(ingestaoLiquidosHoje.value, ingestaoLiquidosHoje.epsilon, ingestaoLiquidosHoje.min, ingestaoLiquidosHoje.max)

console.log(`Idade: [${idadePrivatizada.interval}]`);
console.log(`Dias desde a cirurgia: [${diasCirurgiaPrivatizada.interval}]`);
console.log(`Dias desde a retirada da sonda: [${diasRetiradaPrivatizada.interval}]`);
console.log(`IMC: [${IMCPrivatizado.interval}]`);
console.log(`Ciclo atual: [${cicloAtualPrivatizado.interval}]`);
console.log(`Semana atual: [${semanaAtualPrivatizada.interval}]`);
console.log(`Número de execuções na última semana: [${execucoesUltimaSemanaPrivatizadas.interval}]`);
console.log(`Número de execuções hoje: [${execucoesHojePrivatizadas.interval}]`);
console.log(`Número de absorventes usados hoje: [${absorventesHojePrivatizados.interval}]`);
console.log(`Perda de urina hoje: [${perdaUrinaHojePrivatizada.interval}]`);
console.log(`Ingestão de líquidos hoje: [${ingestaoLiquidosHojePrivatizada.interval}]`); 