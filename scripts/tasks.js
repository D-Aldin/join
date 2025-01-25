const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

function taskTemplate(id, title, description, assigned, date, prio, category, subtask, status) {
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

async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

async function addTaskToFireBase(path = "", card) {
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

async function writeToBoard() {
  let x = await seeTasks("tasks");
  for (const key in x) {
    const element = x[key];
    if (element.status == "toDO") {
      toDo.innerHTML += renderCard(element.id, element.category, element.title, element.discription, element.subtask, element.assigned, element.prio);
    }
    if (element.status === "feedback") {
      feedback.innerHTML += renderCard(element.id, element.category, element.title, element.discription, element.subtask, element.assigned, element.prio);
    }
  }
}
