document.addEventListener('DOMContentLoaded', function() {
    
    const btnIniciar = document.getElementById('btnIniciar');
    
    // Ação do botão "Iniciar Solicitação"
    if (btnIniciar) {
        btnIniciar.addEventListener('click', function() {
            alert(
                '🎉 Ótimo! Vamos iniciar sua solicitação de crédito!\n\n' +
                'Você será direcionado para o formulário de cadastro.\n\n' +
                '📋 Tenha em mãos:\n' +
                '• CNPJ da cooperativa\n' +
                '• Estatuto Social\n' +
                '• Ata de Eleição\n' +
                '• Dados do representante legal'
            );
            
            // Redirecionar para cadastro
            setTimeout(() => {
                window.location.href = './cadastro-cooperativa.html';
            }, 2000);
        });
    }
    
    // Opcional: Auto-play do carrossel (comentado por padrão)
    /*
    const carrossel = document.getElementById('creditoCarousel');
    if (carrossel) {
        const bsCarousel = new bootstrap.Carousel(carrossel, {
            interval: 5000, // Mudar slide a cada 5 segundos
            wrap: true      // Voltar ao primeiro após o último
        });
    }
    */
    
});