console.log("HISTORICO.JS CARREGOU");

const API = "http://localhost:3000";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

function verificarSessaoExpirada(data) {

    if (data.mensagem === "jwt expired") {

        localStorage.removeItem("token");

        alert("Sua sessão expirou. Faça login novamente.");

        window.location.href = "login.html";

        return true;
    }

    return false;
}

async function carregarHistorico() {

    try {

        const res = await fetch(
            `${API}/produtos/movimentacoes`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (verificarSessaoExpirada(data)) return;

        console.log("MOVIMENTAÇÕES:", data);
        console.log("TODAS AS VENDAS:", data.dados);

        const lista =
            document.getElementById("listaVendasDia");

        lista.innerHTML = "";

        if (!data.dados || data.dados.length === 0) {

            lista.innerHTML =
                "<li>Nenhuma venda registrada.</li>";

            document.getElementById("qtdVendas")
                .textContent = 0;

            document.getElementById("resumoMes").innerHTML = `
                <strong>Total de vendas:</strong> 0
                <br><br>
                <strong>Itens vendidos:</strong> 0
            `;

            return;
        }

        const hoje = new Date()
            .toISOString()
            .split("T")[0];

        const vendasHoje = data.dados.filter(venda =>
            venda.data.startsWith(hoje)
        );

        document.getElementById("qtdVendas")
            .textContent = vendasHoje.length;

        let totalItensVendidos = 0;

        vendasHoje.forEach(venda => {

            const li = document.createElement("li");

            const dataVenda =
                new Date(venda.data)
                    .toLocaleString("pt-BR");

            li.innerHTML = `
                <strong>${venda.nome}</strong><br>
                SKU: ${venda.sku}<br>
                Quantidade: ${venda.quantidade}<br>
                Data: ${dataVenda}
            `;

            totalItensVendidos +=
                Number(venda.quantidade);

            lista.appendChild(li);

        });

        if (vendasHoje.length === 0) {

            lista.innerHTML =
                "<li>Nenhuma venda registrada hoje.</li>";

        }

        document.getElementById("resumoMes").innerHTML = `
            <strong>Total de vendas hoje:</strong>
            ${vendasHoje.length}
            <br><br>

            <strong>Itens vendidos hoje:</strong>
            ${totalItensVendidos}
        `;

    } catch (erro) {

        console.error(
            "Erro ao carregar histórico:",
            erro
        );

    }
}

window.onload = carregarHistorico;

async function enviarWhatsapp() {

    const res = await fetch(
        `${API}/produtos/relatorio/pdf`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    window.open(url);

    const numero = "5511999999999";

    const mensagem = encodeURIComponent(
        "Segue o relatório mensal."
    );

    window.open(
        `https://wa.me/${numero}?text=${mensagem}`,
        "_blank"
    );

}

async function fechamentoMes() {

    const confirmar = confirm(
        "Deseja realizar o fechamento?"
    );

    if (!confirmar) return;

    console.log("TOKEN:", token);

    try {

        const res = await fetch(
            `${API}/produtos/fechamento`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("STATUS:", res.status);

        const data = await res.json();

        if (verificarSessaoExpirada(data)) return;

        console.log("RESPOSTA:", data);

        alert(data.mensagem);

        carregarHistorico();

    } catch (erro) {

        console.error("ERRO:", erro);

    }
}