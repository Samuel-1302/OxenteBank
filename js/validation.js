document.addEventListener('DOMContentLoaded', function() {
    
    const recuperarForm = document.getElementById('recuperarSenhaForm');
    
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailCpfInput = document.getElementById('emailCpf');
            const valor = emailCpfInput.value.trim();
            
            
            if (valor === '') {
                alert('Por favor, informe seu e-mail ou CPF.');
                emailCpfInput.focus();
                return false;
            }
            
            
            const isEmail = valor.includes('@');
            const isCPF = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valor);
            
            if (!isEmail && !isCPF) {
                alert('Por favor, informe um e-mail ou CPF válido.');
                emailCpfInput.focus();
                return false;
            }
            
            
            alert('✅ Instruções enviadas com sucesso!\n\nVerifique seu e-mail para redefinir sua senha.');
            
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            
            return false;
        });
    }
    
});