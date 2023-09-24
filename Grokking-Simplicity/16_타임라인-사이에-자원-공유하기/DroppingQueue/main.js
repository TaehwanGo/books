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

const button10Callback = async () => {
  await slowReturn();
  showBox.innerHTML = "10";
};

const button100Callback = async () => {
  await fastReturn();
  showBox.innerHTML = "100";
};

// 큐 관련 코드 시작
let queue = [];
let isProcessing = false;
const MAX_QUEUE_SIZE = 5;

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const task = queue.shift();
    await task();
  }

  isProcessing = false;
};

const enqueueTask = (task) => {
  if (queue.length < MAX_QUEUE_SIZE) {
    queue.push(task);
    processQueue();
  } else {
    console.warn("Queue is full! Task is not added.");
  }
};
// 큐 관련 코드 끝

// button10.addEventListener("click", button10Callback);
// button100.addEventListener("click", button100Callback);

button10.addEventListener("click", () => enqueueTask(button10Callback));
button100.addEventListener("click", () => enqueueTask(button100Callback));
