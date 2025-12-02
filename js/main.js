document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // VALIDAÇÃO: LOGIN
    // ===================================
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuario = document.getElementById('usuario').value.trim();
            const senha = document.getElementById('senha').value.trim();
            
            // Validação básica
            if (usuario === '' || senha === '') {
                alert('⚠️ Por favor, preencha todos os campos.');
                return false;
            }
            
            // Validação mínima de senha
            if (senha.length < 4) {
                alert('⚠️ A senha deve ter pelo menos 4 caracteres.');
                return false;
            }
            
            // Simulação de login bem-sucedido
            alert('✅ Login realizado com sucesso!\n\nRedirecionando para o Dashboard...');
            
            // Redirecionar para o dashboard
            setTimeout(() => {
                window.location.href = './pages/dashboard.html';
            }, 1500);
            
            return false;
        });
    }
    
    // ===================================
    // VALIDAÇÃO: RECUPERAR SENHA
    // ===================================
    
    const recuperarForm = document.getElementById('recuperarSenhaForm');
    
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailCpfInput = document.getElementById('emailCpf');
            const valor = emailCpfInput.value.trim();
            
            // Validação básica
            if (valor === '') {
                alert('⚠️ Por favor, informe seu e-mail ou CPF.');
                emailCpfInput.focus();
                return false;
            }
            
            // Verificar se é e-mail ou CPF
            const isEmail = valor.includes('@');
            const isCPF = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valor);
            
            if (!isEmail && !isCPF) {
                alert('⚠️ Por favor, informe um e-mail ou CPF válido.');
                emailCpfInput.focus();
                return false;
            }
            
            // Simulação de envio
            alert('✅ Instruções enviadas com sucesso!\n\nVerifique seu e-mail para redefinir sua senha.');
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            
            return false;
        });
    }
    
});