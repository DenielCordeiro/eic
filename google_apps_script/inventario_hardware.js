// Função genérica para limpar/tratar qualquer valor (nulo, NaN, undefined, string vazia)
function checkIsNull(valor) {
    if (valor === null || valor === undefined) return "";
    if (typeof valor === "number" && isNaN(valor)) return "";
    if (typeof valor === "string" && valor.trim().toUpperCase() === "NAN") return "";
    return valor;
}

// Atende requisições GET (Busca todas as máquinas)
function doGet(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
        return responderJSON([]);
    }

    var headers = rows[0];
    var data = [];

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var record = {};
        for (var j = 0; j < headers.length; j++) {
            var headerName = headers[j].toString().trim();
            record[headerName] = checkIsNull(row[j]);
        }
        data.push(record);
    }

    return responderJSON(data);
}

// Atende requisições POST (Centraliza Cadastrar, Atualizar e Excluir)
function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var body = JSON.parse(e.postData.contents);

        // Identifica qual ação executar (se não enviada, assume "CREATE" como padrão)
        var action = (body.action || "CREATE").toUpperCase();

        if (action === "CREATE") {
            sheet.appendRow([
                checkIsNull(body.Usuario),
                checkIsNull(body.Email),
                checkIsNull(body.Nome_da_Maquina),
                checkIsNull(body.Sistema_Operacional),
                checkIsNull(body.Placa_mae),
                checkIsNull(body.Processador),
                checkIsNull(body.Armazenamento),
                checkIsNull(body.Placa_de_Video),
                checkIsNull(body.Conector_de_Rede),
                checkIsNull(body.Quantidade_de_RAM),
                checkIsNull(body.Geracao_da_RAM),
                checkIsNull(body.Termo)
            ]);
            return responderJSON({ status: "sucesso", mensagem: "Registro criado com sucesso!" });
        }

        if (action === "UPDATE") {
            var rows = sheet.getDataRange().getValues();
            var headers = rows[0];

            // Descobre o índice da coluna "Nome_da_Maquina" (que é o identificador único)
            var colIndexNome = headers.findIndex(function (h) {
                return h.toString().trim() === "Nome_da_Maquina";
            });

            if (colIndexNome === -1) {
                return responderJSON({ status: "erro", mensagem: "Coluna 'Nome_da_Maquina' não encontrada na planilha." });
            }

            // Procura a linha que contém o Nome_da_Maquina
            for (var i = 1; i < rows.length; i++) {
                if (rows[i][colIndexNome].toString().trim() === body.Nome_da_Maquina.toString().trim()) {
                    var rowNum = i + 1; // Linhas na planilha começam no índice 1

                    // Mapeia e atualiza os novos valores na linha encontrada
                    var newRowData = [
                        checkIsNull(body.Usuario),
                        checkIsNull(body.Email),
                        checkIsNull(body.Nome_da_Maquina),
                        checkIsNull(body.Sistema_Operacional),
                        checkIsNull(body.Placa_mae),
                        checkIsNull(body.Processador),
                        checkIsNull(body.Armazenamento),
                        checkIsNull(body.Placa_de_Video),
                        checkIsNull(body.Conector_de_Rede),
                        checkIsNull(body.Quantidade_de_RAM),
                        checkIsNull(body.Geracao_da_RAM),
                        checkIsNull(body.Termo)
                    ];

                    sheet.getRange(rowNum, 1, 1, newRowData.length).setValues([newRowData]);
                    return responderJSON({ status: "sucesso", mensagem: "Registro atualizado com sucesso!" });
                }
            }

            return responderJSON({ status: "erro", mensagem: "Máquina não encontrada para atualização." });
        }

        if (action === "DELETE") {
            var rows = sheet.getDataRange().getValues();
            var headers = rows[0];

            var colIndexNome = headers.findIndex(function (h) {
                return h.toString().trim() === "Nome_da_Maquina";
            });

            if (colIndexNome === -1) {
                return responderJSON({ status: "erro", mensagem: "Coluna 'Nome_da_Maquina' não encontrada na planilha." });
            }

            // Procura e exclui a linha
            for (var i = 1; i < rows.length; i++) {
                if (rows[i][colIndexNome].toString().trim() === body.Nome_da_Maquina.toString().trim()) {
                    var rowNum = i + 1;
                    sheet.deleteRow(rowNum);
                    return responderJSON({ status: "sucesso", mensagem: "Registro excluído com sucesso!" });
                }
            } F

            return responderJSON({ status: "erro", mensagem: "Máquina não encontrada para exclusão." });
        }

        return responderJSON({ status: "erro", mensagem: "Ação não reconhecida: " + action });

    } catch (err) {
        return responderJSON({ status: "erro", mensagem: err.toString() });
    }
}

// Função auxiliar para respostas em JSON com permissões CORS liberadas
function responderJSON(dados) {
    return ContentService.createTextOutput(JSON.stringify(dados))
        .setMimeType(ContentService.MimeType.JSON);
}
