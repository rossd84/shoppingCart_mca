let items = document.querySelectorAll('.item');
let currencyRate = 1;
let currencySymbol = '&dollar;';
let cart = [];

if(localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    updateItems();
    updateTotal();
}

for(let i = 0; i < items.length; i++) {
    const item = items[i];
    item.addEventListener('click', function () {
        addToCart(item);
    });
}

let changeCurrency = document.getElementById('currency');
changeCurrency.addEventListener('change', updateCurrencyRate);

let viewCart = document.getElementById('viewCart');
viewCart.addEventListener('click', showCart);

function addToCart(item) {
    let found = false;
        let name = item.innerText;
        let price = Number(item.getAttribute('data-price'));

        for(let j = 0; j < cart.length; j++) {
            const cartItem = cart[j];

            if (cartItem.name == name) {
                found = true;
                cart[j].qty++;
            }
        }
        if (!found) {
            cart.push({name, price, qty: 1});
        }

        updateItems();
        updateTotal();
        updateStorage();
}

function updateStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCart() {
    let cartList = document.getElementById('cart');
    cartList.innerText = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        let el = document.createElement('li');
        el.innerHTML = `${item.name} @${item.price} Qty:${item.qty} <span class='remove' data-idx="${i}">&times;</span>`;
        cartList.appendChild(el);        
    }
    //listen for delete
    let remove = document.querySelectorAll('.remove');
    for (let j = 0; j < remove.length; j++) {
        const item = remove[j];
        item.addEventListener('click', function () {
            removeItem(item);
        });
    }
}

function removeItem(item) {
    let idx = Number(item.getAttribute('data-idx'));
    cart.splice(idx, 1);
    showCart();
    updateTotal();
    updateItems();
    updateStorage();
}

function updateCurrencyRate() {
    let country = this.value;

    switch(country) {
        case 'us':
            currencyRate = 1;
            currencySymbol = '&dollar;';
            break;
        case "uk":
            currencyRate = 1.5;
            currencySymbol = '&pound;';
            break;
        default:
            break;
    }
    updateTotal();
}

function updateItems() {
    let numberItems = document.getElementById('numberItems');
    numberItems.innerText = cart.length;
}

function updateTotal() {
    let cartTotal = document.getElementById('cartTotal');
    let total = 0;

    for(let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price * item.qty;
    }

    total += total * .07;
    total /= currencyRate;
    cartTotal.innerHTML = `${currencySymbol}${total.toFixed(2)}`;
}