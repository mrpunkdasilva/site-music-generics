// Espera até que o documento HTML esteja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões "ADD TO CART"
    const addToCartButtons = document.querySelectorAll('.shop-item-button');
    
    // Adiciona um event listener para cada botão
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartClicked);
    });

    // Seleciona todos os botões "Remove"
    const removeCartItemButtons = document.querySelectorAll('.btn-danger');
    
    // Adiciona um event listener para cada botão de remoção
    removeCartItemButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });

    // Seleciona todos os inputs de quantidade
    const quantityInputs = document.querySelectorAll('.cart-quantity-input');
    
    // Adiciona um event listener para cada input de quantidade
    quantityInputs.forEach(input => {
        input.addEventListener('change', quantityChanged);
    });

    // Adiciona um event listener para o botão de compra
    document.querySelector('.btn-purchase').addEventListener('click', purchaseClicked);
});

// Função executada quando o botão "Purchase" é clicado
function purchaseClicked() {
    alert('Obrigado pela sua compra!');
    
    // Limpa todos os itens do carrinho
    const cartItems = document.querySelector('.cart-items');
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    
    // Atualiza o total do carrinho
    updateCartTotal();
}

// Função executada quando um botão "Remove" é clicado
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

// Função executada quando a quantidade de um item é alterada
function quantityChanged(event) {
    const input = event.target;
    
    // Verifica se o valor é um número e é maior que 0
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    
    updateCartTotal();
}

// Função executada quando um botão "ADD TO CART" é clicado
function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement.parentElement;
    
    // Obtém as informações do item
    const title = shopItem.querySelector('.shop-item-title').innerText;
    const price = shopItem.querySelector('.shop-item-price').innerText;
    const imageSrc = shopItem.querySelector('.shop-item-image').src;
    
    // Adiciona o item ao carrinho
    addItemToCart(title, price, imageSrc);
    
    // Atualiza o total do carrinho
    updateCartTotal();
}

// Função para adicionar um item ao carrinho
function addItemToCart(title, price, imageSrc) {
    // Cria um novo elemento div para o item do carrinho
    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    
    // Seleciona o container de itens do carrinho
    const cartItems = document.querySelector('.cart-items');
    
    // Verifica se o item já está no carrinho
    const cartItemNames = cartItems.querySelectorAll('.cart-item-title');
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('Este item já está no carrinho!');
            return;
        }
    }
    
    // Define o HTML para o novo item do carrinho
    const cartRowContents = `
        <div class="cart-item cart-column">
            <img src="${imageSrc}" alt="${title}" width="100" height="100">
            <span class="cart-item-title">${title}</span>    
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>
    `;
    
    // Adiciona o HTML ao elemento do carrinho
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    
    // Adiciona event listeners para o novo item
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
}

// Função para atualizar o total do carrinho
function updateCartTotal() {
    // Seleciona o container de itens do carrinho
    const cartItemContainer = document.querySelector('.cart-items');
    const cartRows = cartItemContainer.querySelectorAll('.cart-row');
    
    let total = 0;
    
    // Calcula o total com base nos preços e quantidades
    cartRows.forEach(cartRow => {
        const priceElement = cartRow.querySelector('.cart-price');
        const quantityElement = cartRow.querySelector('.cart-quantity-input');
        
        // Remove o símbolo $ e converte para número
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        
        total += price * quantity;
    });
    
    // Arredonda para 2 casas decimais
    total = Math.round(total * 100) / 100;
    
    // Atualiza o elemento de total no HTML
    document.querySelector('.cart-total-price').innerText = '$' + total;
}