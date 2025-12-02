document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        const usuarioMock = {
            email: 'cooperativa@example.com',
            nomeCooperativa: 'Cooperativa Agrícola do Sertão',
            cnpj: '12.345.678/0001-90'
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioMock));
        document.getElementById('userName').textContent = usuarioMock.nomeCooperativa;
    } else {
        const usuario = JSON.parse(usuarioLogado);
        document.getElementById('userName').textContent = usuario.nomeCooperativa || 'Cooperativa';
    }

    // Definir datas padrão (últimos 4 meses)
    definirDatasIniciais();
    
    // Inicializar gráficos
    inicializarGraficos();
    
    // Event listeners para filtros
    document.getElementById('dataInicio').addEventListener('change', atualizarRelatorio);
    document.getElementById('dataFim').addEventListener('change', atualizarRelatorio);
    document.getElementById('tipoRelatorio').addEventListener('change', atualizarRelatorio);
});

function definirDatasIniciais() {
    const hoje = new Date();
    const dataFim = hoje.toISOString().split('T')[0];
    
    const dataInicio = new Date(hoje);
    dataInicio.setMonth(dataInicio.getMonth() - 4);
    const dataInicioStr = dataInicio.toISOString().split('T')[0];
    
    document.getElementById('dataInicio').value = dataInicioStr;
    document.getElementById('dataFim').value = dataFim;
}

function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = '../index.html';
    }
}

let chartReceitaMensal, chartCrescimento, chartDespesas;

// Cores exatas do protótipo
const cores = {
    verde1: '#5A7A43',
    verde2: '#6B8C52',
    verde3: '#7BA05B',
    verde4: '#8FB26C',
    azulEscuro: '#1E5A6E',
    despesa1: '#1E5A6E',
    despesa2: '#7BA05B',
    despesa3: '#9BC17D',
    despesa4: '#5A7A43'
};

function gerarDadosRelatorio() {
    // Obter mês atual para dados dinâmicos
    const mesesAtras = ['Jan', 'Fev', 'Mar', 'Abr'];
    
    return {
        receitaMensal: [
            { mes: mesesAtras[0], valor: 38500 },
            { mes: mesesAtras[1], valor: 41200 },
            { mes: mesesAtras[2], valor: 43800 },
            { mes: mesesAtras[3], valor: 45200 }
        ],
        crescimento: [
            { periodo: mesesAtras[0], percentual: 3.2 },
            { periodo: mesesAtras[1], percentual: 4.8 },
            { periodo: mesesAtras[2], percentual: 6.5 },
            { periodo: mesesAtras[3], percentual: 8.3 }
        ],
        despesas: [
            { categoria: 'Operacional', valor: 8500, cor: cores.despesa1 },
            { categoria: 'Fornecedores', valor: 6200, cor: cores.despesa2 },
            { categoria: 'Pessoal', valor: 3800, cor: cores.despesa3 },
            { categoria: 'Outros', valor: 2000, cor: cores.despesa4 }
        ]
    };
}

function inicializarGraficos() {
    // Verificar se Chart.js foi carregado
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado corretamente');
        alert('Erro ao carregar os gráficos. Por favor, recarregue a página.');
        return;
    }

    const dados = gerarDadosRelatorio();
    criarGraficoReceitaMensal(dados.receitaMensal);
    criarGraficoCrescimento(dados.crescimento);
    criarGraficoDespesas(dados.despesas);
    atualizarMetricas(dados);
}

function criarGraficoReceitaMensal(dados) {
    const ctx = document.getElementById('chartReceitaMensal');
    if (!ctx) return;
    
    if (chartReceitaMensal) {
        chartReceitaMensal.destroy();
    }
    
    chartReceitaMensal = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dados.map(d => d.mes),
            datasets: [{
                data: dados.map(d => d.valor),
                backgroundColor: [cores.verde1, cores.verde2, cores.verde3, cores.verde4],
                borderRadius: 6,
                barThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.parsed.y.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                        },
                        color: '#6B7280',
                        font: { size: 11 }
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    ticks: {
                        color: '#6B7280',
                        font: { size: 11 }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

function criarGraficoCrescimento(dados) {
    const ctx = document.getElementById('chartCrescimento');
    if (!ctx) return;
    
    if (chartCrescimento) {
        chartCrescimento.destroy();
    }
    
    chartCrescimento = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: dados.map(d => d.periodo),
            datasets: [{
                data: dados.map(d => d.percentual),
                borderColor: cores.azulEscuro,
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: cores.azulEscuro,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#6B7280',
                        font: { size: 11 },
                        stepSize: 2
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    ticks: {
                        color: '#6B7280',
                        font: { size: 11 }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

function criarGraficoDespesas(dados) {
    const ctx = document.getElementById('chartDespesas');
    if (!ctx) return;
    
    if (chartDespesas) {
        chartDespesas.destroy();
    }
    
    chartDespesas = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: dados.map(d => d.categoria),
            datasets: [{
                data: dados.map(d => d.valor),
                backgroundColor: dados.map(d => d.cor),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { 
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 11 },
                        color: '#6B7280'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentual = ((context.parsed / total) * 100).toFixed(1);
                            const valor = context.parsed.toLocaleString('pt-BR');
                            return context.label + ': R$ ' + valor + ' (' + percentual + '%)';
                        }
                    }
                }
            }
        }
    });
}

function atualizarMetricas(dados) {
    const ultimaReceita = dados.receitaMensal[dados.receitaMensal.length - 1].valor;
    const ultimoCrescimento = dados.crescimento[dados.crescimento.length - 1].percentual;
    const totalDespesas = dados.despesas.reduce((sum, item) => sum + item.valor, 0);
    
    document.getElementById('receitaMensal').textContent = 
        'R$ ' + ultimaReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    
    document.getElementById('crescimento').textContent = 
        '+' + ultimoCrescimento.toFixed(1).replace('.', ',') + '%';
    
    document.getElementById('despesasTotais').textContent = 
        'R$ ' + totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function atualizarRelatorio() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    
    // Validar datas
    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
        alert('A data inicial não pode ser maior que a data final');
        return;
    }
    
    const dados = gerarDadosRelatorio();
    criarGraficoReceitaMensal(dados.receitaMensal);
    criarGraficoCrescimento(dados.crescimento);
    criarGraficoDespesas(dados.despesas);
    atualizarMetricas(dados);
}

function exportarRelatorio() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    
    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione o período do relatório');
        return;
    }
    
    // Simulação de exportação
    const tipoNome = document.getElementById('tipoRelatorio').selectedOptions[0].text;
    
    alert(`📊 Exportando relatório:\n\n` +
          `Tipo: ${tipoNome}\n` +
          `Período: ${formatarData(dataInicio)} a ${formatarData(dataFim)}\n\n` +
          `✅ Em breve você receberá o arquivo por e-mail.`);
    
    // Aqui você implementaria a lógica real de exportação
    // Por exemplo: gerar PDF, CSV, etc.
}

function formatarData(data) {
    if (!data) return '';
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}