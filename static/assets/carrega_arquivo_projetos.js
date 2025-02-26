document.addEventListener("DOMContentLoaded", function() {
    // Captura o parâmetro da URL
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id"); // Pega o ID do projeto a partir da URL (ex: projeto.html?id=001)

    if (projectId) {
        fetch('./assets/projects_data.csv')
            .then(response => response.text())
            .then(data => {
                const projetos = parseCSV(data);
                const projeto = projetos.find(p => p.id === projectId);

                if (projeto) {
                    preencherTemplate(projeto);
                } else {
                    alert("Projeto não encontrado.");
                }
            })
            .catch(error => console.error("Erro ao carregar o arquivo CSV:", error));
    } else {
        alert("ID do projeto não informado.");
    }
});

// Função para converter o CSV em um array de objetos
function parseCSV(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let insideQuotes = false;

        for (let char of line) {
            if (char === '"' && insideQuotes) {
                insideQuotes = false; // Fecha as aspas
            } else if (char === '"' && !insideQuotes) {
                insideQuotes = true; // Abre as aspas
            } else if (char === ',' && !insideQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        return headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index] ? values[index].trim() : '';
            return acc;
        }, {});
    });
}


// Função para preencher o template com os dados do projeto
function preencherTemplate(projeto) {
    document.getElementById("imgPrincipal").src = projeto.img_principal;
    document.getElementById("titulo").textContent = projeto.titulo;
    document.getElementById("descricao").innerHTML = projeto.descricao.replace(/\\n/g, '<br> <br>');
    document.getElementById("quote").textContent = projeto.quote;
    document.getElementById("autor").textContent = `— ${projeto.autor}`;
    document.getElementById("imgSecundaria1").src = projeto.img_secundaria_1;
    document.getElementById("imgSecundaria2").src = projeto.img_secundaria_2;
    document.getElementById("cliente").textContent = `Cliente: ${projeto.cliente}`;
}
