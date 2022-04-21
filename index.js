const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // c: for context

console.log(gsap);

canvas.width = 1024; //1024
canvas.height = 576; //576

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
    //console.log(collisions.slice(i, 70 + i));
}
//console.log(collisionsMap);

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}
//console.log(battleZonesMap);

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

//console.log(boundaries);

const battleZones = [];

battleZonesMap.forEach( (row, i) => {
    row.forEach( (symbol, j) => {
        if( symbol === 1025 )
            battleZones.push(
                new Boundary({ 
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    } 
                })
            );
    });
});
console.log(battleZones);

//background
const image = new Image();
image.src = "./Game-Assets/PelletTownZ.png"

//foreground image
const foregroundImage = new Image();
foregroundImage.src = "./Game-Assets/foregroundObject.png"

// player 
const playerDownImage = new Image();
playerDownImage.src = "./Game-Assets/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./Game-Assets/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./Game-Assets/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./Game-Assets/playerRight.png";

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

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 4,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10,
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
    }
});


const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: image,
});

const foreground = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
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
};

const movables = [background, ...boundaries, foreground, ...battleZones];
function rectangularCollision({ rectangle1, rectangle2 }){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle = {
    initiated: false,
}

function animate () {
    const animationId = window.requestAnimationFrame(animate);
    //console.log("animate");
    background.draw();
    boundaries.forEach(boundary => { 
        boundary.draw();

    });
    battleZones.forEach(battleZone => { 
        battleZone.draw();

    });
    player.draw();
    foreground.draw();

    let moving = true;
    //player.moving = false;
    player.animate = false;

    // ativação de batalha
    if (battle.initiated) return
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
                //battleZones
        for ( let i = 0; i < battleZones.length; i++) {    
            const battleZone = battleZones[i]; 
            const overlappingArea = (Math.min(
                                        player.position.x + player.width, 
                                        battleZone.position.x + battleZone.width
                                    ) -
                                    Math.max(
                                        player.position.x, battleZone.position.x
                                    ) ) * 
                                    (Math.min(
                                        player.position.y + player.height,
                                        battleZone.position.y + battleZone.height
                                    ) -
                                    Math.max(
                                        player.position.y, battleZone.position.y
                                    ));
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone,
                }) &&
                overlappingArea > (player.width * player.height) / 2 
                && Math.random() < 0.01
                ) {
                console.log("ativar batalha");

                // desativar a animação em loop
                window.cancelAnimationFrame(animationId);

                battle.initiated = true;
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // ativação de uma nova animação
                                animateBattle();
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,                                    
                                    duration: 0.4,
                                })
                            }
                        })                      
                        
                    }
                });
                break;
            }
        }
    }


    // ao pressionar teclas movimenta selecione a posição do background e movimenta
    if (keys.w.pressed && lastKey === "w") {
        //player.moving = true;
        player.animate = true;
        player.image = player.sprites.up;
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
                //console.log("colisao");
                moving = false;
                break;
            }
        }
        //
        if(moving)
        movables.forEach( (movable) => {
            movable.position.y += 3;
        })
    } else if (keys.a.pressed && lastKey === "a") {
        //player.moving = true;
        player.animate = true;
        player.image = player.sprites.left;
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
        //player.moving = true;
        player.animate = true;
        player.image = player.sprites.down;
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
       //player.moving = true;
       player.animate = true;
        player.image = player.sprites.right;
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
//animate();

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./Game-Assets/battleBackground.png";
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage,
});

const draggleImage = new Image();
draggleImage.src = "./Game-Assets/draggleSprite.png";
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100,
    }, 
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30,
    },
    animate: true
});

const embyImage = new Image();
embyImage.src = "./Game-Assets/embySprite.png";
const emby = new Sprite({
    position: {
        x: 280,
        y: 325,
    }, 
    image: embyImage,
    frames: {
        max: 4,
        hold: 30,
    },
    animate: true
});

function animateBattle(){
    window.requestAnimationFrame(animateBattle);
    console.log("batalha ativada")
    battleBackground.draw();
    draggle.draw();
    emby.draw();
}

animate();
//animateBattle();

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

