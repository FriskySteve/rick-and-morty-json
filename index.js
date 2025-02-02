const charactersContainer = document.querySelector("#characters-container");
let page = 2;
let jsonUrl = `http://localhost:3000/characters?_page=${page}&_per_page=5`;
let jsonUrl2 = `http://localhost:3000/characters?_page=${page}&_per_page=5`;

function getNewCharacterData(id) {
  const characterName = document.querySelector("#character-name");
  const characterStatus = document.querySelector("#character-status");
  const characterSpecies = document.querySelector("#character-species");
  const addCharacterBtn = document.querySelector("#submit");

  addCharacterBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const character = {
        id: id + 1,
        name: characterName.value,
        status: characterStatus.value,
        species: characterSpecies.value,
        image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      };
      const response = await fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });
}

async function addCharacter(character, charactersData) {
  try {
    const characterData = {
      id: charactersData.items + 1,
      name: character.name,
      status: character.status,
      species: character.species,
      image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
    };
    const response = await fetch("http://localhost:3000/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    });
  } catch (error) {
    console.log(error);
  }
}

async function fetchCharacters(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Cos sie syplo.. ", error);
  }
}

function addMessage() {
  clearCharacterCards();
  charactersContainer.textContent =
    "Nie znaleziono postaci spełniających kryteria wyszukiwania.";
}

function navigate(data) {
  const btnPrev = document.querySelector("#btn-prev");
  const btnNext = document.querySelector("#btn-next");

  btnPrev.addEventListener("click", async () => {
    if (page >= data.first) {
      page -= 1;
      //   await main(`http://localhost:3000/characters?_page=${page}&_per_page=5`);
      await updateCharacterCards(
        `http://localhost:3000/characters?_page=${page}&_per_page=5`
      );
    } else {
      addMessage();
      page = 0;
    }
  });
  btnNext.addEventListener("click", async () => {
    if (page <= data.last) {
      page += 1;
      //   await main(`http://localhost:3000/characters?_page=${page}&_per_page=5`);
      await updateCharacterCards(
        `http://localhost:3000/characters?_page=${page}&_per_page=5`
      );
    } else {
      addMessage();
      page = data.last + 1;
    }
  });
}

function clearCharacterCards() {
  charactersContainer.innerHTML = "";
}

async function updateCharacterCards(url) {
  clearCharacterCards();

  const characterData = await fetchCharacters(url);
  characterData.data.forEach((character) => {
    createCharacterCards(character);
  });
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

async function main(url) {
  clearCharacterCards();
  const characterData = await fetchCharacters(url);
  characterData.data.forEach((character) => {
    createCharacterCards(character);
  });
  navigate(characterData);
  getNewCharacterData(characterData.items);
  //   console.log(characterData.items);
}

main(jsonUrl);
