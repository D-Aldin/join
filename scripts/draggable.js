function renderCard(id, category, title, discription, subtasks, contact, prio) {
  return ` 
              <article id=${id} ondragstart="draggedElementID(event)" class="card" draggable="true">
                <div class="category">${category}</div>
                <div class="card_title">
                  <h4 id="title">${title}</h4>
                </div>
                <div class="discription">
                  <h5 id="discription">${discription}</h5>
                </div>
                <div class="progress_indicator">
                  <div class="progress_container">
                    <div class="progress_bar" style="width: 20%"></div>
                  </div>
                  <span id="subtasks">${subtasks}</span>
                </div>
                <div class="profile_prio_container">
                  <div class="profile">
                    <div class="circle">${contact}</div>
                    <div class="circle" style="transform: translateX(-50%); background-color: rgb(31, 215, 193)">DN</div>
                  </div>
                  <div class="prio">
                    <img src="./assets/icons/board/${prio}.svg" alt="" />
                  </div>
                </div>
              </article>
      `;
}

const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
let toDo = document.querySelector("#toDo");
let feedback = document.querySelector("#feedback");

function draggedElementID(event) {
  const elementID = event.target;
  console.log(elementID.id);
}

function dropPoint(event) {
  const category = event.target;
  console.log(category.id);
}

function allowDrop() {
  event.preventDefault();
}

async function seeTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

function task(id, title, description, assigned, date, prio, category, subtask, status) {
  return {
    [id]: {
      id: id,
      title: title,
      description: description,
      assigned: assigned,
      data: date,
      prio: prio,
      category: category,
      subtask: subtask,
      status: status,
    },
  };
}

let cardData = task(1, "HTML", "Project", "Aldin", "26/01/2025", "Urgent", "User Story", "Do this", "toDO");

async function addTask(path = "", card) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(card),
  });
  let responseToJSON = response.json();
  return responseToJSON;
}

// addTask("tasks", cardData);

async function manipulateTasks() {
  let x = await seeTasks("tasks");
  for (const key in x) {
    const element = x[key];
    // console.log(element);
    if (element.status === "feedback") {
      // let xxx = task(element.id, element.category, element.title, element.discription, element.subtask, element.assigned, element.prio);
      // console.log(xxx);

      feedback.innerHTML += renderCard(element.id, element.category, element.title, element.discription, element.subtask, element.assigned, element.prio);
    }
    if (element.status == "toDO") {
      toDo.innerHTML += renderCard(element.id, element.category, element.title, element.discription, element.subtask, element.assigned, element.prio);
    }
  }
}

manipulateTasks();
