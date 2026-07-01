const API = "http://localhost:3000";

/* =========================
   VERIFICA TOKEN
========================= */
const tokenInicial = localStorage.getItem("token");

if (
    !tokenInicial ||
    tokenInicial === "undefined" ||
    tokenInicial === "null"
) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

/* =========================
   HEADERS
========================= */
function getHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

/* =========================
   TRATAR ERRO 401
========================= */
function tratarSessaoExpirada(res) {

    if (res.status === 401) {

        localStorage.removeItem("token");

        alert("Sua sessão expirou. Faça login novamente.");

        window.location.href = "login.html";

        return true;
    }

    return false;
}

/* =========================
   CADASTRAR PRODUTO
========================= */
async function cadastrarProduto() {
    const sku = document.getElementById("sku").value;
    const nome = document.getElementById("nome").value;
    const estoque = document.getElementById("estoque").value;
    const preco = document.getElementById("preco").value;

    const res = await fetch(`${API}/produtos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ sku, nome, estoque, preco })
    });

    if (tratarSessaoExpirada(res)) return;

    const data = await res.json();
    alert(data.mensagem);

    listarProdutos();
}

/* =========================
   LISTAR PRODUTOS
========================= */
async function listarProdutos() {

    try {

        const res = await fetch(`${API}/produtos`, {
            headers: getHeaders()
        });

        if (tratarSessaoExpirada(res)) return;

        const data = await res.json();

        const lista = document.getElementById("listaProdutos");
        lista.innerHTML = "";

        const produtos = data.dados || [];

        if (produtos.length === 0) {
            lista.innerHTML = "<li>Nenhum produto cadastrado</li>";
            return;
        }

        produtos.forEach(prod => {

            const li = document.createElement("li");

            li.innerHTML = `
                ${prod.sku} - ${prod.nome}
                | Estoque: ${prod.estoque}
                | R$ ${prod.preco}

                <button
                    class="btn-deletar"
                    onclick="deletarProduto(${prod.id})">
                    🗑️ Deletar
                </button>
            `;

            lista.appendChild(li);

        });

    } catch (err) {

        console.error("Erro ao listar produtos:", err);

    }
}

/* =========================
   VENDA
========================= */
async function vender() {

    const sku = document.getElementById("skuVenda").value;
    const quantidade = document.getElementById("qtdVenda").value;

    try {

        const res = await fetch(`${API}/produtos/venda`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                sku,
                quantidade
            })
        });
        
        if (tratarSessaoExpirada(res)) return;
        console.log("STATUS:", res.status);

        const data = await res.json();

        console.log("RESPOSTA:", data);

        alert(data.mensagem);

        listarProdutos();

    } catch (erro) {

        console.error("ERRO:", erro);

    }
}

/* =========================
   ENTRADA
========================= */
async function entrada() {

    const sku = document.getElementById("skuEntrada").value;
    const quantidade = document.getElementById("qtdEntrada").value;

    const res = await fetch(`${API}/produtos/entrada`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            sku,
            quantidade
        })
    });

    if (tratarSessaoExpirada(res)) return;

    const data = await res.json();

    alert(data.mensagem);

    listarProdutos();
}

/* =========================
   DELETAR PRODUTO
========================= */
async function deletarProduto(id) {

    const confirmacao = confirm(
        "Tem certeza que deseja deletar este produto?"
    );

    if (!confirmacao) return;

    const res = await fetch(`${API}/produtos/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (tratarSessaoExpirada(res)) return;

    const data = await res.json();

    alert(data.mensagem);

    listarProdutos();
}

/* =========================
   LOGOUT
========================= */
function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

/* =========================
   INIT
========================= */
window.onload = listarProdutos;