const charactersContainer = document.querySelector("#characters-container");
const jsonUrl = `http://localhost:3000/characters`;
const filter = {
  name: "",
  status: "Alive",
  page: 1,
  pagination: "?_limit=5",
  lastId: "",
};

async function fetchCharacters() {
  clearCharacterCards();
  try {
    const urlToFetch = `${jsonUrl}${filter.pagination}&name_like=${filter.name}&status=${filter.status}&_page=${filter.page}`;
    const response = await fetch(urlToFetch);
    const data = await response.json();
    if (data.length > 0) {
      data.forEach((character) => {
        createCharacterCards(character);
      });
    } else {
      addMessage();
    }
    const dataWithId = await fetch(jsonUrl);
    const id = await dataWithId.json();
    filter.lastId = id.length;

    return data;
  } catch (error) {
    console.log("Cos sie syplo.. ", error);
  }
}

function filtering() {
  const radioBtn = document.querySelectorAll('input[type="radio"]');
  const filterByName = document.querySelector("#api-name");

  filterByName.addEventListener("keyup", (event) => {
    filter.name = event.target.value;
    filter.page = 1;
    fetchCharacters();
  });
  radioBtn.forEach((button) => {
    button.addEventListener("change", (event) => {
      filter.status = event.target.value;
      filter.page = 1;
      fetchCharacters();
    });
  });
}

function getNewCharacterData() {
  const characterName = document.querySelector("#character-name");
  const characterStatus = document.querySelector("#character-status");
  const characterSpecies = document.querySelector("#character-species");
  const addCharacterBtn = document.querySelector("#submit");

  addCharacterBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const character = {
        id: filter.lastId + 1,
        name: characterName.value,
        status: characterStatus.value,
        species: characterSpecies.value,
        image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      };
      const response = await fetch(jsonUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });
    } catch (error) {
      console.log(error);
    }
  });
}

function addMessage() {
  clearCharacterCards();
  charactersContainer.textContent =
    "Nie znaleziono postaci spełniających kryteria wyszukiwania.";
}

function navigate() {
  const btnPrev = document.querySelector("#btn-prev");
  const btnNext = document.querySelector("#btn-next");

  btnPrev.addEventListener("click", () => {
    filter.page -= 1;
    if (filter.page < 1) {
      addMessage();
    } else {
      fetchCharacters();
    }
  });
  btnNext.addEventListener("click", () => {
    filter.page += 1;
    fetchCharacters();
  });
}

function clearCharacterCards() {
  charactersContainer.innerHTML = "";
}

function createCharacterCards(characterData) {
  const container = document.createElement("div");
  const characterImg = document.createElement("img");
  const characterName = document.createElement("h1");
  const characterStatus = document.createElement("p");
  const characterSpecies = document.createElement("p");
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "Usuń postać";
  deleteBtn.classList.add("delete");
  characterImg.src = characterData.image;
  characterName.textContent = characterData.name;
  characterStatus.textContent = `Status: ${characterData.status}`;
  characterSpecies.textContent = `Gatunek: ${characterData.species}`;
  container.classList.add("sheet");

  deleteBtn.addEventListener("click", async () => {
    const response = await fetch(`${jsonUrl}/${characterData.id}`, {
      method: "DELETE",
    });
    fetchCharacters();
  });

  container.append(
    characterImg,
    characterName,
    characterStatus,
    characterSpecies,
    deleteBtn
  );
  charactersContainer.appendChild(container);
}

function main() {
  fetchCharacters();
  filtering();
  navigate();
  getNewCharacterData();
}

main();
