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

        const datasetCSV = fs.readFileSync("./dados_sinteticos.csv", "utf8").trim();
        const prompt = `
            Considere o seguinte usuário.

            Dados do usuário:

            Idade: [${user.Idade}]
            Dias desde a cirurgia: [${user['Dias desde a cirurgia']}]
            Dias desde a retirada da sonda: [${user['Dias desde a retirada da sonda']}]
            IMC: [${user.IMC}]
            Ciclo atual: [${user['Ciclo atual']}]
            Semana atual: [${user['Semana atual']}]
            Número de execuções na última semana: [${user['Número de execuções na última semana']}]
            Número de execuções hoje: [${user['Número de execuções hoje']}]
            Número de absorventes usados hoje: [${user['Número de absorventes usados hoje']}]
            Perda de urina hoje: [${user['Perda de urina hoje']}]
            Ingestão de líquidos hoje: [${user['Ingestão de líquidos hoje']}]
            
            Utilize o dataset CSV fornecido para identificar todos os registros candidatos compatíveis com os dados.
            
            Critérios de compatibilidade:
            \begin{itemize}
                \item Um registro é considerado candidato quando pelo menos 50% dos atributos forem compatíveis com os dados fornecidos.
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
