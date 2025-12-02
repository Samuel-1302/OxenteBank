// ============================================
// GARANTIAS - OXENTEBANK
// ============================================

// Dados mockados de garantias
let garantias = [
    {
        id: 1,
        protocolo: 'GAR-2025-001',
        tipo: 'imovel',
        descricao: 'Fazenda São João - 50 hectares',
        valorEstimado: 850000,
        dataCadastro: '2025-01-15',
        validade: '2027-01-15',
        status: 'ativa',
        observacoes: 'Imóvel rural localizado em região produtiva',
        documentos: ['escritura.pdf', 'registro.pdf']
    },
    {
        id: 2,
        protocolo: 'GAR-2025-002',
        tipo: 'maquinario',
        descricao: 'Trator John Deere 7230R - Ano 2022',
        valorEstimado: 450000,
        dataCadastro: '2025-02-10',
        validade: '2026-02-10',
        status: 'ativa',
        observacoes: 'Equipamento em excelente estado de conservação',
        documentos: ['nota_fiscal.pdf', 'laudo_avaliacao.pdf']
    },
    {
        id: 3,
        protocolo: 'GAR-2025-003',
        tipo: 'estoque',
        descricao: 'Estoque de Soja - 500 toneladas',
        valorEstimado: 320000,
        dataCadastro: '2025-03-05',
        validade: '2025-12-31',
        status: 'pendente',
        observacoes: 'Aguardando vistoria técnica',
        documentos: ['nota_estoque.pdf']
    },
    {
        id: 4,
        protocolo: 'GAR-2024-045',
        tipo: 'titulo',
        descricao: 'Título de Propriedade - Lote 15 Quadra A',
        valorEstimado: 680000,
        dataCadastro: '2024-11-20',
        validade: '2025-11-20',
        status: 'ativa',
        observacoes: 'Documentação regularizada',
        documentos: ['titulo.pdf']
    },
    {
        id: 5,
        protocolo: 'GAR-2024-038',
        tipo: 'aval',
        descricao: 'Aval Solidário - José Silva',
        valorEstimado: 150000,
        dataCadastro: '2024-10-15',
        validade: '2025-04-15',
        status: 'ativa',
        observacoes: 'Avalista com renda comprovada',
        documentos: ['termo_aval.pdf', 'comprovante_renda.pdf']
    },
    {
        id: 6,
        protocolo: 'GAR-2024-012',
        tipo: 'imovel',
        descricao: 'Galpão Comercial - 500m²',
        valorEstimado: 380000,
        dataCadastro: '2024-06-10',
        validade: '2025-01-10',
        status: 'vencida',
        observacoes: 'Necessária renovação da garantia',
        documentos: ['escritura_galpao.pdf']
    }
];

// Variáveis de controle
let paginaAtual = 1;
const itensPorPagina = 5;
let garantiasFiltradas = [...garantias];
let arquivosSelecionados = [];

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    verificarAutenticacao();
    
    // Atualizar resumo
    atualizarResumo();
    
    // Renderizar tabela
    renderizarTabela();
    
    // Event listeners
    document.getElementById('buscaGarantia').addEventListener('input', aplicarFiltros);
    document.getElementById('uploadArea').addEventListener('click', function() {
        document.getElementById('documentosGarantia').click();
    });
    document.getElementById('documentosGarantia').addEventListener('change', handleFileSelect);
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modalNovaGarantia = document.getElementById('modalNovaGarantia');
        const modalDetalhes = document.getElementById('modalDetalhes');
        
        if (event.target === modalNovaGarantia) {
            fecharModalNovaGarantia();
        }
        if (event.target === modalDetalhes) {
            fecharModalDetalhes();
        }
    });
    
    // Máscara de valor
    aplicarMascaraValor();
});

// ============================================
// AUTENTICAÇÃO
// ============================================
function verificarAutenticacao() {
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
}

function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = '../index.html';
    }
}

// ============================================
// RESUMO
// ============================================
function atualizarResumo() {
    const ativas = garantias.filter(g => g.status === 'ativa').length;
    const pendentes = garantias.filter(g => g.status === 'pendente').length;
    const valorTotal = garantias
        .filter(g => g.status === 'ativa')
        .reduce((sum, g) => sum + g.valorEstimado, 0);
    
    // Calcular vencendo em 30 dias
    const hoje = new Date();
    const trintaDias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000));
    const vencendo = garantias.filter(g => {
        const validade = new Date(g.validade);
        return validade >= hoje && validade <= trintaDias && g.status === 'ativa';
    }).length;
    
    document.getElementById('totalGarantiasAtivas').textContent = ativas;
    document.getElementById('valorTotalGarantias').textContent = formatarMoeda(valorTotal);
    document.getElementById('totalGarantiasPendentes').textContent = pendentes;
    document.getElementById('totalGarantiasVencendo').textContent = vencendo;
}

// ============================================
// RENDERIZAÇÃO DA TABELA
// ============================================
function renderizarTabela() {
    const tbody = document.getElementById('tabelaGarantiasBody');
    const mensagemVazia = document.getElementById('mensagemVazia');
    
    if (garantiasFiltradas.length === 0) {
        tbody.innerHTML = '';
        mensagemVazia.style.display = 'block';
        document.querySelector('.paginacao').style.display = 'none';
        return;
    }
    
    mensagemVazia.style.display = 'none';
    document.querySelector('.paginacao').style.display = 'flex';
    
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const garantiasPagina = garantiasFiltradas.slice(inicio, fim);
    
    tbody.innerHTML = garantiasPagina.map(garantia => `
        <tr>
            <td><strong>${garantia.protocolo}</strong></td>
            <td>
                <span class="badge-tipo ${garantia.tipo}">${formatarTipo(garantia.tipo)}</span>
            </td>
            <td>${garantia.descricao}</td>
            <td><strong>${formatarMoeda(garantia.valorEstimado)}</strong></td>
            <td>${formatarData(garantia.dataCadastro)}</td>
            <td>${formatarData(garantia.validade)}</td>
            <td>
                <span class="badge-status ${garantia.status}">
                    <i class="fas ${getStatusIcon(garantia.status)}"></i>
                    ${formatarStatus(garantia.status)}
                </span>
            </td>
            <td>
                <div class="acoes-buttons">
                    <button class="btn-acao visualizar" onclick="visualizarGarantia(${garantia.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-acao editar" onclick="editarGarantia(${garantia.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-acao excluir" onclick="excluirGarantia(${garantia.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    atualizarPaginacao();
}

// ============================================
// FILTROS
// ============================================
function aplicarFiltros() {
    const busca = document.getElementById('buscaGarantia').value.toLowerCase();
    const filtroTipo = document.getElementById('filtroTipo').value;
    const filtroStatus = document.getElementById('filtroStatus').value;
    
    garantiasFiltradas = garantias.filter(garantia => {
        const matchBusca = !busca || 
            garantia.descricao.toLowerCase().includes(busca) ||
            garantia.protocolo.toLowerCase().includes(busca) ||
            garantia.tipo.toLowerCase().includes(busca);
            
        const matchTipo = filtroTipo === 'todos' || garantia.tipo === filtroTipo;
        const matchStatus = filtroStatus === 'todos' || garantia.status === filtroStatus;
        
        return matchBusca && matchTipo && matchStatus;
    });
    
    paginaAtual = 1;
    renderizarTabela();
}

// ============================================
// PAGINAÇÃO
// ============================================
function atualizarPaginacao() {
    const totalPaginas = Math.ceil(garantiasFiltradas.length / itensPorPagina);
    document.getElementById('infoPagina').textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    
    document.getElementById('btnAnterior').disabled = paginaAtual === 1;
    document.getElementById('btnProxima').disabled = paginaAtual === totalPaginas;
}

function mudarPagina(direcao) {
    const totalPaginas = Math.ceil(garantiasFiltradas.length / itensPorPagina);
    
    if (direcao === 'anterior' && paginaAtual > 1) {
        paginaAtual--;
    } else if (direcao === 'proxima' && paginaAtual < totalPaginas) {
        paginaAtual++;
    }
    
    renderizarTabela();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// MODAL NOVA GARANTIA
// ============================================
function abrirModalNovaGarantia() {
    document.getElementById('modalNovaGarantia').classList.add('show');
    document.getElementById('formNovaGarantia').reset();
    arquivosSelecionados = [];
    document.getElementById('listaArquivos').innerHTML = '';
    
    // Definir data mínima de validade (hoje)
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('validadeGarantia').min = hoje;
}

function fecharModalNovaGarantia() {
    document.getElementById('modalNovaGarantia').classList.remove('show');
}

function salvarNovaGarantia(event) {
    event.preventDefault();
    
    const novaGarantia = {
        id: garantias.length + 1,
        protocolo: `GAR-2025-${String(garantias.length + 1).padStart(3, '0')}`,
        tipo: document.getElementById('tipoGarantia').value,
        descricao: document.getElementById('descricaoGarantia').value,
        valorEstimado: parseFloat(document.getElementById('valorGarantia').value.replace(/\./g, '').replace(',', '.')),
        dataCadastro: new Date().toISOString().split('T')[0],
        validade: document.getElementById('validadeGarantia').value,
        status: 'pendente',
        observacoes: document.getElementById('observacoesGarantia').value,
        documentos: arquivosSelecionados.map(f => f.name)
    };
    
    garantias.unshift(novaGarantia);
    garantiasFiltradas = [...garantias];
    
    atualizarResumo();
    renderizarTabela();
    fecharModalNovaGarantia();
    
    mostrarNotificacao('Garantia cadastrada com sucesso!', 'success');
}

// ============================================
// UPLOAD DE ARQUIVOS
// ============================================
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    arquivosSelecionados = [...arquivosSelecionados, ...files];
    renderizarListaArquivos();
}

function renderizarListaArquivos() {
    const listaArquivos = document.getElementById('listaArquivos');
    
    listaArquivos.innerHTML = arquivosSelecionados.map((arquivo, index) => `
        <div class="arquivo-item">
            <div class="arquivo-info">
                <i class="fas fa-file-pdf"></i>
                <span class="arquivo-nome">${arquivo.name}</span>
            </div>
            <button type="button" class="btn-remover-arquivo" onclick="removerArquivo(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removerArquivo(index) {
    arquivosSelecionados.splice(index, 1);
    renderizarListaArquivos();
}

// ============================================
// AÇÕES DA TABELA
// ============================================
function visualizarGarantia(id) {
    const garantia = garantias.find(g => g.id === id);
    if (!garantia) return;
    
    const detalhesContent = document.getElementById('detalhesContent');
    detalhesContent.innerHTML = `
        <div class="detalhes-grid">
            <div class="detalhe-item">
                <div class="detalhe-label">Protocolo</div>
                <div class="detalhe-valor">${garantia.protocolo}</div>
            </div>
            
            <div class="detalhe-item">
                <div class="detalhe-label">Status</div>
                <div class="detalhe-valor">
                    <span class="badge-status ${garantia.status}">
                        <i class="fas ${getStatusIcon(garantia.status)}"></i>
                        ${formatarStatus(garantia.status)}
                    </span>
                </div>
            </div>
            
            <div class="detalhe-item">
                <div class="detalhe-label">Tipo</div>
                <div class="detalhe-valor">
                    <span class="badge-tipo ${garantia.tipo}">${formatarTipo(garantia.tipo)}</span>
                </div>
            </div>
            
            <div class="detalhe-item">
                <div class="detalhe-label">Valor Estimado</div>
                <div class="detalhe-valor">${formatarMoeda(garantia.valorEstimado)}</div>
            </div>
            
            <div class="detalhe-item full-width">
                <div class="detalhe-label">Descrição</div>
                <div class="detalhe-valor">${garantia.descricao}</div>
            </div>
            
            <div class="detalhe-item">
                <div class="detalhe-label">Data de Cadastro</div>
                <div class="detalhe-valor">${formatarData(garantia.dataCadastro)}</div>
            </div>
            
            <div class="detalhe-item">
                <div class="detalhe-label">Validade</div>
                <div class="detalhe-valor">${formatarData(garantia.validade)}</div>
            </div>
            
            <div class="detalhe-item full-width">
                <div class="detalhe-label">Observações</div>
                <div class="detalhe-valor">${garantia.observacoes || 'Nenhuma observação registrada'}</div>
            </div>
            
            <div class="detalhe-item full-width">
                <div class="detalhe-label">Documentos Anexados</div>
                <div class="detalhe-valor">
                    ${garantia.documentos.map(doc => `
                        <div style="margin-top: 0.5rem;">
                            <i class="fas fa-file-pdf" style="color: #DC2626;"></i> ${doc}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalDetalhes').classList.add('show');
}

function fecharModalDetalhes() {
    document.getElementById('modalDetalhes').classList.remove('show');
}

function editarGarantia(id) {
    mostrarNotificacao('Função de edição em desenvolvimento', 'info');
}

function excluirGarantia(id) {
    if (confirm('Tem certeza que deseja excluir esta garantia?')) {
        garantias = garantias.filter(g => g.id !== id);
        garantiasFiltradas = [...garantias];
        
        atualizarResumo();
        renderizarTabela();
        
        mostrarNotificacao('Garantia excluída com sucesso!', 'success');
    }
}

// ============================================
// UTILITÁRIOS
// ============================================
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

function formatarTipo(tipo) {
    const tipos = {
        'imovel': 'Imóvel Rural',
        'maquinario': 'Maquinário',
        'estoque': 'Estoque',
        'titulo': 'Título',
        'aval': 'Aval/Fiança'
    };
    return tipos[tipo] || tipo;
}

function formatarStatus(status) {
    const statusTexto = {
        'ativa': 'Ativa',
        'pendente': 'Pendente',
        'vencida': 'Vencida',
        'liberada': 'Liberada'
    };
    return statusTexto[status] || status;
}

function getStatusIcon(status) {
    const icons = {
        'ativa': 'fa-check-circle',
        'pendente': 'fa-clock',
        'vencida': 'fa-exclamation-circle',
        'liberada': 'fa-unlock'
    };
    return icons[status] || 'fa-question-circle';
}

function aplicarMascaraValor() {
    const inputValor = document.getElementById('valorGarantia');
    
    inputValor.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        valor = (valor / 100).toFixed(2);
        valor = valor.replace('.', ',');
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        e.target.value = valor;
    });
}

function mostrarNotificacao(mensagem, tipo) {
    // Implementação simples com alert
    // Em produção, usar biblioteca de notificação como Toastify
    const icones = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'warning': '⚠️'
    };
    
    alert(`${icones[tipo] || ''} ${mensagem}`);
}
