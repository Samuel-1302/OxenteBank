document.addEventListener('DOMContentLoaded', function() {
    
    const formularioForm = document.getElementById('formularioCreditoForm');
    const valorSolicitadoInput = document.getElementById('valorSolicitado');
    const finalidadeCreditoSelect = document.getElementById('finalidadeCredito');
    const prazoPagamentoRadios = document.querySelectorAll('input[name="prazoPagamento"]');
    const descricaoFinalidadeTextarea = document.getElementById('descricaoFinalidade');
    
    // Elementos da simulação
    const simValor = document.getElementById('simValor');
    const simTaxa = document.getElementById('simTaxa');
    const simPrazo = document.getElementById('simPrazo');
    const simTotal = document.getElementById('simTotal');
    const simParcela = document.getElementById('simParcela');
    
    // Taxa de juros mensal (1,2% a.m.)
    const taxaJuros = 0.012;
    
    // Máscara de valor (formato brasileiro)
    if (valorSolicitadoInput) {
        valorSolicitadoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                value = (parseInt(value) / 100).toFixed(2);
                value = value.replace('.', ',');
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
            
            e.target.value = value;
            atualizarSimulacao();
        });
    }
    
    // Atualizar simulação ao mudar prazo
    prazoPagamentoRadios.forEach(radio => {
        radio.addEventListener('change', atualizarSimulacao);
    });
    
    // Função para calcular e atualizar simulação
    function atualizarSimulacao() {
        const valorStr = valorSolicitadoInput.value;
        const valorNumerico = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
        
        if (valorNumerico > 0) {
            simValor.textContent = 'R$ ' + valorStr;
            
            // Pegar prazo selecionado
            const prazoSelecionado = document.querySelector('input[name="prazoPagamento"]:checked');
            
            if (prazoSelecionado) {
                const meses = parseInt(prazoSelecionado.value);
                simPrazo.textContent = meses + ' meses';
                
                // Calcular valor total com juros compostos
                const valorTotal = valorNumerico * Math.pow(1 + taxaJuros, meses);
                const valorParcela = valorTotal / meses;
                
                simTotal.textContent = 'R$ ' + valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                simParcela.textContent = 'R$ ' + valorParcela.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            } else {
                simPrazo.textContent = '-';
                simTotal.textContent = 'R$ 0,00';
                simParcela.textContent = 'R$ 0,00';
            }
        } else {
            simValor.textContent = 'R$ 0,00';
            simPrazo.textContent = '-';
            simTotal.textContent = 'R$ 0,00';
            simParcela.textContent = 'R$ 0,00';
        }
    }
    
    // Validação do Formulário
    if (formularioForm) {
        formularioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const valorSolicitado = valorSolicitadoInput.value.trim();
            const finalidade = finalidadeCreditoSelect.value;
            const prazo = document.querySelector('input[name="prazoPagamento"]:checked');
            const descricao = descricaoFinalidadeTextarea.value.trim();
            
            // Validações
            if (!valorSolicitado || valorSolicitado === '0,00') {
                alert('⚠️ Por favor, informe o valor solicitado.');
                valorSolicitadoInput.focus();
                return false;
            }
            
            const valorNumerico = parseFloat(valorSolicitado.replace(/\./g, '').replace(',', '.'));
            if (valorNumerico < 10000) {
                alert('⚠️ O valor mínimo para solicitação é R$ 10.000,00.');
                valorSolicitadoInput.focus();
                return false;
            }
            
            if (!finalidade) {
                alert('⚠️ Por favor, selecione a finalidade do crédito.');
                finalidadeCreditoSelect.focus();
                return false;
            }
            
            if (!prazo) {
                alert('⚠️ Por favor, selecione o prazo de pagamento.');
                return false;
            }
            
            if (descricao.length < 50) {
                alert('⚠️ A descrição deve ter pelo menos 50 caracteres.');
                descricaoFinalidadeTextarea.focus();
                return false;
            }
            
            // Sucesso
            alert(
                '✅ Solicitação enviada com sucesso!\n\n' +
                'Valor: R$ ' + valorSolicitado + '\n' +
                'Prazo: ' + prazo.value + ' meses\n' +
                'Finalidade: ' + finalidadeCreditoSelect.options[finalidadeCreditoSelect.selectedIndex].text + '\n\n' +
                '📋 Sua solicitação será analisada em até 48 horas.\n' +
                'Você receberá uma notificação por e-mail.'
            );
            
            // Redirecionar para dashboard
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);
            
            return false;
        });
    }
    
});