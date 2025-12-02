
document.addEventListener('DOMContentLoaded', function() {
    
    const cadastroForm = document.getElementById('cadastroForm');
    const cnpjInput = document.getElementById('cnpj');
    
    // Máscara de CNPJ
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 14) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Validação do Formulário
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nomeCooperativa = document.getElementById('nomeCooperativa').value.trim();
            const cnpj = document.getElementById('cnpj').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const nomeRepresentante = document.getElementById('nomeRepresentante').value.trim();
            const emailRepresentante = document.getElementById('emailRepresentante').value.trim();
            
            // Validações básicas
            if (!nomeCooperativa || !cnpj || !endereco || !nomeRepresentante || !emailRepresentante) {
                alert('⚠️ Por favor, preencha todos os campos obrigatórios.');
                return false;
            }
            
            // Validar CNPJ (mínimo de caracteres)
            if (cnpj.replace(/\D/g, '').length !== 11) {
                alert('⚠️ CNPJ inválido. Digite 11 dígitos.');
                document.getElementById('cnpj').focus();
                return false;
            }
            
            // Validar e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailRepresentante)) {
                alert('⚠️ E-mail inválido.');
                document.getElementById('emailRepresentante').focus();
                return false;
            }
            
            // Simulação de sucesso
            alert('✅ Etapa 1 concluída!\n\nVocê será redirecionado para a próxima etapa do cadastro.');
            
            // Aqui você redirecionaria para a etapa 2
            // window.location.href = 'cadastro-cooperativa-etapa2.html';
            
            return false;
        });
    }
    
});