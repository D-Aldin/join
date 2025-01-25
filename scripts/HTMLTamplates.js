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
