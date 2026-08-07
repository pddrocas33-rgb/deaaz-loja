/* ===================================================
   DEAAZ - LÓGICA PRINCIPAL DA LOJA (app.js)
   =================================================== */

// Base de Dados Local de Teste
const PRODUTOS = [
  { id: 1, nome: "Auscultadores Bluetooth Sem Fios Pro", preco: 49.99, categoria: "tecnologia", letra: "A", icone: "fa-headphones" },
  { id: 2, nome: "Bicicleta Urbana Alumínio", preco: 299.00, categoria: "desporto", letra: "B", icone: "fa-bicycle" },
  { id: 3, nome: "Cafeteira Expresso Programável", preco: 85.50, categoria: "casa", letra: "C", icone: "fa-mug-hot" },
  { id: 4, nome: "Garrafa Térmica Inox 1L", preco: 19.95, categoria: "casa", letra: "G", icone: "fa-bottle-water" },
  { id: 5, nome: "Lâmpada LED Smart RGB WiFi", preco: 12.50, categoria: "tecnologia", letra: "L", icone: "fa-lightbulb" },
  { id: 6, nome: "Smartwatch Fitness Tracker GPS", preco: 89.90, categoria: "desporto", letra: "S", icone: "fa-stopwatch" }
];

// --- 1. GESTÃO DO CARRINHO (LocalStorage) ---

function obterCarrinho() {
  try {
    const carrinho = localStorage.getItem('deaaz_carrinho');
    const dados = carrinho ? JSON.parse(carrinho) : [];
    return Array.isArray(dados) ? dados : [];
  } catch (e) {
    console.error("Erro ao ler carrinho:", e);
    return [];
  }
}

function guardarCarrinho(carrinho) {
  localStorage.setItem('deaaz_carrinho', JSON.stringify(carrinho));
  atualizarBadgeCarrinho();
}

function adicionarAoCarrinho(idProduto, quantidade = 1) {
  const carrinho = obterCarrinho();
  const idNum = parseInt(idProduto);
  const produtoExistente = carrinho.find(item => item.id === idNum);

  if (produtoExistente) {
    produtoExistente.quantidade += quantidade;
  } else {
    carrinho.push({ id: idNum, quantidade: quantidade });
  }

  guardarCarrinho(carrinho);
  alert("Produto adicionado ao carrinho!");
  
  // Se estiver na página do carrinho, recarrega a lista dinamicamente
  if (typeof carregarPaginaCarrinho === 'function') {
    carregarPaginaCarrinho();
  }
}

function atualizarBadgeCarrinho() {
  const carrinho = obterCarrinho();
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalItens;
  });
}

// --- 2. LÓGICA DA PÁGINA CATÁLOGO (produtos.html) ---

function carregarProdutosCatalogo() {
  const grid = document.getElementById('products-grid');
  if (!grid) return; // Não estamos na página de produtos

  const urlParams = new URLSearchParams(window.location.search);
  const letraFiltro = urlParams.get('letra');
  const catFiltro = urlParams.get('cat');

  let produtosFiltrados = PRODUTOS;

  // Destacar a categoria ativa no menu lateral esquerdo
  marcarCategoriaAtiva(catFiltro);

  // 1. Filtrar por Letra
  if (letraFiltro) {
    produtosFiltrados = produtosFiltrados.filter(p => p.letra.toUpperCase() === letraFiltro.toUpperCase());
    document.getElementById('page-title').textContent = `Produtos com a letra "${letraFiltro.toUpperCase()}"`;
  } 
  // 2. Filtrar por Categoria
  else if (catFiltro) {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria.toLowerCase() === catFiltro.toLowerCase());
    const nomeCategoriaFormatado = catFiltro.charAt(0).toUpperCase() + catFiltro.slice(1);
    document.getElementById('page-title').textContent = `Categoria: ${nomeCategoriaFormatado}`;
  } else {
    document.getElementById('page-title').textContent = 'Todos os Produtos';
  }

  const countElem = document.getElementById('product-count');
  if (countElem) {
    countElem.textContent = `A mostrar ${produtosFiltrados.length} produto(s)`;
  }

  grid.innerHTML = '';

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Nenhum produto encontrado nesta seleção.</p>';
    return;
  }

  produtosFiltrados.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">
        <span class="letter-tag">${produto.letra}</span>
        <i class="fa-solid ${produto.icone}"></i>
      </div>
      <div class="product-info">
        <span class="product-category">${produto.categoria}</span>
        <a href="produto.html?id=${produto.id}" class="product-title">${produto.nome}</a>
        <div class="product-price">${produto.preco.toFixed(2)}€</div>
        <button class="btn-add-cart" onclick="adicionarAoCarrinho(${produto.id})">
          <i class="fa-solid fa-cart-plus"></i> Adicionar
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function marcarCategoriaAtiva(catAtual) {
  const linksCategorias = document.querySelectorAll('.filters-sidebar .filter-list a');

  linksCategorias.forEach(link => {
    link.style.color = 'var(--text-muted)';
    link.style.fontWeight = '400';
    link.style.borderLeft = 'none';
    link.style.paddingLeft = '0px';

    const href = link.getAttribute('href');

    if (!catAtual && (href === 'produtos.html' || href === 'produtos.html?')) {
      aplicarEstiloAtivo(link);
    } 
    else if (catAtual && href.toLowerCase().includes(`cat=${catAtual.toLowerCase()}`)) {
      aplicarEstiloAtivo(link);
    }
  });
}

function aplicarEstiloAtivo(elemento) {
  elemento.style.color = 'var(--primary)';
  elemento.style.fontWeight = '700';
  elemento.style.borderLeft = '3px solid var(--primary)';
  elemento.style.paddingLeft = '8px';
}

// --- 3. LÓGICA DA PÁGINA DE DETALHE (produto.html) ---

function carregarDetalheProduto() {
  const titleElem = document.querySelector('.product-title-main');
  if (!titleElem) return; // Não estamos na página produto.html

  const urlParams = new URLSearchParams(window.location.search);
  const idProduto = parseInt(urlParams.get('id')) || 1;

  const produto = PRODUTOS.find(p => p.id === idProduto);

  if (produto) {
    document.querySelector('.product-title-main').textContent = produto.nome;
    document.querySelector('.product-price-large').textContent = `${produto.preco.toFixed(2)}€`;
    document.querySelector('.category-tag').textContent = produto.categoria;
    document.querySelector('.letter-badge').textContent = produto.letra;
    
    const iconElem = document.querySelector('.main-image');
    if (iconElem) {
      iconElem.className = `fa-solid ${produto.icone} main-image`;
    }

    const btnBuy = document.querySelector('.btn-buy-now');
    if (btnBuy) {
      btnBuy.onclick = function() {
        const qtd = parseInt(document.getElementById('quantity').value) || 1;
        adicionarAoCarrinho(produto.id, qtd);
      };
    }
  }
}

// --- 4. LÓGICA DA PÁGINA DO CARRINHO (carrinho.html) ---

function carregarPaginaCarrinho() {
  const containerItens = document.querySelector('.cart-items-card');
  if (!containerItens) return; // Não estamos na página carrinho.html

  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    containerItens.innerHTML = '<p style="text-align: center; padding: 30px; color: var(--text-muted); font-weight: 600;">O teu carrinho está atualmente vazio.</p>';
    
    const subtotalElem = document.querySelector('.summary-row span:last-child');
    const totalElem = document.querySelector('.summary-row.total span:last-child');
    if (subtotalElem) subtotalElem.textContent = '0.00€';
    if (totalElem) totalElem.textContent = '0.00€';
    return;
  }

  containerItens.innerHTML = '';
  let subtotal = 0;

  carrinho.forEach(item => {
    const produto = PRODUTOS.find(p => p.id === item.id);
    if (!produto) return;

    const totalItem = produto.preco * item.quantidade;
    subtotal += totalItem;

    const divItem = document.createElement('div');
    divItem.className = 'cart-item';
    divItem.innerHTML = `
      <div class="cart-item-img">
        <span class="letter-tag-small">${produto.letra}</span>
        <i class="fa-solid ${produto.icone}"></i>
      </div>
      <div class="cart-item-details">
        <span class="cart-item-category">${produto.categoria}</span>
        <a href="produto.html?id=${produto.id}" class="cart-item-title">${produto.nome}</a>
        <div class="cart-item-price">${produto.preco.toFixed(2)}€</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button class="qty-btn" onclick="alterarQtd(${produto.id}, -1)">-</button>
          <input type="text" class="qty-input" value="${item.quantidade}" readonly>
          <button class="qty-btn" onclick="alterarQtd(${produto.id}, 1)">+</button>
        </div>
        <button class="btn-remove" onclick="removerDoCarrinho(${produto.id})">
          <i class="fa-solid fa-trash-can"></i> Remover
        </button>
      </div>
    `;
    containerItens.appendChild(divItem);
  });

  const resumoLinhas = document.querySelectorAll('.summary-row span:last-child');
  if (resumoLinhas.length >= 1) {
    resumoLinhas[0].textContent = `${subtotal.toFixed(2)}€`;
  }
  const totalFinalElem = document.querySelector('.summary-row.total span:last-child');
  if (totalFinalElem) {
    totalFinalElem.textContent = `${subtotal.toFixed(2)}€`;
  }
}

function alterarQtd(idProduto, delta) {
  let carrinho = obterCarrinho();
  const item = carrinho.find(i => i.id === idProduto);

  if (item) {
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(i => i.id !== idProduto);
    }
    guardarCarrinho(carrinho);
    carregarPaginaCarrinho();
  }
}

function removerDoCarrinho(idProduto) {
  let carrinho = obterCarrinho();
  carrinho = carrinho.filter(i => i.id !== idProduto);
  guardarCarrinho(carrinho);
  carregarPaginaCarrinho();
}

// --- ARRANQUE AUTOMÁTICO ---
document.addEventListener('DOMContentLoaded', () => {
  atualizarBadgeCarrinho();
  carregarProdutosCatalogo();
  carregarDetalheProduto();
  carregarPaginaCarrinho();
});