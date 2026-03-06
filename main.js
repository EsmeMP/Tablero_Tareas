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
        const btnLike = btn;
        btn.classList.toggle('active');{
            if(!btnLike) return;
            if(btnLike.classList.contains('active')){
                btnLike.textContent = '★';
            }else{
                btnLike.textContent = '☆';
            }
        }
    }
});
