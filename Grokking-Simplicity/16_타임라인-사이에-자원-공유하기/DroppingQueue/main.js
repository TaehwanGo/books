function slowReturn() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function fastReturn() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

const showBox = document.querySelector(".showBox");

const button10 = document.querySelector(".button10");

const button100 = document.querySelector(".button100");

button10.addEventListener("click", async () => {
  await slowReturn();
  showBox.innerHTML = "10";
});

button100.addEventListener("click", async () => {
  await fastReturn();
  showBox.innerHTML = "100";
});
