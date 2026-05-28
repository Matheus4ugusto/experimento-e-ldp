import fs from "fs";
import { generatePrivateInterval } from "ldp-interval"
import { GoogleGenAI } from "@google/genai";

function calculateEpsilon(relativeError = 0.1) {

    if (relativeError <= 0 || relativeError >= 1) {
        throw new Error("relativeError must be between 0 and 1");
    }

    return 1 / relativeError;
}

function randomId() {
  return Math.floor(Math.random() * 500) + 1;
}

function getUserByIdFromCSV(id, filePath = "./dados_sinteticos.csv") {
    const idNumber = Number(id);

    if (!Number.isInteger(idNumber) || idNumber < 1) {
        throw new Error("id must be a positive integer");
    }

    const fileContent = fs.readFileSync(filePath, "utf8").trim();
    const lines = fileContent.split(/\r?\n/);

    if (lines.length < 2) {
        return null;
    }

    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        const rowId = Number(values[0]);

        if (rowId === idNumber) {
            const user = {};

            for (let j = 0; j < headers.length; j++) {
                const key = headers[j];
                const rawValue = values[j];
                const parsedValue = Number(rawValue);

                user[key] = Number.isNaN(parsedValue) ? rawValue : parsedValue;
            }

            return user;
        }
    }

    return null;
}

function escapeCSVValue(value) {
    if (value === null || value === undefined) {
        return "";
    }

    const text = String(value).replace(/"/g, '""');

    if (text.includes(",") || text.includes("\n") || text.includes("\r") || text.includes('"')) {
        return `"${text}"`;
    }

    return text;
}

function appendIterationResultToCSV(filePath, result) {
    const header = [
        "iteracao",
        "id_selecionado",
        "tempo_resposta_llm_ms",
        "tempo_iteracao_ms",
        "resposta_llm"
    ].join(",");

    const row = [
        result.iteracao,
        result.idSelecionado,
        result.tempoRespostaLLMms,
        result.tempoIteracaoMs,
        result.respostaLLM
    ].map(escapeCSVValue).join(",");

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `${header}\n${row}\n`, "utf8");
        return;
    }

    fs.appendFileSync(filePath, `${row}\n`, "utf8");
}

const ai = new GoogleGenAI({});

async function main() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputFile = `./resultado_iteracoes_${timestamp}.csv`;
    if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
    }

    console.time("Tempo do experimento");
    for (let i = 0; i < 20; i++) {
        const iterationStart = Date.now();
        console.time(`Tempo da iteração ${i + 1}`);
        console.log(`Iteração ${i + 1}`);

        const userId = randomId();
        const user = getUserByIdFromCSV(userId);

        const idade = {
            value: user.Idade,
            min: 18,
            max: 65,
            epsilon: calculateEpsilon(0.15)
        }
        const diasCirurgia = {
            value: user['Dias desde a cirurgia'],
            min: 30,
            max: 730,
            epsilon: calculateEpsilon(0.2)
        }
        const diasRetirada = {
            value: user['Dias desde a retirada da sonda'],
            min: 25,
            max: 725,
            epsilon: calculateEpsilon(0.2)
        }
        const IMC = {
            value: user.IMC,
            min: 16,
            max: 39.9,
            epsilon: calculateEpsilon(0.1)
        }
        const cicloAtual = {
            value: user['Ciclo atual'],
            min: 1,
            max: 12,
            epsilon: calculateEpsilon(0.1)
        }
        const semanaAtual = {
            value: user['Semana atual'],
            min: 1,
            max: 8,
            epsilon: calculateEpsilon(0.1)
        }
        const execucoesUltimaSemana = {
            value: user['Execuções nos últimos 7 dias'],
            min: 0,
            max: 28,
            epsilon: calculateEpsilon(0.1)
        }
        const execucoesHoje = {
            value: user['Execuções hoje'],
            min: 0,
            max: 6,
            epsilon: calculateEpsilon(0.1)
        }
        const absorventesHoje = {
            value: user['Absorventes Hoje'],
            min: 0,
            max: 10,
            epsilon: calculateEpsilon(0.1)
        }
        const perdaUrinaHoje = {
            value: user['Perda de urina hoje'],
            min: 0,
            max: 1000,
            epsilon: calculateEpsilon(0.1)
        }
        const ingestaoLiquidosHoje = {
            value: user['Ingestão de líquidos hoje'],
            min: 0,
            max: 3000,
            epsilon: calculateEpsilon(0.1)
        }

        let idadePrivatizada = generatePrivateInterval(idade.value, idade.epsilon, idade.min, idade.max)
        let diasCirurgiaPrivatizada = generatePrivateInterval(diasCirurgia.value, diasCirurgia.epsilon, diasCirurgia.min, diasCirurgia.max)
        let diasRetiradaPrivatizada = generatePrivateInterval(diasRetirada.value, diasRetirada.epsilon, diasRetirada.min, diasRetirada.max)
        let IMCPrivatizado = generatePrivateInterval(IMC.value, IMC.epsilon, IMC.min, IMC.max)
        let cicloAtualPrivatizado = generatePrivateInterval(cicloAtual.value, cicloAtual.epsilon, cicloAtual.min, cicloAtual.max)
        let semanaAtualPrivatizada = generatePrivateInterval(semanaAtual.value, semanaAtual.epsilon, semanaAtual.min, semanaAtual.max)
        let execucoesUltimaSemanaPrivatizadas = generatePrivateInterval(execucoesUltimaSemana.value, execucoesUltimaSemana.epsilon, execucoesUltimaSemana.min, execucoesUltimaSemana.max)
        let execucoesHojePrivatizadas = generatePrivateInterval(execucoesHoje.value, execucoesHoje.epsilon, execucoesHoje.min, execucoesHoje.max)
        let absorventesHojePrivatizados = generatePrivateInterval(absorventesHoje.value, absorventesHoje.epsilon, absorventesHoje.min, absorventesHoje.max)
        let perdaUrinaHojePrivatizada = generatePrivateInterval(perdaUrinaHoje.value, perdaUrinaHoje.epsilon, perdaUrinaHoje.min, perdaUrinaHoje.max)
        let ingestaoLiquidosHojePrivatizada = generatePrivateInterval(ingestaoLiquidosHoje.value, ingestaoLiquidosHoje.epsilon, ingestaoLiquidosHoje.min, ingestaoLiquidosHoje.max)
        
        idadePrivatizada.interval = [Math.round(idadePrivatizada.interval[0]), Math.round(idadePrivatizada.interval[1])]
        diasCirurgiaPrivatizada.interval = [Math.round(diasCirurgiaPrivatizada.interval[0]), Math.round(diasCirurgiaPrivatizada.interval[1])]
        diasRetiradaPrivatizada.interval = [Math.round(diasRetiradaPrivatizada.interval[0]), Math.round(diasRetiradaPrivatizada.interval[1])]
        IMCPrivatizado.interval = [
            Math.trunc(IMCPrivatizado.interval[0] * 10) / 10,
            Math.trunc(IMCPrivatizado.interval[1] * 10) / 10
        ]
        cicloAtualPrivatizado.interval = [Math.round(cicloAtualPrivatizado.interval[0]), Math.round(cicloAtualPrivatizado.interval[1])]
        semanaAtualPrivatizada.interval = [Math.round(semanaAtualPrivatizada.interval[0]), Math.round(semanaAtualPrivatizada.interval[1])]
        execucoesUltimaSemanaPrivatizadas.interval = [Math.round(execucoesUltimaSemanaPrivatizadas.interval[0]), Math.round(execucoesUltimaSemanaPrivatizadas.interval[1])]
        execucoesHojePrivatizadas.interval = [Math.round(execucoesHojePrivatizadas.interval[0]), Math.round(execucoesHojePrivatizadas.interval[1])]
        absorventesHojePrivatizados.interval = [Math.round(absorventesHojePrivatizados.interval[0]), Math.round(absorventesHojePrivatizados.interval[1])]
        perdaUrinaHojePrivatizada.interval = [
            Math.trunc(perdaUrinaHojePrivatizada.interval[0]),
            Math.trunc(perdaUrinaHojePrivatizada.interval[1])
        ]
        ingestaoLiquidosHojePrivatizada.interval = [
            Math.trunc(ingestaoLiquidosHojePrivatizada.interval[0]),
            Math.trunc(ingestaoLiquidosHojePrivatizada.interval[1])
        ]


        const datasetCSV = fs.readFileSync("./dados_sinteticos.csv", "utf8").trim();
        const prompt = `
            Considere o seguinte usuário anonimizado, cujos dados foram perturbados por um mecanismo de Privacidade Diferencial Local intervalar ($\epsilon$-LDP intervalar).

            Dados anonimizados do usuário:

            Idade: [${idadePrivatizada.interval}]
            Dias desde a cirurgia: [${diasCirurgiaPrivatizada.interval}]
            Dias desde a retirada da sonda: [${diasRetiradaPrivatizada.interval}]
            IMC: [${IMCPrivatizado.interval}]
            Ciclo atual: [${cicloAtualPrivatizado.interval}]
            Semana atual: [${semanaAtualPrivatizada.interval}]
            Número de execuções na última semana: [${execucoesUltimaSemanaPrivatizadas.interval}]
            Número de execuções hoje: [${execucoesHojePrivatizadas.interval}]
            Número de absorventes usados hoje: [${absorventesHojePrivatizados.interval}]
            Perda de urina hoje: [${perdaUrinaHojePrivatizada.interval}]
            Ingestão de líquidos hoje: [${ingestaoLiquidosHojePrivatizada.interval}]
            
            Utilize o dataset CSV fornecido para identificar todos os registros candidatos compatíveis com os intervalos privatizados.
            
            Critérios de compatibilidade:
            \begin{itemize}
                \item Um registro é considerado candidato quando pelo menos 50% dos atributos estiverem contidos dentro dos respectivos intervalos privatizados.
                \item Considere que os valores originais foram perturbados pelo mecanismo $\epsilon$-LDP intervalar.
                \item Não calcule probabilidades, scores, similaridade, ranking ou explicações.
            \end{itemize}

            IMPORTANTE:
            \begin{itemize}
                \item A saída deve conter SOMENTE uma lista JSON com os IDs candidatos.
                \item Não escreva explicações, comentários, títulos, markdown ou qualquer texto adicional.
                \item O formato da resposta deve ser EXATAMENTE: [id1, id2, id3]
            \end{itemize}

            Dataset em CSV:
            ${datasetCSV}
        `;
        console.log("=====================");
        console.log(`Id selecionado: ${userId}`);
        console.log("=====================");
        console.time("Tempo de resposta da LLM");
        const responseStart = Date.now();
        let response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });
        const responseEnd = Date.now();
        console.log(`Resposta da LLM: ${response.text}`);
        console.timeEnd("Tempo de resposta da LLM");
        console.timeEnd(`Tempo da iteração ${i + 1}`);

        appendIterationResultToCSV(outputFile, {
            iteracao: i + 1,
            idSelecionado: userId,
            tempoRespostaLLMms: responseEnd - responseStart,
            tempoIteracaoMs: Date.now() - iterationStart,
            respostaLLM: response.text
        });
    }
    console.timeEnd("Tempo do experimento");
}
    
main();
