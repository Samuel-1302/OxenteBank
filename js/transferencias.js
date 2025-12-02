document.addEventListener('DOMContentLoaded', function() {
    
    const transferenciaForm = document.getElementById('transferenciaForm');
    const numeroContaInput = document.getElementById('numeroConta');
    const nomeDestinatarioInput = document.getElementById('nomeDestinatario');
    const valorTransferenciaInput = document.getElementById('valorTransferencia');
    const senhaSegurancaInput = document.getElementById('senhaSeguranca');
    
    // Elementos do resumo
    const resumoConta = document.getElementById('resumoConta');
    const resumoNome = document.getElementById('resumoNome');
    const resumoValor = document.getElementById('resumoValor');
    const resumoSenha = document.getElementById('resumoSenha');
    
    // Máscara de valor (formato brasileiro)
    if (valorTransferenciaInput) {
        valorTransferenciaInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                value = (parseInt(value) / 100).toFixed(2);
                value = value.replace('.', ',');
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
            
            e.target.value = value;
            
            // Atualizar resumo
            if (value) {
                resumoValor.textContent = 'R$ ' + value;
                resumoValor.classList.add('text-success');
            } else {
                resumoValor.textContent = 'R$ 0,00';
                resumoValor.classList.remove('text-success');
            }
        });
    }
    
    // Atualizar resumo - Número da Conta
    if (numeroContaInput) {
        numeroContaInput.addEventListener('input', function() {
            resumoConta.textContent = this.value || '-';
        });
    }
    
    // Atualizar resumo - Nome do Destinatário
    if (nomeDestinatarioInput) {
        nomeDestinatarioInput.addEventListener('input', function() {
            resumoNome.textContent = this.value || '-';
        });
    }
    
    // Atualizar resumo - Senha
    if (senhaSegurancaInput) {
        senhaSegurancaInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                resumoSenha.textContent = '•'.repeat(this.value.length);
            } else {
                resumoSenha.textContent = '••••';
            }
        });
    }
    
    // Validação do Formulário
    if (transferenciaForm) {
        transferenciaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const numeroConta = numeroContaInput.value.trim();
            const nomeDestinatario = nomeDestinatarioInput.value.trim();
            const valorTransferencia = valorTransferenciaInput.value.trim();
            const senhaSeguranca = senhaSegurancaInput.value.trim();
            
            // Validações básicas
            if (!numeroConta || !nomeDestinatario || !valorTransferencia || !senhaSeguranca) {
                alert('⚠️ Por favor, preencha todos os campos obrigatórios.');
                return false;
            }
            
            // Validar número da conta (mínimo 5 dígitos)
            if (numeroConta.length < 5) {
                alert('⚠️ Número da conta inválido. Digite pelo menos 5 dígitos.');
                numeroContaInput.focus();
                return false;
            }
            
            // Validar valor (não pode ser zero)
            const valorNumerico = parseFloat(valorTransferencia.replace(/\./g, '').replace(',', '.'));
            if (valorNumerico <= 0) {
                alert('⚠️ O valor da transferência deve ser maior que zero.');
                valorTransferenciaInput.focus();
                return false;
            }
            
            // Validar senha (mínimo 4 caracteres)
            if (senhaSeguranca.length < 4) {
                alert('⚠️ A senha de segurança deve ter pelo menos 4 caracteres.');
                senhaSegurancaInput.focus();
                return false;
            }
            
            // Simulação de transferência bem-sucedida
            alert(
                '✅ Transferência realizada com sucesso!\n\n' +
                'Destinatário: ' + nomeDestinatario + '\n' +
                'Conta: ' + numeroConta + '\n' +
                'Valor: R$ ' + valorTransferencia + '\n\n' +
                'A transferência será processada em até 1 dia útil.'
            );
            
            // Redirecionar para extrato após 2 segundos
            setTimeout(() => {
                window.location.href = './saldo-extrato.html';
            }, 2000);
            
            return false;
        });
    }
    
});