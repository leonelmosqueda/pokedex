const URL_API = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_LIMIT_PER_PAGE = 10;

let actualPage;
let actualOffset;
let totalPages;
let numberOfPokemon;

async function setInitialSettings () {
    createList();
    actualOffset = 0;
    actualPage = 1;
    const listOfPokemon = await getListOfPokemon(actualOffset);
    numberOfPokemon = listOfPokemon.count
    totalPages = Math.ceil(numberOfPokemon / POKEMON_LIMIT_PER_PAGE);
    setListOfPokemon(listOfPokemon);
    configurePagination(listOfPokemon.previous, listOfPokemon.next)
}

function createList () {
    const $listItem = document.querySelector('#list-group');

    for(let i = 0; i < POKEMON_LIMIT_PER_PAGE; i++) {
        const newItem = document.createElement('a');
        newItem.href = '#';
        newItem.classList.add('list-group-item');
        newItem.classList.add('list-item-group-action');
        newItem.classList.add('p-2');
        newItem.classList.add('text-start');
        newItem.classList.add('text-capitalize');
        newItem.classList.add('fs-6');
        newItem.dataset.list = '';

        $listItem.appendChild(newItem);
    }
}

function getListOfPokemon(offset) {
    try {
        return fetch(`${URL_API}?limit=${POKEMON_LIMIT_PER_PAGE}&offset=${offset}`)
                    .then(response => response.json())
                    .then(data => data);
    } catch (error) {
        return console.error(error);
    }
}

function setListOfPokemon(listOfPokemon) {
    const $pokemon = document.querySelectorAll('[data-list]');

    $pokemon.forEach((pokemon, index) => {
        pokemon.dataset.name = listOfPokemon.results[index].name;
        pokemon.dataset.url = listOfPokemon.results[index].url;
        pokemon.textContent = pokemon.dataset.name;
    })
}

function configurePagination(prev, next) {
    const $pages = document.querySelectorAll('#pagination li a');

    if (prev === null) setInitialPagination($pages, prev, next);

}

function setInitialPagination(pages, prev, next) {
    const $previousPage = pages[0]
    const $actualPage = pages[1]
    const $secondPage = pages[2]
    const $thirdPage = pages[3]
    const $fourthPage = pages[4]
    const $fifthPage = pages[5]
    const $nextPage = pages[6]

    $previousPage.classList.add('disabled');
    $previousPage.dataset.endpoint = prev;

    $actualPage.textContent = '1';
    $actualPage.dataset.endpoint = `${URL_API}?limit=${POKEMON_LIMIT_PER_PAGE}&offset=0`
    $actualPage.classList.add('active');

    $secondPage.textContent = '2';
    $secondPage.dataset.endpoint = next;

    $thirdPage.textContent = '3';
    $thirdPage.dataset.endpoint = `${URL_API}?limit=${POKEMON_LIMIT_PER_PAGE}&offset=20`;

    $fourthPage.textContent = '4';
    $fourthPage.dataset.endpoint = `${URL_API}?limit=${POKEMON_LIMIT_PER_PAGE}&offset=30`;

    $fifthPage.textContent = '5';
    $fifthPage.dataset.endpoint = `${URL_API}?limit=${POKEMON_LIMIT_PER_PAGE}&offset=40`;

    $nextPage.dataset.endpoint = next;
}

setInitialSettings();

const $pokemonList = document.querySelectorAll('[data-list]')

$pokemonList.forEach(pokemon => pokemon.addEventListener('click', async e => {
    const pokemon = e.target;
    deletePokemonHighlighted($pokemonList)
    highlightPokemon(pokemon)
    const data = await fetchDataFromPokemon(pokemon.dataset.url);
    handleData(data);
}));

function deletePokemonHighlighted (list) {
    list.forEach(listItem => listItem.classList.remove('active'));
}

function highlightPokemon (pokemon) {
    pokemon.classList.add('active');
}

async function fetchDataFromPokemon(url) {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (e) {
        console.error(e);
    }
}

function handleData (data) {
    const image = data.sprites.other['official-artwork']['front_default']
    const height = `${data.height * 10} centimeters`;
    const weight = `${data.weight / 10} kilograms`;
    const types = data.types[1] ? `${data.types[0].type.name}, ${data.types[1].type.name}` : `${data.types[0].type.name}`
    const abilities = data.abilities[2] ? `${data.abilities[0].ability.name}, ${data.abilities[1].ability.name}, ${data.abilities[2].ability.name}`: (data.abilities[1] ? `${data.abilities[0].ability.name}, ${data.abilities[1].ability.name}` : `${data.abilities[0].ability.name}`);

    const $image = document.querySelector('[data-result="image"]');
    const $height = document.querySelector('[data-result="height"]');
    const $weight = document.querySelector('[data-result="weight"]');
    const $type = document.querySelector('[data-result="type"]');
    const $abilities = document.querySelector('[data-result="abilities"]');

    $image.classList.remove('rotate');
    $image.src = image;
    $height.textContent = height;
    $weight.textContent = weight;
    $type.textContent = types;
    $abilities.textContent = abilities;
}