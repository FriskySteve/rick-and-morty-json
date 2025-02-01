let apiName = "";
let apiStatus = "alive";
let apiURL = `https://rickandmortyapi.com/api/character/?status=${apiStatus}&name=${apiName}`;
let next = "";
let prev = false;
const charactersContainer = document.querySelector("#characters-container");

function addMessage() {
  clearCharacterCards();
  charactersContainer.textContent =
    "Nie znaleziono postaci spełniających kryteria wyszukiwania.";
}

function setApiName() {
  const apiNameInput = document.querySelector("#api-name");
  apiNameInput.addEventListener("input", () => {
    apiName = apiNameInput.value.trim();
    const updatedUrl = `https://rickandmortyapi.com/api/character/?status=${apiStatus}&name=${apiName}`;
    updateCharacterCards(updatedUrl);
  });
}

function navigate() {
  const btnPrev = document.querySelector("#btn-prev");
  const btnNext = document.querySelector("#btn-next");

  btnPrev.addEventListener("click", () => {
    if (prev) {
      updateCharacterCards(prev);
    } else {
      addMessage();
    }
  });
  btnNext.addEventListener("click", () => {
    if (next) {
      updateCharacterCards(next);
    } else {
      addMessage();
    }
  });
}

function clearCharacterCards() {
  charactersContainer.innerHTML = "";
}

async function updateCharacterCards(url) {
  clearCharacterCards();

  const characterData = await fetchRickAndMortyCharacters(url);
  characterData.forEach((character) => {
    createCharacterCards(character);
  });
}

function setApiStatus() {
  const radioButtons = document.querySelectorAll('input[name="status"]');
  radioButtons.forEach((button) => {
    button.addEventListener("change", () => {
      if (button.checked) {
        apiStatus = button.value;
        const updatedUrl = `https://rickandmortyapi.com/api/character/?status=${apiStatus}&name=${apiName}`;
        updateCharacterCards(updatedUrl);
      }
    });
  });
}

async function fetchRickAndMortyCharacters(url) {
  try {
    const response = await fetch(url);
    const character = await response.json();
    next = character.info.next;
    prev = character.info.prev;
    return character.results;
  } catch (error) {
    console.log(error);
    addMessage();
  }
}

function createCharacterCards(characterData) {
  const container = document.createElement("div");
  const characterImg = document.createElement("img");
  const characterName = document.createElement("h1");
  const characterStatus = document.createElement("p");
  const characterSpecies = document.createElement("p");

  characterImg.src = characterData.image;
  characterName.textContent = characterData.name;
  characterStatus.textContent = `Status: ${characterData.status}`;
  characterSpecies.textContent = `Gatunek: ${characterData.species}`;
  container.classList.add("sheet");

  container.append(
    characterImg,
    characterName,
    characterStatus,
    characterSpecies
  );
  charactersContainer.appendChild(container);
}

async function main() {
  const characterData = await fetchRickAndMortyCharacters(apiURL);
  characterData.forEach((character) => {
    createCharacterCards(character);
  });
  setApiStatus();
  setApiName();
  navigate();
}

main();
