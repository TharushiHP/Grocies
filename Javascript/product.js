document.addEventListener("DOMContentLoaded", function() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const orderSummaryTable = document.querySelector('#order-summary tbody');
    const totalPriceElement = document.querySelector('#total-price');
    const buyNowButton = document.querySelector('#buy-now');
    const addToFavouritesButton = document.querySelector('#add-to-favourites');
    const applyFavouritesButton = document.querySelector('#apply-favourites');

    quantityInputs.forEach(input => {
        input.addEventListener('change', updateOrderSummary);
    });

    buyNowButton.addEventListener('click', buyNow);
    addToFavouritesButton.addEventListener('click', addToFavourites);
    applyFavouritesButton.addEventListener('click', applyFavourites);

    function updateOrderSummary() {
        let totalPrice = 0;
        orderSummaryTable.innerHTML = '';

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const itemRow = input.closest('.grid-item');
                const itemName = itemRow.querySelector('p').textContent;
                const itemPrice = parseFloat(itemRow.querySelectorAll('p')[2].textContent.replace('Rs.', ''));
                const itemTotalPrice = quantity * itemPrice;

                totalPrice += itemTotalPrice;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${itemName}</td>
                    <td>${quantity} </td>
                    <td>Rs.${itemTotalPrice.toFixed(2)}</td>
                `;
                orderSummaryTable.appendChild(row);
            }
        });

        totalPriceElement.textContent = `Rs.${totalPrice.toFixed(2)}`;
    }

    function buyNow() {
        saveOrderSummaryToLocalStorage();
        window.location.href = 'order.html'; // Redirect to the order page
    }

    function saveOrderSummaryToLocalStorage() {
        const orderItems = [];
        orderSummaryTable.querySelectorAll('tr').forEach(row => {
            const itemName = row.cells[0].textContent;
            const itemQuantity = row.cells[1].textContent;
            const itemPrice = row.cells[2].textContent;

            orderItems.push({ name: itemName, quantity: itemQuantity, price: itemPrice });
        });

        const totalPrice = totalPriceElement.textContent;
        localStorage.setItem('orderItems', JSON.stringify(orderItems));
        localStorage.setItem('totalPrice', totalPrice);
    }

    function addToFavourites() {
        const favourites = [];
        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const itemRow = input.closest('.grid-item');
                const itemName = itemRow.querySelector('p').textContent;
                favourites.push({ name: itemName, quantity: quantity });
            }
        });

        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert('Favourites saved successfully!');
    }

    function applyFavourites() {
        const favourites = JSON.parse(localStorage.getItem('favourites'));
        if (favourites) {
            favourites.forEach(favourite => {
                quantityInputs.forEach(input => {
                    const itemRow = input.closest('.grid-item');
                    const itemName = itemRow.querySelector('p').textContent;
                    if (itemName === favourite.name) {
                        input.value = favourite.quantity;
                    }
                });
            });

            updateOrderSummary();
        } else {
            alert('No favourites saved!');
        }
    }
});
