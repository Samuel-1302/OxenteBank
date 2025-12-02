// ===================================
// DASHBOARD - GRÁFICO
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    const chartCanvas = document.getElementById('accountChart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        
        // Dados do gráfico
        const data = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Movimentação da Conta',
                data: [12000, 15000, 13500, 17000, 16500, 19000, 21000, 18500, 22000, 24000, 23500, 25000],
                borderColor: '#7BA05B',
                backgroundColor: 'rgba(123, 160, 91, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#7BA05B',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 2
            }]
        };
        
        // Configurações do gráfico
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#2C5F7C',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        borderColor: '#7BA05B',
                        borderWidth: 2,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'R$ ' + context.parsed.y.toLocaleString('pt-BR');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return 'R$ ' + (value / 1000) + 'k';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };
        
        // Criar gráfico
        new Chart(ctx, config);
    }
    
});
