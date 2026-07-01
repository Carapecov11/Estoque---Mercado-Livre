const API = "http://localhost:3000";

async function registrar() {

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {

        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario,
                senha
            })
        });

        const data = await res.json();

        alert(data.mensagem);

        if (res.ok) {
            window.location.href = "login.html";
        }

    } catch (erro) {

        console.error(erro);
        alert("Erro ao conectar com servidor");

    }
}