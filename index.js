class Character {
    constructor(name, eyeColor, gender, height, mass, hairColor, skinColor, movies, pictureUrl) {
        this.name = name;
        this.eyeColor = eyeColor;
        this.gender = gender;
        this.height = Number(height);
        this.mass = Number(mass);
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.pictureUrl = pictureUrl;
    }

    async getFirstDate(instance, btn1, name) {
        let data = await getData(instance)
        btn1.innerHTML += `<strong>${name}</strong> first appeard in a Star Wars movie: ${data.release_date} <br>`
    }

    async getMovieTitles(instance, btn2, name) {
        let moviePromises = instance.map(async (array) => {
            let data = await getData(array);
            return data.title;
        });
    
        let movieTitles = await Promise.all(moviePromises);
        btn2.innerHTML += `<strong>${name}</strong> has appeared in the following movies: ${movieTitles.join(", ")} <br>`;
    }
    
    async compareHomePlanets(instance, btn3, name) {
        let data = await getData(`https://swapi.dev/api/people/${instance}`)
        let newData = await getData(data.homeworld)
        homeworlds.push(newData.name)
        btn3.innerHTML += `<strong>${name}s</strong> homeplanet is ${newData.name} <br>`

        if (homeworlds.length === 2) {
            const message = homeworlds[0] === homeworlds[1] ? "They come from the same homeworld!" : "They come from different homeworlds!";
            btn3.innerHTML += `${message}`;
        }
    }
    
    async vehiclesAndShips(instance, btn4, name) {
        let data = await getData(`https://swapi.dev/api/people/${instance}`);

        if (data.starships.length === 0) {
            btn4.innerHTML += `${name} does not own any starships`;
        } else {
            let highestCost = 0;
            let starshipName = "";

            await Promise.all(data.starships.map(async (starshipUrl) => {
                const starshipData = await getData(starshipUrl);

                if (starshipData.cost_in_credits !== "unknown") {
                    let cost = parseInt(starshipData.cost_in_credits, 10);
                    highestCost < cost ? (starshipName = starshipData.name) && (highestCost = cost) : null;
                } else if (starshipData.cost_in_credits == "unknown") {
                    highestCost = "unknown"
                    starshipName = starshipData.name
                }
            }));

            btn4.innerHTML += `${name}s most expensive starship is ${starshipName} with the cost of ${highestCost}<br>`
        }
    }
} 

let selectedChar1;
let selectedChar2;
let instances = [];
let homeworlds = [];


 
const getData = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json;
};


const createList = (array, groupNumber) => {
    const select = document.getElementById(groupNumber);
    
    array.forEach((person) => {
        const option = document.createElement("option");
        option.innerHTML = `${person.name}`;

        let urlParts = person.url.split("/");
        const id = parseInt(urlParts[urlParts.length - 2], 10);
        option.value = id;

        select.append(option);
    })

    choosenChar(select);
};


const choosenChar = async (select) => {
    select.addEventListener("change", async function() {
        const selectedOption = select.options[select.selectedIndex].value;

        select.id == 1 ? (selectedChar1 = selectedOption) : (selectedChar2 = selectedOption);
        
        selectedChar1?.length === 1 && selectedChar2?.length === 1 ? checkChar() : null;
    });
};


const checkChar = () => {
    let h2 = document.getElementById("h2");

    if (selectedChar1 === selectedChar2) {
        h2.innerHTML = `You must choose two different characters`
        h2.classList.remove("hidden")
    } else {
        renderCharacters(selectedChar1, 1)
        renderCharacters(selectedChar2, 2) 
        h2.innerHTML = `Your chosen characters are`
    };
};


const renderCharacters = async (character, divNumber) => {
    let div = document.querySelector(`.div-${divNumber}`);
    div.innerHTML= "";

    let divElements = document.querySelectorAll(".char-div");
    divElements.forEach((divElement) => {
        divElement.classList.remove("hidden");
    });

    const info = await getData(`https://swapi.dev/api/people/${character}`);
    let newChar = new Character(info.name, info.eye_color, info.gender, info.height, info.mass, info.hair_color, info.skin_color, info.films, info.pictureUrl);
    let imageUrl = `assets/images/${character}.png`;

    divNumber === 1 ? (instances[0] = newChar) : divNumber === 2 ? (instances[1] = newChar) : null;

    let p = document.createElement("p");
    p.innerHTML = `<img src="${imageUrl}" alt="${info.name} picture"><br>
    <strong>${info.name}</strong><br>
    <strong>Eyecolor:</strong> ${info.eyeColor}<br>
    <strong>Gender:</strong> ${info.gender}<br>
    <strong>Height:</strong> ${info.height}<br>
    <strong>Weight:</strong> ${info.mass}<br>
    <strong>Haircolor:</strong> ${info.hair_color}<br> 
    <strong>Skincolor:</strong> ${info.skin_color}<br>
    <strong>Number of movie apperances: </strong>${info.films.length}`;

    div.append(p)

    instances.length === 2 ? compareChar(instances) : null;
}


const compareChar = (instances) => {
    let compareDiv = document.querySelector(".compare-div")

    const heightmessage = instances[1].height > instances[0].height ? `${instances[1].name} is taller` 
    : instances[1].height < instances[0].height ? `${instances[0].name} is taller` : `${instances[0].name} and ${instances[1].name} have the same height`;

    const weightmessage = instances[1].mass > instances[0].mass ? `${instances[1].name} weights more` 
    : instances[1].mass < instances[0].mass ? `${instances[0].name} weights more` : `${instances[0].name} and ${instances[1].name} weights the same`;
    
    const moviesmessage = instances[1].movies.length > instances[0].movies.length ? `${instances[1].name} has appeard in more movies` 
    : instances[1].movies.length < instances[0].movies.length ? `${instances[0].name} has appeard in more movies` 
    : `${instances[0].name} and ${instances[1].name} has appeard in the same amounts of movies`;

    const gendermessage = instances[1].gender === instances[0].gender ? `${instances[1].name} and ${instances[0].name} has same genders` : `${instances[0].name}and ${instances[1].name} have different genders`;
    const hairmessage = instances[1].hairColor === instances[0].hairColor ? `${instances[0].name} and ${instances[1].name} has the same haircolor` : `${instances[0].name} and ${instances[1].name} have different haircolors`;
    const skinmessage = instances[1].skinColor === instances[0].skinColor ? `${instances[0].name} and ${instances[1].name} has the same skincolor` : `${instances[0].name} and ${instances[1].name} have different skincolors`;

    compareDiv.innerHTML = `${heightmessage}<br>${weightmessage}<br>${moviesmessage}<br>${gendermessage}<br>${hairmessage}<br>${skinmessage}`;

    compareButtons(instances)
}

compareButtons = (instances) => {
    let buttons = document.querySelectorAll(".button");
        buttons.forEach((button) => {
        button.classList.remove("hidden");
    });

    let btn1 = document.querySelector(".button-1")
    let btn2 = document.querySelector(".button-2")
    let btn3 = document.querySelector(".button-3")
    let btn4 = document.querySelector(".button-4")


    btn1.addEventListener("click", function() {
        btn1.innerHTML = ``;
        instances[0].getFirstDate(instances[0].movies[0], btn1, instances[0].name)
        instances[1].getFirstDate(instances[1].movies[0], btn1, instances[1].name)
    })

    btn2.addEventListener("click", function() {
        btn2.innerHTML = ``;
        instances[0].getMovieTitles(instances[0].movies, btn2, instances[0].name)
        instances[1].getMovieTitles(instances[1].movies, btn2, instances[1].name)
    })

    btn3.addEventListener("click", function() {
        btn3.innerHTML = ``;
        instances[0].compareHomePlanets(selectedChar1, btn3, instances[0].name)
        instances[1].compareHomePlanets(selectedChar2, btn3, instances[1].name)  
    })

    btn4.addEventListener("click", function() {
        btn4.innerHTML = ``;
        instances[0].vehiclesAndShips(selectedChar1, btn4, instances[0].name)
        instances[1].vehiclesAndShips(selectedChar2, btn4, instances[1].name)  
    })
}


const getAllCharacters = async () => {
    const group1 = [];
    const group2 = [];

    const characters = await getData('https://swapi.dev/api/people/');
    characters.results.forEach((person) => {
        group1.push(person);
        group2.push(person);
    })

    createList(group1, 1);
    createList(group2, 2);
};

getAllCharacters()