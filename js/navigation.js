document.addEventListener('DOMContentLoaded', function() {
    
    const filtroItems = document.querySelectorAll('.dropdown-item');
    const filtroButton = document.getElementById('filtroDropdown');
    
    if (filtroItems && filtroButton) {
        filtroItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active de todos
                filtroItems.forEach(i => i.classList.remove('active'));
                
                // Adiciona active no clicado
                this.classList.add('active');
                
                // Atualiza texto do botão
                filtroButton.textContent = this.textContent;
                
                // Feedback visual
                console.log('Filtro selecionado:', this.textContent);
                
                // Aqui você poderia fazer uma requisição AJAX para filtrar os dados
            });
        });
    }
    
});