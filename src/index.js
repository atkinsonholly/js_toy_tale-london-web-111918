const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector('#toy-collection')
let addToy = false

const baseURL = `http://localhost:3000/toys`
document.addEventListener('DOMContentLoaded', init)

function init(event) {
  getToys();
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
      toyForm.addEventListener("submit", renderNewToys)
  } else {
    toyForm.style.display = 'none'
  }
})

document.addEventListener('click', addLike)

function renderNewToys(event){
  const nameInput = document.querySelector(".add-toy-form").querySelectorAll("input")[0].value;
  const imageInput = document.querySelector(".add-toy-form").querySelectorAll("input")[1].value;
  addToy = false;
  saveNewToy(nameInput, imageInput).then(getToys)
}

function renderEachToy(toysArray) {
  toysArray.forEach(toy => insertToy(toy))
}

function insertToy(toy){
  toyCollection.innerHTML += `
  <div id=${toy.id} class="card">
  <h2> ${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  <p>${toy.likes}</p>
  <button class="like-btn">Like<3</button>
  </div>
  `
}

function addLike(event){
  if (event.target.className === "like-btn"){
    //find toy in db
    const toyID = event.target.parentElement.id;
    //find toy in db
    let toyPromise = findToy(toyID)
    toyPromise.then(increaseLikeByOne)
  }
}

function increaseLikeByOne(toy){
  toy.likes += 1
  editToy(toy.id, toy.likes).then(getToys)
}

/*
---------------------
  API section
---------------------
*/
function findToy(id) {
  return fetch(baseURL + `/${id}`)
  .then(response => response.json())
}

function getToys() {
  toyCollection.innerHTML = "";
  fetch(baseURL)
  .then(response => response.json())
  .then(toys => renderEachToy(toys))
}

function saveNewToy(nameInput, imageInput){
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: nameInput,
      image: imageInput,
      likes: 0
    })
  }
  return fetch(baseURL, options)
  .then(response => response.json())
}

function editToy(id, likesInput){
  const options = {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: likesInput
    })
  }
  return fetch(baseURL + `/${id}`, options)
  .then(response => response.json())
}
