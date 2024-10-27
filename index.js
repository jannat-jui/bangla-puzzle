document.addEventListener('DOMContentLoaded', function () {
    const shoppingImage = document.getElementById('shoppingImage');
    const sidebar = document.getElementById('sidebar');
    const productCardsContainer = document.getElementById('productCards');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartItemCountElementt = document.getElementById('cartItemCountt');
    const closeBtn = document.getElementById('closeBtn');

    shoppingImage.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    const cart = [];

    fetch('fakeapi.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const card = createProductCard(product);
                productCardsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

     
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card', 'relative', 'bg-slate-50', 'p-4', 'rounded-lg', 'shadow-md');
        card.dataset.productId = product.id;

        if (product.type === "NEW") {
            const typeBadge = document.createElement('span');
            typeBadge.textContent = product.type;
            typeBadge.classList.add('bg-orange-600', 'text-white', 'font-semibold', 'px-5', 'py-1', 'rounded-full', 'text-lg', 'absolute', '-top-2', '-left-6', 'badge');
            card.appendChild(typeBadge);
        }
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        image.classList.add('w-[22rem]', 'h-[16rem]', 'object-cover', 'mb-4', 'rounded-md');
        card.appendChild(image);

        const title = document.createElement('h2');
        title.textContent = product.title;
        title.classList.add('text-2xl', 'font-semibold');
        card.appendChild(title);

        const price = document.createElement('p');
        price.textContent = `${product.price.toFixed(2)}/each`;
        price.classList.add('text-gray-700', 'text-sm', 'mb-2', 'font-semibold');
        card.appendChild(price);

        const description = document.createElement('p');
        const truncatedDescription = product.description.slice(0, 160) + (product.description.length > 160 ? '...' : '');
        description.textContent = truncatedDescription;
        description.classList.add('text-gray-500', 'text-sm', 'mb-4', 'w-[22rem]', 'font-medium', 'text-justify');
        card.appendChild(description);

        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Order';
        addToCartBtn.classList.add('bg-orange-600', 'text-white', 'px-4', 'py-2', 'rounded', 'mr-2', 'font-semibold', 'w-full', 'text-xl');
        addToCartBtn.addEventListener('click', function () {
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                alert('Item is already in the cart!');
                return;
            }

            cart.push({
                id: product.id,
                image: product.image,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
            updateSidebar();

            addToCartBtn.disabled = true;
            addToCartBtn.classList.add('bg-gray-500');
            updateCartItemCount();
        });
        card.appendChild(addToCartBtn);

        const customizeBtn = document.createElement('button');
        customizeBtn.textContent = 'Customize';
        customizeBtn.classList.add('border-2', 'border-orange-600', 'text-orange-600', 'px-4', 'py-2', 'rounded', 'mr-2', 'font-semibold', 'w-full', 'text-xl', 'mt-4');
        card.appendChild(customizeBtn);

        return card;
    }

    function updateCartItemCount() {
        const cartItemCountElement = document.getElementById('cartItemCount');
        cartItemCountElement.textContent = cart.length.toString();
        cartItemCountElementt.textContent = `${cart.length.toString()} items`;
    }

    function updateSidebar() {
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItemsContainer.appendChild(cartItem);
        });

        const totalPriceElement = document.getElementById('totalPrice');
        const totalPrice = calculateTotalPrice();
        totalPriceElement.textContent = `${totalPrice.toFixed(2)} $`;

        sidebar.classList.remove('translate-x-full');
    }

    function calculateTotalPrice() {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('border-2', 'border-gray-300', 'p-4', 'mb-4', 'relative', 'rounded-xl', 'flex', 'items-center');

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<img src="./assets/delete.png" alt="delete Cart" class="h-6 w-6 mr-2">';
        deleteBtn.classList.add('absolute', 'top-2', 'right-1', 'text-red-500', 'cursor-pointer', 'bg-white', 'px-2', 'py-2', 'rounded-xl');
        deleteBtn.addEventListener('click', function () {
            const index = cart.findIndex(cartItem => cartItem.id === item.id);
            if (index !== -1) {
                cart.splice(index, 1);
                updateSidebar();
                restoreAddToCartButton(item.id);
                updateCartItemCount(); // Update cart item count here
            }
        });
        cartItem.appendChild(deleteBtn);

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.classList.add('w-20', 'h-32', 'rounded-md', 'mr-4');
        cartItem.appendChild(image);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('flex', 'flex-col', 'flex-grow');

        const name = document.createElement('span');
        name.textContent = item.name;
        name.classList.add('text-lg', 'font-semibold', 'mb-1');
        detailsContainer.appendChild(name);

        const price = document.createElement('span');
        price.textContent = `$${item.price.toFixed(2)}`;
        price.classList.add('text-white', 'font-medium', 'text-sm', 'mb-1');
        detailsContainer.appendChild(price);

        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('flex', 'items-center', 'mb-2');

        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.classList.add('bg-gray-200', 'text-gray-600', 'px-2', 'py-1', 'rounded-l', 'cursor-pointer');
        decreaseBtn.addEventListener('click', function () {
            if (item.quantity > 1) {
                item.quantity--;
                updateSidebar();
            }
        });
        quantityContainer.appendChild(decreaseBtn);

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = item.quantity;
        quantityDisplay.classList.add('bg-gray-100', 'px-4', 'py-1', 'text-gray-700', 'font-semibold');
        quantityContainer.appendChild(quantityDisplay);

        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.classList.add('bg-gray-200', 'text-gray-600', 'px-2', 'py-1', 'rounded-r', 'cursor-pointer');
        increaseBtn.addEventListener('click', function () {
            item.quantity++;
            updateSidebar();
        });
        quantityContainer.appendChild(increaseBtn);

        detailsContainer.appendChild(quantityContainer);
        cartItem.appendChild(detailsContainer);

        const totalPrice = document.createElement('span');
        totalPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        totalPrice.classList.add('text-white', 'text-lg', 'font-semibold', 'absolute', 'bottom-0', 'right-2');
        cartItem.appendChild(totalPrice);

        return cartItem;
    }

    function toggleSidebar() {
        sidebar.classList.toggle('translate-x-full');
    }

    function closeSidebar() {
        sidebar.classList.toggle('translate-x-full');
    }

    function restoreAddToCartButton(productId) {
        const productCard = Array.from(productCardsContainer.children).find(card => card.dataset.productId == productId);
        if (productCard) {
            const addToCartBtn = Array.from(productCard.getElementsByTagName('button')).find(btn => btn.textContent === 'Add to Order');
            if (addToCartBtn) {
                addToCartBtn.disabled = false;
                addToCartBtn.classList.remove('bg-gray-500');
            }
        }
    }
});
