let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem dos bolos
cakeJson.map((item, index)=>{
    let cakeItem = c('.models .cake-item').cloneNode(true);
    
    cakeItem.setAttribute('data-key', index);
    cakeItem.querySelector('.cake-item--img img').src = item.img;
    cakeItem.querySelector('.cake-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    cakeItem.querySelector('.cake-item--name').innerHTML = item.name;
    cakeItem.querySelector('.cake-item--desc').innerHTML = item.description;
    
    cakeItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.cake-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.cakeBig img').src = cakeJson[key].img;
        c('.cakeInfo h1').innerHTML = cakeJson[key].name;
        c('.cakeInfo--desc').innerHTML = cakeJson[key].description;
        c('.cakeInfo--actualPrice').innerHTML = `R$ ${cakeJson[key].price.toFixed(2)}`;
        c('.cakeInfo--size.selected').classList.remove('selected');
        cs('.cakeInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = cakeJson[key].sizes[sizeIndex];
        });

        c('.cakeInfo--qt').innerHTML = modalQt;

        c('.cakeWindowArea').style.opacity = 0;
        c('.cakeWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.cakeWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.cake-area').append( cakeItem );
});

// Eventos do MODAL
function closeModal() {
    c('.cakeWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.cakeWindowArea').style.display = 'none';
    }, 500);
}
cs('.cakeInfo--cancelButton, .cakeInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.cakeInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.cakeInfo--qt').innerHTML = modalQt;
    }
});
c('.cakeInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.cakeInfo--qt').innerHTML = modalQt;
});
cs('.cakeInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.cakeInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.cakeInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.cakeInfo--size.selected').getAttribute('data-key'));
    let identifier = cakeJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier);
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:cakeJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let cakeItem = cakeJson.find((item)=>item.id == cart[i].id);
            subtotal += cakeItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let cakeSizeName;
            switch(cart[i].size) {
                case 0:
                    cakeSizeName = 'P';
                    break;
                case 1:
                    cakeSizeName = 'M';
                    break;
                case 2:
                    cakeSizeName = 'G';
                    break;
            }
            let cakeName = `${cakeItem.name} (${cakeSizeName})`;

            cartItem.querySelector('img').src = cakeItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = cakeName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}