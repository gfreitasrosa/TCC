document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página

    // Captura os valores dos campos do formulário
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Faz a requisição ao backend
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Para proteger contra CSRF
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Analisa a resposta do backend
        if (response.ok) {
            const data = await response.json();
            // Redireciona o usuário ou exibe uma mensagem de sucesso
            alert('Login bem-sucedido!');
            window.location.href = '/dashboard'; // Exemplo de redirecionamento
        } else {
            // Lida com erros, por exemplo, credenciais inválidas
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent = 'Login falhou. Verifique suas credenciais.';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
});

// Função para obter o valor do CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}