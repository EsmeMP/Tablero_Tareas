// -> activa el modo estricto de js para evitar errores comunes y ser mas seguro
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// funcion para construir un item de la lista usando el titule y tipo, regresa el li construido
const buildItem =({title, type}) => {
    const lista = document.createElement('li');

    lista.className = 'card';
    lista.dataset.tag = type;
    lista.innerHTML = `
        <div class="card__head">
          <span class="badge">${type}</span>
          <div class="actions">
            <button class="icon" type="button" data-action="fav" aria-label="Marcar favorito">☆</button>
            <button class="icon" type="button" data-action="done" aria-label="Marcar completada">✓</button>
            <button class="icon danger" type="button" data-action="del" aria-label="Eliminar">🗑</button>
          </div>
        </div>
        <p class="card__title">${title || 'Sin titulo :3'}</p>
    `;

    return lista;
}

const form = $('#formTarea');
const listaTareas = $('#listaTareas');

// evento que obtiene el titulo y tipo de la tarea, construye el item y lo agrega a la lista
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('#inputTitulo').value;
    const type = $('#selectTag').value;
    
    const buildedList = buildItem({title, type});
    listaTareas.appendChild(buildedList);
    form.reset();

    // aplicar filtros si se agrega tarea
    applyFilters();
});


const listaArticulos = $('#listaTareas');

// evento que escucha los clicks en la lista de articulos, 
listaArticulos.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    
    const action = btn.dataset.action;
    const card = btn.closest('.card');
    // si el click es en un boton de eliminar, obtiene la tarjeta mas cercana y la elimina
    if(action === 'del') {
        card.remove();
    }else if(action === 'fav'){
        // si elclick es fav, marca las estrellas
        btn.classList.toggle('active');{
            if(btn.classList.contains('active')){
                btn.textContent = '★';
            }else{
                btn.textContent = '☆';
            }
        }
        // marca como completada con la clase
    }else if(action === 'done'){
        card.classList.toggle('is-done');
    }

});

// // evento que escucha los clicks, muestra las tarjetas correspondientes al filtro
const filtros = $('.filters');
// // console.log(filtros);
const filterState = {
    text: '',
    tag: 'all'
    // fav: false
};

// texto funcion que compara el texto del titulo de la tarjeta con el texto del filtro, regresa true si coincide
const matchText = (card, text) => {
    const title = card.querySelector('.card__title')?.textContent.toLowerCase() ?? '';
    return title.includes(text);
};


const matchTag = (card, tag) => {
    if(tag === 'all') return true;

    if(tag === 'fav'){
        const favBtn = card.querySelector('[data-action="fav"]');
        return favBtn.classList.contains('active');
    }
    const cardTag = card.dataset.tag.toLowerCase();
    return cardTag === tag;
};

const applyFilters = () => {
    const cards = $$('.card', listaTareas);
    let visible = false;

    cards.forEach(card => {
        const okText = filterState.text === '' || matchText(card, filterState.text);
        const okTag = matchTag(card, filterState.tag);
        const show = okText && okTag;

        card.classList.toggle('is-hidden', !show);
        if(show) visible = true;
    });
    $('#emptyState').classList.toggle('is-hidden', visible);
};

// evento de los botones de filtro
filtros.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if(!btn) return;

    filterState.tag = btn.dataset.filter;
    $$('.filters button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    applyFilters();

});

// evento del input de filtro por texto
const inputBuscar = $('#inputBuscar');
inputBuscar.addEventListener('input', () => {
    filterState.text = inputBuscar.value.trim().toLowerCase();
    applyFilters();
});

