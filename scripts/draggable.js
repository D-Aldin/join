// const FB_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
let cardID;

function draggedElementID(event) {
  event.target.addEventListener("dragstart", () => {
    event.target.classList.add("rotate");
  });

  event.target.addEventListener("dragend", () => {
    event.target.classList.remove("rotate");
  });
  event.dataTransfer.setData("text", event.target.id);
  cardID = event.target.id;
}

function dropPoint(event) {
  const category = event.target;
  let data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
  let newStatus = event.target.id;
  let statusUpdate = {
    status: newStatus,
  };

  updateStatusInDB("tasks", cardID, statusUpdate);
}

function allowDrop() {
  event.preventDefault();
}

async function findInDB(path = "") {
  console.log(cardID);

  let response = await fetch(FB_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

async function updateStatusInDB(path = "", idNumber, status) {
  console.log(status);

  let response = await fetch(`${BASE_URL}/${path}/${idNumber}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });

  const responseData = await response.json();
  console.log(responseData);
}

async function changeData(path = "") {}
