function initColorPicker() {
  const canvas = document.getElementById("color-canvas");
  const colorDiv = document.getElementById("color-div");
  const amountTextR = document.getElementById("r-amount");
  const amountTextG = document.getElementById("g-amount");
  const amountTextB = document.getElementById("b-amount");

  const canvasContext = canvas.getContext("2d");

  let gradient = canvas.getContext("2d").createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, "#ff0000")
  gradient.addColorStop(1 / 6, "#ffff00")
  gradient.addColorStop((1 / 6) * 2, "#00ff00")
  gradient.addColorStop((1 / 6) * 3, "#00ffff")
  gradient.addColorStop((1 / 6) * 4, "#0000ff")
  gradient.addColorStop((1 / 6) * 5, "#ff00ff")
  gradient.addColorStop(1, "#ff0000")
  canvas.getContext("2d").fillStyle = gradient
  canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height)

  gradient = canvas.getContext("2d").createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, "rgba(255, 255, 255, .95)")
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)")
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
  canvas.getContext("2d").fillStyle = gradient
  canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height)

  gradient = canvas.getContext("2d").createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
  gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)")
  gradient.addColorStop(1, "rgba(0, 0, 0, .95)")
  canvas.getContext("2d").fillStyle = gradient
  canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height)

  canvas.addEventListener("click", (evt) => {
    const imgData = canvasContext.getImageData((evt.offsetX / canvas.clientWidth) * canvas.width, (evt.offsetY / canvas.clientHeight) * canvas.height, 1, 1)
    const rgba = imgData.data;
    colorDiv.style.backgroundColor = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
    amountTextR.innerHTML = `${rgba[0]}`;
    amountTextG.innerHTML = `${rgba[1]}`;
    amountTextB.innerHTML = `${rgba[2]}`;
    console.log("red: ", rgba[0], "green: ", rgba[1], "blue: ", rgba[2]);
  });
}

document.addEventListener("DOMContentLoaded", () => initColorPicker());
