const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // c: for context
canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./Game-Assets/PelletTownZ.png"


image.onload = () => {
    c.drawImage(image, canvas.width / 2 - image.width / 2,
    canvas.height / 2 - image.height / 2 );
}

//console.log(c );