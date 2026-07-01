const API = "http://localhost:3000";

async function login() {

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {

        const res = await fetch(`${API}/auth/login`, {
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

        console.log("RESPOSTA LOGIN:", data);
        console.log("TOKEN:", data.token);

localStorage.setItem("token", data.token);

        if (!res.ok) {
            alert(data.erro || "Erro ao fazer login");
            return;
        }

        localStorage.setItem("token", data.token);

        alert("Login realizado com sucesso!");

        window.location.href = "index.html";

    } catch (erro) {

        console.error(erro);
        alert("Erro ao conectar com servidor");

    }
}