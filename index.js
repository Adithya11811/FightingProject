const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1247.330;
canvas.height = 570;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imageSrc: './fassets/background.png'
})
const shop = new Sprite({
  position:{
    x:615,
    y:128
  },
  imageSrc: './fassets/shop.png',
  scale: 2.75,
  framesMax: 6
})
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './fassets/samuraiMack/Idle.png',
  scale:2.5,
  framesMax : 8,
  offset:{
      x:215,
      y:157
  },
  sprites:{
    idle:{
      imageSrc:  './fassets/samuraiMack/Idle.png',
      framesMax : 8,
    },
    run:{
      imageSrc:  './fassets/samuraiMack/Run.png',
      framesMax : 8,
    },
    jump:{
      imageSrc:  './fassets/samuraiMack/Jump.png',
      framesMax : 2,
    },
    fall:{
      imageSrc:  './fassets/samuraiMack/Fall.png',
      framesMax : 2,
    },
    attack1:{
      imageSrc:  './fassets/samuraiMack/Attack1.png',
      framesMax : 6,
    },
    takehit:{
      imageSrc:  './fassets/samuraiMack/thw.png',
      framesMax : 4,
    },
    death:{
      imageSrc:  './fassets/samuraiMack/Death.png',
      framesMax : 6,
    }
  },
  attackBox:{
    offset:{
      x:100,
      y:50
    },
    width:160,
    height: 50
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: './fassets/kenji/Idle.png',
  scale:2.5,
  framesMax : 4,
  offset:{
      x:215,
      y:167
  },
  sprites:{
    idle:{
      imageSrc:  './fassets/kenji/Idle.png',
      framesMax : 4,
    },
    run:{
      imageSrc:  './fassets/kenji/Run.png',
      framesMax : 8,
    },
    jump:{
      imageSrc:  './fassets/kenji/Jump.png',
      framesMax : 2,
    },
    fall:{
      imageSrc:  './fassets/kenji/Fall.png',
      framesMax : 2,
    },
    attack1:{
      imageSrc:  './fassets/kenji/Attack1.png',
      framesMax : 4,
    },
    takehit:{
      imageSrc:  './fassets/kenji/Take hit.png',
      framesMax : 3,
    },
    death:{
      imageSrc:  './fassets/kenji/Death.png',
      framesMax : 7,
    }
  },
  attackBox:{
    offset:{
      x:-170 ,
      y:50
    },
    width:170,
    height: 50
  }

});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};


decreasedTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
 
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
 
  if (keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run')
  } else{
    player.switchSprite('idle')
  }
  //player jumping
  if(player.velocity.y<0){
    player.switchSprite('jump')
  } else if(player.velocity.y>0){
    player.switchSprite('fall')
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite('run')
  }else{
    enemy.switchSprite('idle')
  }
    //enemy jumping
    if(enemy.velocity.y<0){
      enemy.switchSprite('jump')
    } else if(enemy.velocity.y>0){
      enemy.switchSprite('fall')
    }
  //detect for player collision & gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking && player.frameCurrent === 4
  ) {
    enemy.takesahit()
    player.isAttacking = false;
    
    document.querySelector("#enemyhealth").style.width = enemy.health + "%";
  }
  //misfire
  if(player.isAttacking && player.frameCurrent===4){
    player.isAttacking = false
  }
  //detect for enemy collision
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking && enemy.frameCurrent===2
  ) {
    player.takesahit()
    enemy.isAttacking = false;
    document.querySelector("#playerhealth").style.width = player.health + "%";

  }
  if(enemy.isAttacking && enemy.frameCurrent===2){
    enemy.isAttacking = false
  }
  //end game based on health
  if(enemy.health <= 0 || player.health <= 0){
    determinedWinner({player,enemy,timerId})
  }
}

animate();

window.addEventListener("keydown", (event) => {

  if(!player.dead){
  switch (event.key) {
    //player
    case "d":
      keys.d.pressed = true;
      player.lastkey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastkey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
  }
  }
    //enemy
    if(!enemy.dead){
      switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastkey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;

      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
}
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //player
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    //enemy
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
})
