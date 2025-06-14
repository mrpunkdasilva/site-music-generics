/**
 * The Generics - Modern Website JavaScript
 * 
 * Este arquivo contém todas as funcionalidades JavaScript para o site moderno da banda The Generics.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    const skipLink = document.querySelector('.skip-link');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-price');
    const purchaseButton = document.querySelector('.btn-purchase');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-card');

    // Navegação móvel
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const expanded = mainNav.classList.contains('active');
            mobileNavToggle.setAttribute('aria-expanded', expanded);
        });
    }

    // Header com scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Skip link para acessibilidade
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
    }

    // Funcionalidade do carrinho
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCartClicked);
        });
    }

    // Botão de compra
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseClicked);
    }

    // Filtro de categorias na loja
    if (categoryButtons) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove a classe active de todos os botões
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona a classe active ao botão clicado
                this.classList.add('active');
                
                // Filtra os produtos
                const category = this.getAttribute('data-category');
                
                products.forEach(product => {
                    if (category === 'all') {
                        product.style.display = 'block';
                    } else if (product.getAttribute('data-category') === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Atualiza o carrinho quando a quantidade é alterada
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('cart-quantity-input')) {
            const input = event.target;
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1;
            }
            updateCartTotal();
        }
    });

    // Remove item do carrinho
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('btn-danger')) {
            const button = event.target;
            button.closest('tr').remove();
            updateCartTotal();
        }
    });

    // Funções do carrinho
    function addToCartClicked(event) {
        const button = event.target;
        const product = button.closest('.product-card');
        const title = product.querySelector('.product-title').innerText;
        const price = product.querySelector('.product-price').innerText;
        const imageSrc = product.querySelector('.product-image').src;
        
        addItemToCart(title, price, imageSrc);
        updateCartTotal();
    }

    function addItemToCart(title, price, imageSrc) {
        const cartRow = document.createElement('tr');
        cartRow.classList.add('cart-row');
        
        // Verifica se o item já está no carrinho
        const cartItemNames = document.querySelectorAll('.cart-item-title');
        for (let i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText === title) {
                alert('Este item já está no carrinho!');
                return;
            }
        }
        
        const cartRowContents = `
            <td class="cart-item" data-label="Produto">
                <img src="${imageSrc}" alt="${title}" class="cart-item-image">
                <span class="cart-item-title">${title}</span>
            </td>
            <td class="cart-price" data-label="Preço">${price}</td>
            <td class="cart-quantity" data-label="Quantidade">
                <input class="cart-quantity-input" type="number" value="1" min="1" aria-label="Quantidade de ${title}">
                <button class="btn btn-danger btn-sm" type="button" aria-label="Remover ${title} do carrinho">Remover</button>
            </td>
        `;
        
        cartRow.innerHTML = cartRowContents;
        cartItems.appendChild(cartRow);
        updateCartTotal();
    }

    function updateCartTotal() {
        if (!cartItems) return;
        
        const cartRows = cartItems.querySelectorAll('.cart-row');
        let total = 0;
        
        cartRows.forEach(row => {
            const priceElement = row.querySelector('.cart-price');
            const quantityElement = row.querySelector('.cart-quantity-input');
            
            const price = parseFloat(priceElement.innerText.replace('$', ''));
            const quantity = quantityElement.value;
            
            total += price * quantity;
        });
        
        total = Math.round(total * 100) / 100;
        cartTotal.innerText = '$' + total.toFixed(2);
    }

    function purchaseClicked() {
        alert('Obrigado pela sua compra!');
        
        // Limpa o carrinho
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        
        updateCartTotal();
    }

    // Animações ao scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executa uma vez ao carregar a página

    // Reprodução de áudio
    const playButton = document.querySelector('.btn-play');
    const audioPlayer = document.getElementById('audio-player');
    
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.innerHTML = '&#10074;&#10074;'; // Símbolo de pausa
                playButton.setAttribute('aria-label', 'Pausar música');
            } else {
                audioPlayer.pause();
                playButton.innerHTML = '&#9658;'; // Símbolo de play
                playButton.setAttribute('aria-label', 'Reproduzir música');
            }
        });
    }
});/**
 * The Generics - Modern Website JavaScript
 * 
 * Este arquivo contém todas as funcionalidades JavaScript para o site moderno da banda The Generics.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.main-header');
    const skipLink = document.querySelector('.skip-link');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-price');
    const purchaseButton = document.querySelector('.btn-purchase');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product-card');

    // Navegação móvel
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const expanded = mainNav.classList.contains('active');
            mobileNavToggle.setAttribute('aria-expanded', expanded);
        });
    }

    // Header com scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Skip link para acessibilidade
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
    }

    // Funcionalidade do carrinho
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCartClicked);
        });
    }

    // Botão de compra
    if (purchaseButton) {
        purchaseButton.addEventListener('click', purchaseClicked);
    }

    // Filtro de categorias na loja
    if (categoryButtons) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove a classe active de todos os botões
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona a classe active ao botão clicado
                this.classList.add('active');
                
                // Filtra os produtos
                const category = this.getAttribute('data-category');
                
                products.forEach(product => {
                    if (category === 'all') {
                        product.style.display = 'block';
                    } else if (product.getAttribute('data-category') === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Atualiza o carrinho quando a quantidade é alterada
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('cart-quantity-input')) {
            const input = event.target;
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1;
            }
            updateCartTotal();
        }
    });

    // Remove item do carrinho
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('btn-danger')) {
            const button = event.target;
            button.closest('tr').remove();
            updateCartTotal();
        }
    });

    // Funções do carrinho
    function addToCartClicked(event) {
        const button = event.target;
        const product = button.closest('.product-card');
        const title = product.querySelector('.product-title').innerText;
        const price = product.querySelector('.product-price').innerText;
        const imageSrc = product.querySelector('.product-image').src;
        
        addItemToCart(title, price, imageSrc);
        updateCartTotal();
    }

    function addItemToCart(title, price, imageSrc) {
        const cartRow = document.createElement('tr');
        cartRow.classList.add('cart-row');
        
        // Verifica se o item já está no carrinho
        const cartItemNames = document.querySelectorAll('.cart-item-title');
        for (let i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText === title) {
                alert('Este item já está no carrinho!');
                return;
            }
        }
        
        const cartRowContents = `
            <td class="cart-item" data-label="Produto">
                <img src="${imageSrc}" alt="${title}" class="cart-item-image">
                <span class="cart-item-title">${title}</span>
            </td>
            <td class="cart-price" data-label="Preço">${price}</td>
            <td class="cart-quantity" data-label="Quantidade">
                <input class="cart-quantity-input" type="number" value="1" min="1" aria-label="Quantidade de ${title}">
                <button class="btn btn-danger btn-sm" type="button" aria-label="Remover ${title} do carrinho">Remover</button>
            </td>
        `;
        
        cartRow.innerHTML = cartRowContents;
        cartItems.appendChild(cartRow);
        updateCartTotal();
    }

    function updateCartTotal() {
        if (!cartItems) return;
        
        const cartRows = cartItems.querySelectorAll('.cart-row');
        let total = 0;
        
        cartRows.forEach(row => {
            const priceElement = row.querySelector('.cart-price');
            const quantityElement = row.querySelector('.cart-quantity-input');
            
            const price = parseFloat(priceElement.innerText.replace('$', ''));
            const quantity = quantityElement.value;
            
            total += price * quantity;
        });
        
        total = Math.round(total * 100) / 100;
        cartTotal.innerText = '$' + total.toFixed(2);
    }

    function purchaseClicked() {
        alert('Obrigado pela sua compra!');
        
        // Limpa o carrinho
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        
        updateCartTotal();
    }

    // Animações ao scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executa uma vez ao carregar a página

    // Reprodução de áudio
    const playButton = document.querySelector('.btn-play');
    const audioPlayer = document.getElementById('audio-player');
    
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.innerHTML = '&#10074;&#10074;'; // Símbolo de pausa
                playButton.setAttribute('aria-label', 'Pausar música');
            } else {
                audioPlayer.pause();
                playButton.innerHTML = '&#9658;'; // Símbolo de play
                playButton.setAttribute('aria-label', 'Reproduzir música');
            }
        });
    }
});