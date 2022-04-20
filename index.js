const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // c: for context

//console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
    //console.log(collisions.slice(i, 70 + i));
}
//console.log(collisionsMap);

class Boundary {
    static width = 48;
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        c.fillStyle = "rgba(255, 0, 0, 0.0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = [];
const offset = {
    // x: -955,
    // y: -685,
    x: -740,
    y: -650,
}

collisionsMap.forEach( (row, i) => {
    row.forEach( (symbol, j) => {
        if( symbol === 1025 )
            boundaries.push(
                new Boundary({ 
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    } 
                })
            );
    });
});

console.log(boundaries);

// c.fillStyle = "white";
// c.fillRect(0, 0, canvas.width, canvas.height);

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
    constructor({ position, velocity, image, frames = {max: 1} }) {
        this.position = position;
        this.image = image;
        this.frames = frames;

        this.image.onload = () =>{
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
            console.log(this.width);
            console.log(this.height);
        }
        
    }

    draw() {
        //c.drawImage(this.image, this.position.x, this.position.y);
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height, 
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 4,
    },
    image: playerImage,
    frames: {
        max: 4,
    }
});


const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y,
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

const movables = [background, ...boundaries];
function rectangularCollision({ rectangle1, rectangle2 }){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

function animate () {
    window.requestAnimationFrame(animate);
    //console.log("animate");
    background.draw();
    boundaries.forEach(boundary => { 
        boundary.draw();

    });
    player.draw();


    let moving = true;
    // ao pressionar teclas movimenta selecione a posição do background e movimenta
    if (keys.w.pressed && lastKey === "w") {
        for ( let i = 0; i < boundaries.length; i++) {    
            const boundary = boundaries[i];        
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3,
                    }},
                })
                ) {
                console.log("colisao");
                moving = false;
                break;
            }
        }
        if(moving)
        movables.forEach( (movable) => {
            movable.position.y += 3;
        })
    } else if (keys.a.pressed && lastKey === "a") {
        for ( let i = 0; i < boundaries.length; i++) {    
            const boundary = boundaries[i];        
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y,
                    }},
                })
                ) {
                console.log("colisao");
                moving = false;
                break;
            }
        }
        if(moving)
        movables.forEach( (movable) => {
            movable.position.x += 3;
        })
    } 
    else if (keys.s.pressed && lastKey === "s"){ 
        for ( let i = 0; i < boundaries.length; i++) {    
            const boundary = boundaries[i];        
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3,
                    }},
                })
                ) {
                console.log("colisao");
                moving = false;
                break;
            }
        }
        if(moving)
        movables.forEach( (movable) => {
            movable.position.y -= 3;
        })
    }
    else if (keys.d.pressed && lastKey === "d") {
        for ( let i = 0; i < boundaries.length; i++) {    
            const boundary = boundaries[i];        
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }},
                })
                ) {
                console.log("colisao");
                moving = false;
                break;
            }
        }
        if(moving)
        movables.forEach( (movable) => {
            movable.position.x -= 3;
        })
    }   
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

    //console.log(keys);
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

    //console.log(keys);
});

