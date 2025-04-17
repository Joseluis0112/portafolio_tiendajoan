document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES GLOBALES Y SELECTORES ---
    const productListContainer = document.getElementById('product-list');
    const cartCountElement = document.getElementById('cart-count');
    const cartModalBody = document.getElementById('cartModalBody');
    const cartTotalElement = document.getElementById('cartTotal');
    const payButton = document.getElementById('payButton');
    const searchInput = document.getElementById('search-input');

    // Modales (instancias de Bootstrap)
    const quantityModal = new bootstrap.Modal(document.getElementById('quantityModal'));
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));

    // Elementos del Modal de Cantidad
    const quantityProductName = document.getElementById('quantityProductName');
    const quantityInput = document.getElementById('quantityInput');
    const confirmAddToCartButton = document.getElementById('confirmAddToCartButton');

    // Elementos del Modal de Pago
    const paymentForm = document.getElementById('paymentForm');
    const confirmPaymentButton = document.getElementById('confirmPaymentButton');
    const cancelPaymentButton = document.getElementById('cancelPaymentButton');
    const payerNameInput = document.getElementById('payerName');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');


    // --- DATOS ESTÁTICOS DE PRODUCTOS ---
    const basketballProducts = [
        {
            id: 1,
            title: "Nike LeBron XXI 'Akoya'",
            price: 200.00,
            category: "Nike Basketball",
            description: "Inspirado por su hija, Zhuri. Ofrece agilidad y explosividad sin exceso de peso.",
            image: "https://captaincreps.com/wp-content/uploads/2023/10/FV2345-500-PhotoRoom.png-PhotoRoom.png"
        },
        {
            id: 2,
            title: "Air Jordan XXXVIII 'Fundamentals'",
            price: 185.00,
            category: "Jordan",
            description: "Basado en los fundamentos. Amortiguación baja y parte superior segura.",
            image: "https://sneakerbardetroit.com/wp-content/uploads/2023/05/Air-Jordan-38-Fundamental-DZ3356-106.jpeg"
        },
        {
            id: 3,
            title: "Nike KD 16 'Aunt Pearl'",
            price: 160.00,
            category: "Nike Basketball",
            description: "Homenaje a la difunta tía de KD. Amortiguación Zoom Air reactiva.",
            image: "https://images.soleretriever.com/sb/products/nike-kd-16-tb-university-red-dz2927-600-1695337254938.png"
        },
         {
            id: 4,
            title: "Curry Flow 10 'Dub Nation'",
            price: 160.00,
            category: "Under Armour",
            description: "Tecnología UA Flow para agarre y reactividad. Celebra a los Warriors.",
            // URL de imagen pública - podría cambiar
            image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/091/445/509/original/3026624_101.png.png?action=crop&width=750"
        },
         {
            id: 5,
            title: "Nike Zoom Freak 5 'Keep It A Buck'",
            price: 140.00,
            category: "Nike Basketball",
            description: "Sistema de contención interno y amortiguación elástica para el estilo de Giannis.",
            image: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/019837-nike-zoom-freak-5-dx4985-100_2048x2048.png"
        },
        {
            id: 6,
            title: "Adidas Harden Vol. 7 'Royal Blue'",
            price: 160.00,
            category: "Adidas Basketball",
            description: "Diseño único con mediasuela BOOST para el estilo step-back de James Harden.",
            // URL de imagen pública - podría cambiar
            image: "https://4app.kicksonfire.com/kofapp/upload/events_master_images/thumb_ipad_adidas-harden-vol-7-crew-yellow.png"
        },
         {
            id: 7,
            title: "Jordan Tatum 1 'Pink Lemonade'",
            price: 120.00,
            category: "Jordan",
            description: "Calzado ligero de rendimiento para Jayson Tatum. Unidad Zoom Air sin jaula.",
            image: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/019204-jordan-tatum-1-dz3323-001_2048x2048.png"
        },
        {
            id: 8,
            title: "Nike Sabrina 1 'Ionic'",
            price: 130.00,
            category: "Nike Basketball",
            description: "Diseñado para Sabrina Ionescu. Combina espuma React y unidad Zoom Air.",
            image: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/020242-nike-sabrina-1-fq3381-002_2048x2048.png"
        },
        {
            id: 9,
            title: "Puma MB.03 'Toxic'",
            price: 125.00,
            category: "Puma Basketball",
            description: "Tercer signature shoe de LaMelo Ball. Diseño llamativo y tecnología NITRO foam.",
            // URL de imagen pública - podría cambiar
            image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1200,h_1200/global/378916/01/sv01/fnd/PNA/fmt/png/MB.03-Toxic-Basketball-Shoes"
        },
        {
            id: 10,
            title: "New Balance TWO WXY v4 'Dualism'",
            price: 120.00,
            category: "New Balance Basketball",
            description: "Para el jugador versátil. Combina FuelCell y Fresh Foam X para rendimiento.",
             // URL de imagen pública - podría cambiar
            image: "https://nb.scene7.com/is/image/NB/bb2wybk4_nb_02_i?$pdpflexf2$&q LT=80&fmt=webp&wid=440&hei=440"
        },

    ];

    // --- ESTADO DE LA APLICACIÓN ---
    let products = basketballProducts; // Usar los datos estáticos
    let cart = JSON.parse(localStorage.getItem('basketZoneCart')) || []; // Carrito desde localStorage
    let currentProductToAdd = null; // Producto temporal para modal de cantidad

    // --- FUNCIONES ---

    // [IMPORTANTE] Ya no necesitamos fetchProducts()

    // 1. Mostrar Productos en el DOM (Adaptado para nueva estructura de datos)
    function displayProducts(productsToDisplay) {
        productListContainer.innerHTML = ''; // Limpiar contenedor

        if (productsToDisplay.length === 0) {
            productListContainer.innerHTML = '<p class="text-muted text-center col-12">No se encontraron productos que coincidan con tu búsqueda.</p>';
            return;
        }

        productsToDisplay.forEach(product => {
            const card = `
                <div class="col">
                    <article class="card h-100">
                         <img src="${product.image}" class="card-img-top" alt="${product.title}" loading="lazy">
                        <div class="card-body">
                            <div> 
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-category">${product.category}</p>
                                <p class="card-description">${product.description || ''}</p>                            </div>
                            <div class="mt-auto">
                                <p class="card-price">$${product.price.toFixed(2)}</p>
                                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                                    <i class="fas fa-cart-plus"></i> Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            `;
            productListContainer.insertAdjacentHTML('beforeend', card);
        });

        // Añadir event listeners a los nuevos botones
        addEventListenersToButtons();
    }

    // Función auxiliar para añadir listeners (para limpieza)
    function addEventListenersToButtons() {
         document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            // Remover listener anterior si existe (previene duplicados en re-render)
            button.replaceWith(button.cloneNode(true));
        });
         // Volver a seleccionar y añadir listener
         document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', handleAddToCartClick);
         });
    }


    // 2. Manejar clic en "Añadir al carrito" (Sin cambios funcionales)
    function handleAddToCartClick(event) {
        const productId = parseInt(event.target.closest('.add-to-cart-btn').dataset.productId); // Más robusto
        currentProductToAdd = products.find(p => p.id === productId);
        if (currentProductToAdd) {
            quantityProductName.textContent = currentProductToAdd.title;
            quantityInput.value = 1; // Resetear cantidad a 1
            quantityModal.show();
        }
    }

    // 3. Confirmar añadir al carrito desde el modal de cantidad (Sin cambios funcionales)
    confirmAddToCartButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        if (currentProductToAdd && quantity > 0 && quantity <= 10) { // Añadir límite
            addItemToCart(currentProductToAdd, quantity);
            quantityModal.hide();
            currentProductToAdd = null; // Resetear producto temporal
        } else {
            alert("Por favor, ingresa una cantidad válida (entre 1 y 10).");
        }
    });

    // 4. Añadir o actualizar item en el carrito (Sin cambios funcionales)
    function addItemToCart(product, quantity) {
        const existingCartItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingCartItemIndex > -1) {
            cart[existingCartItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        saveCartToLocalStorage();
        updateCartIcon();
        updateCartModal();
        showToast(`${quantity} x ${product.title} añadido(s) al carrito!`);
    }

     // 5. Guardar carrito en LocalStorage (Sin cambios)
    function saveCartToLocalStorage() {
        localStorage.setItem('basketZoneCart', JSON.stringify(cart));
    }

    // 6. Actualizar el icono del contador del carrito (Sin cambios)
    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        payButton.disabled = totalItems === 0;
    }

    // 7. Actualizar el contenido del Modal del Carrito (Sin cambios funcionales)
    function updateCartModal() {
        if (cart.length === 0) {
            cartModalBody.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío. ¡Añade algunos tenis!</p>';
            cartTotalElement.textContent = '0.00';
            payButton.disabled = true;
            return;
        }

        let cartHTML = '<ul class="list-group list-group-flush">';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <img src="${item.image}" alt="${item.title}" width="50" class="me-3 rounded">
                    <div class="me-auto cart-item-details">
                        <span class="fw-bold">${item.title}</span><br>
                        <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</small>
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}" aria-label="Disminuir cantidad de ${item.title}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}" aria-label="Aumentar cantidad de ${item.title}">+</button>
                        <button class="btn btn-sm btn-outline-danger remove-item ms-2" data-index="${index}" aria-label="Eliminar ${item.title} del carrito"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </li>
            `;
        });

        cartHTML += '</ul>';
        cartModalBody.innerHTML = cartHTML;
        cartTotalElement.textContent = total.toFixed(2);
        payButton.disabled = false;

        addCartItemListeners();
    }

    // 8. Añadir listeners a botones +/-/remove dentro del modal del carrito (Sin cambios funcionales)
    function addCartItemListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
             // Limpiar listener viejo antes de añadir nuevo
            button.replaceWith(button.cloneNode(true));
        });
         document.querySelectorAll('.increase-quantity').forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
         document.querySelectorAll('.remove-item').forEach(button => {
             button.replaceWith(button.cloneNode(true));
        });

         // Añadir nuevos listeners
        document.querySelectorAll('.decrease-quantity').forEach(button => {
             button.addEventListener('click', (e) => changeItemQuantity(parseInt(e.target.dataset.index), -1));
        });
        document.querySelectorAll('.increase-quantity').forEach(button => {
             button.addEventListener('click', (e) => changeItemQuantity(parseInt(e.target.dataset.index), 1));
        });
        document.querySelectorAll('.remove-item').forEach(button => {
             button.addEventListener('click', (e) => removeItemFromCart(parseInt(e.target.closest('[data-index]').dataset.index)));
        });
    }

    // 9. Cambiar la cantidad de un item en el carrito (Sin cambios funcionales)
    function changeItemQuantity(index, change) {
        if (cart[index]) {
            const newQuantity = cart[index].quantity + change;
             if (newQuantity > 0 && newQuantity <= 10) { // Limitar cantidad
                 cart[index].quantity = newQuantity;
             } else if (newQuantity <= 0) {
                cart.splice(index, 1); // Eliminar si la cantidad es 0 o menos
             } else {
                 showToast(`Cantidad máxima por producto es 10.`, "warning");
                 return; // No hacer nada si se excede el límite superior
             }
            saveCartToLocalStorage();
            updateCartIcon();
            updateCartModal();
        }
    }

    // 10. Eliminar un item del carrito (Sin cambios funcionales)
    function removeItemFromCart(index) {
         if (cart[index]) {
            const removedItem = cart.splice(index, 1)[0];
            saveCartToLocalStorage();
            updateCartIcon();
            updateCartModal();
            showToast(`${removedItem.title} eliminado del carrito.`);
         }
    }

    // 11. Búsqueda dinámica (Adaptada para buscar también en 'category')
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) || // Busca también en la categoría (marca)
            product.description.toLowerCase().includes(searchTerm) // Busca también en descripción
        );
        displayProducts(filteredProducts);
    });

    // 12. Abrir modal de pago (Sin cambios)
     payButton.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.hide();
            paymentModal.show();
        }
    });

    // 13. Cancelar pago desde modal de pago (Sin cambios)
    cancelPaymentButton.addEventListener('click', () => {
        paymentModal.hide();
        cartModal.show();
    });

    // 14. Manejar envío del formulario de pago (Sin cambios funcionales)
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (paymentForm.checkValidity()) {
            console.log("Procesando pago simulado...");
            generatePDF();
            cart = [];
            saveCartToLocalStorage();
            updateCartIcon();
            updateCartModal();
            paymentModal.hide();
            paymentForm.reset();
            paymentForm.classList.remove('was-validated');
             payerNameInput.classList.remove('is-valid', 'is-invalid');
             cardNumberInput.classList.remove('is-valid', 'is-invalid');
             expiryDateInput.classList.remove('is-valid', 'is-invalid');
             cvvInput.classList.remove('is-valid', 'is-invalid');
            showToast("¡Pago simulado exitoso! Tu factura se está descargando.", "success");
        } else {
            paymentForm.classList.add('was-validated');
            console.log("Formulario de pago inválido.");
            showToast("Por favor, revisa los datos del formulario de pago.", "danger");
        }
    });


    // 15. Generar Factura PDF con jsPDF (Sin cambios funcionales)
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPosition = 20;
        const lineSpacing = 7;
        const pageMargin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("Factura - BasketZone 🏀", pageWidth / 2, yPosition, { align: 'center' });
        yPosition += lineSpacing * 2;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Cliente: ${payerNameInput.value || 'Cliente Invitado'}`, pageMargin, yPosition);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth - pageMargin, yPosition, { align: 'right' });
        yPosition += lineSpacing * 1.5;

        doc.setLineWidth(0.3);
        doc.line(pageMargin, yPosition, pageWidth - pageMargin, yPosition);
        yPosition += lineSpacing;

        doc.setFont('helvetica', 'bold');
        doc.text("Producto", pageMargin, yPosition);
        doc.text("Cant.", pageWidth - pageMargin - 50, yPosition, { align: 'right' });
        doc.text("Precio U.", pageWidth - pageMargin - 25, yPosition, { align: 'right' });
        doc.text("Subtotal", pageWidth - pageMargin, yPosition, { align: 'right' });
        yPosition += lineSpacing * 0.5;
        doc.setLineWidth(0.1);
        doc.line(pageMargin, yPosition, pageWidth - pageMargin, yPosition);
        yPosition += lineSpacing;

        let totalGeneral = 0;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        cart.forEach(item => {
            const subtotal = item.quantity * item.price;
            totalGeneral += subtotal;
            const maxTitleWidth = 100;
            const productTitleLines = doc.splitTextToSize(item.title, maxTitleWidth - pageMargin);
            doc.text(productTitleLines, pageMargin, yPosition);
            doc.text(item.quantity.toString(), pageWidth - pageMargin - 50, yPosition, { align: 'right' });
            doc.text(`$${item.price.toFixed(2)}`, pageWidth - pageMargin - 25, yPosition, { align: 'right' });
            doc.text(`$${subtotal.toFixed(2)}`, pageWidth - pageMargin, yPosition, { align: 'right' });
            yPosition += (productTitleLines.length * (lineSpacing * 0.7));
            yPosition += lineSpacing * 0.5;

             if (yPosition > doc.internal.pageSize.getHeight() - 30) {
                 doc.addPage();
                 yPosition = pageMargin;
             }
        });

         yPosition += lineSpacing * 0.5;
         doc.setLineWidth(0.3);
         doc.line(pageMargin + (pageWidth / 2) , yPosition, pageWidth - pageMargin, yPosition);
         yPosition += lineSpacing;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Total General:", pageWidth - pageMargin - 25, yPosition, { align: 'right' });
        doc.text(`$${totalGeneral.toFixed(2)}`, pageWidth - pageMargin, yPosition, { align: 'right' });
        yPosition += lineSpacing * 2;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text("¡Gracias por tu compra en ICE Basket!", pageWidth / 2, yPosition, { align: 'center' });

        doc.save('Factura-ICE Basket.pdf');
    }

    // 16. Mostrar notificaciones Toast (Sin cambios funcionales, pero asegúrate que el contenedor exista en HTML)
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container'); // Asume que existe en el HTML
         if (!toastContainer) {
             console.error('Toast container not found!');
             return;
         }

        const toastId = `toast-${Date.now()}`;
        const toastBgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-primary';

        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white ${toastBgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                       ${type === 'success' ? '<i class="fas fa-check-circle me-2"></i>' : type === 'danger' ? '<i class="fas fa-exclamation-triangle me-2"></i>' : type === 'warning' ? '<i class="fas fa-exclamation-circle me-2"></i>' : '<i class="fas fa-info-circle me-2"></i>'}
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3500 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // --- INICIALIZACIÓN ---
    displayProducts(products); // Mostrar productos estáticos al cargar
    updateCartIcon();          // Actualizar contador del carrito (desde localStorage)
    updateCartModal();         // Actualizar contenido del modal carrito (desde localStorage)

    // Listener para actualizar el modal del carrito cada vez que se abre
    document.getElementById('cartModal').addEventListener('show.bs.modal', updateCartModal);

}); 