document.querySelectorAll("#toDo, #progress, #feedback, #done").forEach((section) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  section.addEventListener("mousedown", (e) => {
    isDown = true;
    section.classList.add("grabbing");
    startX = e.pageX - section.offsetLeft;
    scrollLeft = section.scrollLeft;
  });

  section.addEventListener("mouseleave", () => {
    isDown = false;
    section.classList.remove("grabbing");
  });

  section.addEventListener("mouseup", () => {
    isDown = false;
    section.classList.remove("grabbing");
  });

  section.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    if (Math.abs(e.movementX) > Math.abs(e.movementY)) {
      e.preventDefault();
      const x = e.pageX - section.offsetLeft;
      const walk = (x - startX) * 1.5;
      section.scrollLeft = scrollLeft - walk;
    }
  });
});
