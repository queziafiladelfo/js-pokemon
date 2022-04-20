const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // c: for context

console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

//background
const image = new Image();
image.src = "./Game-Assets/PelletTownZ.png"

// player
const playerImage = new Image();
playerImage.src = "./Game-Assets/playerDown.png";

// image.onload = () => {
//     // c.drawImage(image, canvas.width / 2 - image.width / 2,
//     // canvas.height / 2 - image.height / 2 );
//     c.drawImage(image, -955, -685);

//     c.drawImage(
//         playerImage,
//         0,
//         0,
//         playerImage.width / 4,
//         playerImage.height, 
//         canvas.width / 2 - playerImage.width / 4,
//         canvas.height / 2 - playerImage.height / 4,
//         playerImage.width / 4,
//         playerImage.height
//     );
// }

class Sprite {
    constructor({ position, velocity, image }) {
        this.position = position;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({ 
    position: {
        x: -955,
        y: -685,
    },
    image: image,
});

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

function animate () {
    window.requestAnimationFrame(animate);
    //console.log("animate");
    background.draw();
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4,
        playerImage.height, 
        canvas.width / 2 - playerImage.width / 4,
        canvas.height / 2 - playerImage.height / 4,
        playerImage.width / 4,
        playerImage.height
    );

    // ao pressionar teclas movimenta selecione a posição do background e movimenta
    if (keys.w.pressed && lastKey === "w") background.position.y += 3;
    else if (keys.a.pressed && lastKey === "a") background.position.x += 3; 
    else if (keys.s.pressed && lastKey === "s") background.position.y -= 3;
    else if (keys.d.pressed && lastKey === "d") background.position.x -= 3;   
  

}
animate();

let lastKey = ""
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            //console.log("pressed w key");
            keys.w.pressed = true;
            lastKey = "w";
            break;
        case "a":
            //console.log("pressed a key");
            keys.a.pressed = true;
            lastKey = "a";
            break;
        case "s":
            //console.log("pressed s key");
            keys.s.pressed = true;
            lastKey = "s";
            break;
        case "d":
            //console.log("pressed d key");
            keys.d.pressed = true;
            lastKey = "d";
            break;
    }

    console.log(keys);
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            //console.log("pressed w key");
            keys.w.pressed = false;
            break;
        case "a":
            //console.log("pressed a key");
            keys.a.pressed = false;
            break;
        case "s":
            //console.log("pressed s key");
            keys.s.pressed = false;
            break;
        case "d":
            //console.log("pressed d key");
            keys.d.pressed = false;
            break;
    }

    console.log(keys);
});

