//SCARICO DATI API -------------------------------------------

const url = 'https://striveschool-api.herokuapp.com/books';

fetch(url)

    .then((response) => response.json())

    .then((libreria) => {

        let colToInsert = document.getElementById('libreria');

        libreria.forEach(libro => {
            colToInsert.innerHTML +=
                `
            <div class="col" >
                <div class="card" id="${libro.asin}">
                    <img src="${libro.img}" alt="copertina" class="card-img-top mx-auto">
                        <div class="card-body">
                            <h5 class="card-title">${libro.title}</h5>
                            <p><span>$</span><span class="card-price">${libro.price}</span></p>
                            <p>${libro.category}</p>
                            <button type="button" onclick="carrello(this)" class="btn btn-sm border-0 btn-outline-secondary" >
                            <i class="bi bi-cart-plus"></i>
                            </button>
                            <button type="button" onclick="salta(this)" class="btn btn-secondary btn-sm">escludi</button>
                        </div>
                            <div class="card-footer text-body-secondary">asin : ${libro.asin}</div>
                </div>
            </div> `;

        })

    }) // .then => libreria
//------------------------------------------------------------    



//FUNZIONE SALTA ---------------------------------------------

function salta(btnEscludi) {

    //closest prende il genitore primo o il primo che corrisponde ai requisiti tra parentesi
    let cardCol = btnEscludi.closest('.col');
    cardCol.classList.add('d-none');


};
//------------------------------------------------------------




//FUNZIONE CARRELLO ------------------------------------------

function carrello(btnCarrello) {

    //dichiarazione costanti da card cliccata
    const idCard = btnCarrello.closest('.card').id;
    const cardBody = btnCarrello.closest('.card-body');
    const cardTitle = cardBody.querySelector('.card-title').textContent;
    const price = cardBody.querySelector('.card-price').textContent;

    // controllo se bottone non è evidenziato(btn-warning)
    if (btnCarrello.classList.contains('btn-outline-secondary')) {


        //evidenzia carrello nella card
        btnCarrello.classList.remove('btn-outline-secondary');
        btnCarrello.classList.add('btn-warning');

        // aggiunngo alla dropdown
        cartList = document.getElementById('dropdown-cart');
        cartList.innerHTML +=
            `
         <li id="li${idCard}" class="cart-item">
            <p class="dropdown-item">${cardTitle} 
                <span class="text-body-secondary">- $</span>
                <span class="text-body-secondary cart-price">${price}</span>
                <span class=" ms-auto"><i class="bi bi-trash3" onClick="removeItems(this)"></i></span>
            </p>
        </li>
         `;


    } else {

        //rimuove evidenzitura carrello nella card
        btnCarrello.classList.remove('btn-warning');
        btnCarrello.classList.add('btn-outline-secondary');

        //rimuove alla dropdown
        document.getElementById('li' + idCard).remove();

    }

    //contatore carrello     
    let inCart = document.querySelectorAll('.btn-warning');
    
    if (inCart.length === 0) {
        document.getElementById('li-nav-empty').classList.remove('d-none');
        document.getElementById('clear-cart').classList.add('d-none');
    } else {
        document.getElementById('li-nav-empty').classList.add('d-none');
        document.getElementById('clear-cart').classList.remove('d-none');
    }

    const dropdownCart = document.querySelector('.dropdown-toggle');
    dropdownCart.innerHTML = `${inCart.length} <i class="bi bi-cart3"></i>`
}
//------------------------------------------------------------



// FUNZIONE RICERCA -----------------------------------------

//evito che il form refresh ed esegue funzione del bottone
const form = document.getElementById('src-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    searchTitle();
  });

//funzione del bottone  
function searchTitle() {

    let titleSrc = document.getElementById('input-src').value.toLowerCase();
    let cards = document.querySelectorAll(".card");
    let arrCards = [];

    if (titleSrc.length >= 3) {

        cards.forEach(card => {
            const colCard = card.closest('.col');

            if(!colCard.classList.contains('.d-none')){
                colCard.classList.add('d-none');
            }

            const titleCard = card.querySelector('.card-title').textContent.toLowerCase();
            const idCard = card.id;
            
            //prendo i dati dalle card e le metto un oggetto e poi in un array
            const oggetto = {
                id:idCard,
                title:titleCard
            }

            arrCards.push(oggetto);
        });

        //ricerco tramite valori dell'array di oggetti
        let founted = arrCards.filter(card => card.title.includes(titleSrc));

        //utilizzo array di oggetti per mostrare i risultati
        founted.forEach(card => {
            const cardNode = document.getElementById(card.id);
            const colCard = cardNode.closest('.col');
            colCard.classList.remove('d-none');
            
        });

    }//if lenght>3

}

//ripristino card
const input = document.getElementById('input-src');

input.addEventListener('input', function(){

    const strInput = input.value;

    if(strInput.length<3){
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const colCard = card.closest('.col');
            colCard.classList.remove('d-none');            
        });
    }

});

//------------------------------------------------------------




// FUNZIONE PILISCI CARRELLO ----------------------------------

//svuota -----
function clearCart() {
    const cartList = document.querySelectorAll('.cart-item');

    cartList.forEach(item => {
        const id = item.id.replace('li', '');

        const card = document.getElementById(id);

        //prende il primo bottone che trova, quindi quello del carrello
        const btnCart = card.querySelector('button');

        btnCart.classList.remove('btn-warning');
        btnCart.classList.add('btn-outline-secondary');

        item.remove();
    });

    //resetto cart-menu
    const dropdownCart = document.querySelector('.dropdown-toggle');
    dropdownCart.innerHTML = `0 <i class="bi bi-cart3"></i>`;
    document.getElementById('li-nav-empty').classList.remove('d-none');
    document.getElementById('clear-cart').classList.add('d-none');

}

//elimina elemento -----
function removeItems(items) {
    const li = items.closest('li');
    const id = li.id.replace('li', '');
    const card = document.getElementById(id);
    const btnCart = card.querySelector('button');

    btnCart.classList.remove('btn-warning');
    btnCart.classList.add('btn-outline-secondary');

    li.remove();

    const cartItems = document.querySelectorAll('.cart-item');
    const dropdownCart = document.querySelector('.dropdown-toggle');


    if (cartItems.length === 0) {

        dropdownCart.innerHTML = `0 <i class="bi bi-cart3"></i>`;
        document.getElementById('li-nav-empty').classList.remove('d-none');
        document.getElementById('clear-cart').classList.add('d-none');
    } else {
        dropdownCart.innerHTML = `${cartItems.length} <i class="bi bi-cart3"></i>`;

    }
}
//------------------------------------------------------------