const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE
const collection = document.querySelector('#toy-collection')

document.addEventListener('DOMContentLoaded', () => {

  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => {
        collection.append(renderToyCard(toy))
      })      
    })
  collection.addEventListener('click', (e) => {
    if (e.target.classList.contains("like-btn")){
      let toyCard = e.target.parentNode
      let likesElement = toyCard.children[2]
      let likes = parseInt(likesElement.innerText.split(' ')[0])
      updateLikes(e.target.dataset.id,likes)
      likesElement.innerText = `${++likes} likes`
    }
  })
  
})

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy

  let form = toyForm.querySelector('.add-toy-form')
  let inputName = Array.prototype.find.call(form.children, child => child.name === "name")
  let inputURL = Array.prototype.find.call(form.children, child => child.name === "image")
  let newToy = {
    likes: 0
  }
  
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    toyForm.addEventListener('submit', (e) => {
      e.preventDefault()
      newToy.name = inputName.value
      newToy.image = inputURL.value

      collection.append(renderToyCard(newToy))
      persistNewToy(newToy)
      toyForm.style.display = 'none'
    })
  } else {
    toyForm.style.display = 'none'
  }
  
})

// OR HERE!

updateLikes = (toyId, likes) => {
  let like 
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    body: JSON.stringify({
      likes: ++likes
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(json => console.log(json))
}

persistNewToy = toyObj => {
  fetch('http://localhost:3000/toys', {
    method: "POST",
    body: JSON.stringify(toyObj),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(json => console.log(json))
}

renderToyCard = toyObj => {
  let toyDiv = document.createElement('div')
  toyDiv.classList.add('card')
  toyDiv.innerHTML = `
    <h2>${toyObj.name}</h2>
    <img src='${toyObj.image}' class="toy-avatar">
    <p>${toyObj.likes} likes</p>
    <button data-id='${toyObj.id}' class='like-btn'>Like <3</button>
  `
  return toyDiv
}