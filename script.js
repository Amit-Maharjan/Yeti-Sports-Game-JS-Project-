let canvas = document.getElementById('canvas');

canvas.width = 1216;
canvas.height = 684;

let ctx = canvas.getContext('2d');

let score = 0;
let lives = 5;

//Images
let mountainImage = new Image();
let penguinImage = new Image();
let elephant = new Image();
let giraffe = new Image();
let snake = new Image();
let tree = new Image();
let birdImage = new Image();
let craneImage = new Image();
let firstYeti = new Image();
let secondYeti = new Image();

mountainImage.src = 'images/mountain-background.png';
penguinImage.src = 'images/penguin-sprite-images.png';
elephant.src = 'images/elephant.png';
giraffe.src = 'images/giraffe.png';
snake.src = 'images/snake-sprite-images.png';
tree.src = 'images/tree.png';
birdImage.src = 'images/bird-sprite.png';
craneImage.src = 'images/crane-sprite.png';
firstYeti.src = 'images/yeti1.png';
secondYeti.src = 'images/yeti2.png';

//Background Class
function Background() {
  this.x = 0;
  this.y = 0;

  this.subImageWidth = 1216;
  this.subImageHeight = 684;

  this.numberOfSubImage = 3;

  this.xSubImage = this.subImageWidth;
  this.ySubImage = 0;

  this.render = function() {
    ctx.drawImage(
      mountainImage,
      (this.xSubImage -= xChangeOfBackground),
      this.ySubImage,
      this.subImageWidth,
      this.subImageHeight,
      this.x,
      this.y,
      this.subImageWidth,
      this.subImageHeight
    );

    //Score
    if (animationNumber === 3) score += xChangeOfBackground;

    if (xChangeOfBackground > 0) {
      if (this.xSubImage <= 0) {
        this.xSubImage = this.subImageWidth;
      }
    } else if (xChangeOfBackground < 0) {
      if (this.xSubImage >= 0) {
        this.xSubImage = this.subImageWidth;
      }
    }
  };
}

//background Object
var background = new Background();

//Penguin Class
function Penguin(x, y) {
  this.x = x;
  this.y = y;

  this.spriteWidth = 1380;
  this.spriteHeight = 115;

  this.totalSpriteImage = 12;

  this.imageWidth = this.spriteWidth / this.totalSpriteImage;
  this.imageHeight = this.spriteHeight;

  this.imageX = 0;
  this.imageY = 0;

  this.currentFrameIndex = 0;
}

Penguin.prototype.updateSprite = function() {
  this.currentFrameIndex = ++this.currentFrameIndex % this.totalSpriteImage;
  this.imageX = this.currentFrameIndex * this.imageWidth;
  this.imageY = 0;
  ctx.clearRect(this.x, this.y, this.imageWidth, this.imageHeight);
};

Penguin.prototype.drawPenguin = function() {
  if (moveBackground === 1) this.updateSprite();
  else if (moveBackground === 0) xChangeOfBackground = 0;

  background.render();

  ctx.drawImage(
    penguinImage,
    this.imageX,
    this.imageY,
    this.imageWidth,
    this.imageHeight,
    this.x,
    this.y,
    this.imageWidth,
    this.imageHeight
  );
};

let flagForNegativeGravity = 1;
let xChangeOfBackground = 0;
let moveBackground = 0;
let angleInDegree;
let speedInPower;

Penguin.prototype.projectilePenguin = function() {
  //Calculating Center of Gravity (CG)
  let xCenterOfGravity = this.x + this.imageWidth / 2;
  let yCenterOfGravity = this.y + this.imageHeight / 2;

  let speed = speedInPower;
  let angle = (angleInDegree * Math.PI) / 180;

  let vx = speed * Math.cos(angle);
  let vy = speed * Math.sin(angle);

  let mass = 1;
  let gravitationalField = 1;

  let dt = 1;
  let t = 0;

  let gravitationalForce = mass * gravitationalField;

  let force = gravitationalForce;

  let actualMaximunHeight =
    ((speed * speed * Math.sin(angle) * Math.sin(angle)) / 2) * (force / mass); //According to formula

  let maximunHeight = yPositionOfPenguin - actualMaximunHeight * 8; //Adjustment for our screen

  if (this.y < maximunHeight) flagForNegativeGravity = 0;

  if (this.y <= yPositionOfPenguin) {
    //Update velocity
    vx = vx; //Horizontal Velocity is always constant
    vy = vy + (force / mass) * dt;

    //Update Position
    xCenterOfGravity = xCenterOfGravity - vx * dt;
    if (flagForNegativeGravity === 1)
      yCenterOfGravity = yCenterOfGravity - vy * dt;
    else if (flagForNegativeGravity === 0)
      yCenterOfGravity = yCenterOfGravity + vy * dt;

    xChangeOfBackground = vx * dt; // For x change in background

    //Update Time
    t = t + dt;

    //Calculating drawable point
    //this.x = xCenterOfGravity - this.imageWidth / 2; // X is kept always same in our animation
    this.y = yCenterOfGravity - this.imageHeight / 2;

    moveBackground = 1;
  } else moveBackground = 0;

  //Bouncing Effect and Friction of Penguin
  if (this.y > yPositionOfPenguin && t > 0) {
    if (speedInPower >= 5) {
      //Bounce
      speedInPower = speedInPower / 2;
      moveBackground = 1;
      flagForNegativeGravity = 1;
      this.y = yPositionOfPenguin;
    } else if (speedInPower > 1 && speedInPower < 5) {
      //Friction
      speedInPower -= 1;
      moveBackground = 1;
      flagForNegativeGravity = 1;
      this.y = yPositionOfPenguin;
    }
  }
};

let speedOfPenguin;
let angleInRadianOfPenguin;
let vxOfPenguin;
let vyOfPenguin;

Penguin.prototype.projectilePenguinAfterCollision = function() {
  //Calculating Center of Gravity (CG)
  let xCenterOfGravity = this.x + this.imageWidth / 2;
  let yCenterOfGravity = this.y + this.imageHeight / 2;

  vxOfPenguin = vxOfPenguin * Math.cos(angleInRadianOfPenguin) + 0.05;
  vyOfPenguin = vyOfPenguin * Math.sin(angleInRadianOfPenguin);

  let mass = 1;
  let gravitationalField = 10;

  let dt = 1;
  let t = 0;

  let gravitationalForce = -mass * gravitationalField;

  let force = gravitationalForce;

  if (this.y <= yPositionOfPenguin) {
    //Update velocity
    vxOfPenguin = vxOfPenguin; //Horizontal Velocity is always constant
    vyOfPenguin = vyOfPenguin + (force / mass) * dt;

    angleInRadianOfPenguin = Math.atan(vyOfPenguin / vxOfPenguin);

    //Update Position
    xCenterOfGravity = xCenterOfGravity - vxOfPenguin * dt;
    yCenterOfGravity = yCenterOfGravity - vyOfPenguin * dt;

    xChangeOfBackground = (vxOfPenguin * dt) / 3; // For x change in background

    //Update Time
    t = t + dt;

    //Calculating drawable point
    //this.x = xCenterOfGravity - this.imageWidth / 2; // X is kept always same in our animation
    this.y = yCenterOfGravity - this.imageHeight / 2;

    moveBackground = 1;
  } else moveBackground = 0;

  //Bouncing Effect and Friction of Penguin
  if (this.y > yPositionOfPenguin && t > 0) {
    if (speedOfPenguin >= 20) {
      //Bounce
      speedOfPenguin = speedOfPenguin / 5;
      vxOfPenguin = speedOfPenguin;
      vyOfPenguin = speedOfPenguin;
      angleInRadianOfPenguin = (45 * Math.PI) / 180;
      moveBackground = 1;
      this.y = yPositionOfPenguin;
    } else if (speedOfPenguin > 10 && speedOfPenguin < 20) {
      //Friction
      speedOfPenguin -= 1;
      vxOfPenguin = speedOfPenguin;
      vyOfPenguin = speedOfPenguin;
      angleInRadianOfPenguin = (45 * Math.PI) / 180;
      moveBackground = 1;
      this.y = yPositionOfPenguin;
    }
  }
};

let disappearBird = 0;

Penguin.prototype.dropPenguin = function() {
  angleInRadianOfPenguin = 0;
  speedOfPenguin = 40;
  speedInPower = 30;
  vxOfPenguin = speedOfPenguin;
  vyOfPenguin = speedOfPenguin;
  collisionFlag = 1;
  disappearBird = 1;
};

const xPositionOfPenguin = canvas.width - 200;
const yPositionOfPenguin = canvas.height - 200;

//penguin Object
let penguin = new Penguin(xPositionOfPenguin, yPositionOfPenguin);

//Angle Class
function Angle() {
  let that = this;

  this.angle = 0;
  this.x = xPositionOfPenguin;
  this.y = yPositionOfPenguin + penguin.imageHeight;
  this.radius1 = 90;
  this.radius2 = 50;
  this.startAngle = (180 * Math.PI) / 180;
  this.endAngle = (270 * Math.PI) / 180;

  this.measureX;
  this.measureY;
  this.clockwiseChange = 1;

  this.drawCircle = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius1, this.startAngle, this.endAngle);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius2, this.startAngle, this.endAngle);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x - this.radius2, this.y);
    ctx.lineTo(this.x - this.radius1, this.y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.radius2);
    ctx.lineTo(this.x, this.y - this.radius1);
    ctx.stroke();
    ctx.closePath();
  };

  this.measureX = this.x - this.radius1;

  this.drawAngleMeasure = function() {
    this.measureX += this.clockwiseChange;
    this.measureY =
      this.y -
      Math.sqrt(
        this.radius1 * this.radius1 -
          (this.measureX * this.measureX -
            2 * this.measureX * this.x +
            this.x * this.x)
      );

    if (this.measureY === this.y - this.radius1) this.clockwiseChange = -1;
    else if (this.measureY === this.y) this.clockwiseChange = 1;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.measureX, this.measureY);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
    ctx.closePath();
  };

  this.setAngle = function() {
    that.angle = that.measureX - (that.x - that.radius1);
    angleInDegree = that.angle;
    animationNumber = 2;
    document
      .getElementById('canvas')
      .removeEventListener('click', angle.setAngle);
  };

  this.drawLine = function() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.measureX, this.measureY);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
    ctx.closePath();
  };
}

//angle Object
let angle = new Angle();

//Power Class
function Power() {
  let that = this;

  this.width = 50;
  this.height = 100;
  this.x = xPositionOfPenguin - angle.radius1 - this.width - 10;
  this.y = yPositionOfPenguin + penguin.imageHeight - this.height;

  this.measureWidth = this.width;
  this.measureHeight = 0;
  this.measureX = this.x;
  this.measureY = this.y + this.height - this.measureHeight;
  this.increase = 1;

  this.smallRectWidth = this.width / 2;
  this.smallRectHeight = 10;
  this.smallRectX = this.x + this.width / 2 - this.smallRectWidth / 2;
  this.smallRectY = this.y - this.smallRectHeight;

  this.drawRectangle = function() {
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  };

  this.drawPowerMeasure = function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      this.measureX,
      this.measureY,
      this.measureWidth,
      this.measureHeight
    );
    if (this.measureHeight === 0) this.increase = 1;
    else if (this.measureHeight === this.height) this.increase = -1;
    this.measureHeight += this.increase;
    this.measureY = this.y + this.height - this.measureHeight;
  };

  this.drawSmallRectangle = function() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      this.smallRectX,
      this.smallRectY,
      this.smallRectWidth,
      this.smallRectHeight
    );
  };

  this.setPower = function() {
    speedInPower = that.measureHeight;
    animationNumber = 3;
    document
      .getElementById('canvas')
      .removeEventListener('click', power.setPower);
  };
}

//power Object
let power = new Power();

//Elephant Class
function Elephant(x) {
  this.x = x;
  this.y = yPositionOfPenguin + penguin.imageHeight - elephant.height;

  this.draw = function() {
    ctx.drawImage(elephant, this.x, this.y);
  };

  this.checkCollision = function() {
    if (
      penguin.x <= this.x + elephant.width &&
      penguin.x >= this.x + elephant.width / 2 &&
      penguin.y + penguin.imageHeight >= this.y
    ) {
      collisionInRight();
    } else if (
      penguin.x <= this.x + elephant.width / 2 &&
      penguin.x + penguin.imageWidth >= this.x &&
      penguin.y + penguin.imageHeight >= this.y
    ) {
      collisionInLeft();
    }
  };
}

//Giraffe Class
function Giraffe(x) {
  this.width = giraffe.width / 1.5;
  this.height = giraffe.height / 1.5;
  this.x = x;
  this.y = yPositionOfPenguin + penguin.imageHeight - this.height;

  this.legHeight = 205;
  this.tailWidth = 100;

  this.draw = function() {
    ctx.drawImage(giraffe, this.x, this.y, this.width, this.height);
  };

  this.checkCollision = function() {
    if (
      penguin.x <= this.x + this.width &&
      penguin.x >= this.x + this.width / 2 &&
      penguin.y + penguin.imageHeight >= this.y &&
      penguin.y <= this.y + this.height - this.legHeight
    ) {
      collisionInRight();
    } else if (
      penguin.x <= this.x + this.width / 2 &&
      penguin.x + penguin.imageWidth >= this.x + this.tailWidth &&
      penguin.y + penguin.imageHeight >= this.y &&
      penguin.y <= this.y + this.height - this.legHeight
    ) {
      collisionInLeft();
    }
  };
}

//Snake Class
function Snake(x) {
  this.totalSpriteImage = 6;

  this.width = snake.width / this.totalSpriteImage / 1.5;
  this.height = snake.height / 1.5;

  this.x = x;
  this.y = yPositionOfPenguin + penguin.imageHeight - this.height;

  this.spriteWidth = 2220;
  this.spriteHeight = 370;

  this.imageWidth = this.spriteWidth / this.totalSpriteImage;
  this.imageHeight = this.spriteHeight;

  this.imageX = 0;
  this.imageY = 0;

  this.currentFrameIndex = 0;

  this.topOffset = 175;
  this.rightOffset = 50;
  this.leftOffset = 90;
}

Snake.prototype.updateSnakeSprite = function() {
  this.currentFrameIndex = ++this.currentFrameIndex % this.totalSpriteImage;
  this.imageX = this.currentFrameIndex * this.imageWidth;
  this.imageY = 0;
};

let moveSnake = 0;

Snake.prototype.draw = function() {
  if (this.currentFrameIndex === 5) moveSnake = 0;

  if (moveSnake === 1) this.updateSnakeSprite();

  ctx.drawImage(
    snake,
    this.imageX,
    this.imageY,
    this.imageWidth,
    this.imageHeight,
    this.x,
    this.y,
    this.width,
    this.height
  );
};

Snake.prototype.checkCollision = function() {
  if (
    penguin.x <= this.x + this.width - this.rightOffset &&
    penguin.x + penguin.imageWidth >= this.x + this.leftOffset &&
    penguin.y + penguin.imageHeight >= this.y + this.topOffset
  ) {
    //Collision
    if (xChangeOfBackground > 0) angleInDegree = 45;
    else if (xChangeOfBackground < 0) angleInDegree = 135;

    speedInPower = 50;
    flagForNegativeGravity = 1;
    collisionFlag = 0;
    moveSnake = 1;
  }
};

//Tree Class
function Tree(x) {
  this.width = tree.width * 1.5;
  this.height = tree.height * 1.5;
  this.x = x;
  this.y = yPositionOfPenguin + penguin.imageHeight - this.height;

  this.draw = function() {
    ctx.drawImage(tree, this.x, this.y, this.width, this.height);
  };

  this.checkCollision = function() {
    if (
      penguin.x <= this.x + this.width &&
      penguin.x >= this.x + this.width / 2 &&
      penguin.y + penguin.imageHeight >= this.y
    ) {
      collisionInRight();
    } else if (
      penguin.x <= this.x + this.width / 2 &&
      penguin.x + penguin.imageWidth >= this.x &&
      penguin.y + penguin.imageHeight >= this.y
    ) {
      collisionInLeft();
    }
  };
}

//Bird Class
function Bird() {
  this.totalSpriteImage = 8;

  this.width = birdImage.width / this.totalSpriteImage / 1.5;
  this.height = birdImage.height / 1.5;

  this.x = xPositionOfPenguin - 100;
  this.y = 0;

  this.spriteWidth = 2520;
  this.spriteHeight = 315;

  this.imageWidth = this.spriteWidth / this.totalSpriteImage;
  this.imageHeight = this.spriteHeight;

  this.imageX = 0;
  this.imageY = 0;

  this.currentFrameIndex = 0;
}

Bird.prototype.updateBirdSprite = function() {
  this.currentFrameIndex = ++this.currentFrameIndex % this.totalSpriteImage;
  this.imageX = this.currentFrameIndex * this.imageWidth;
  this.imageY = 0;
};

Bird.prototype.drawBird = function() {
  if (moveBackground === 1) this.updateBirdSprite();

  ctx.drawImage(
    birdImage,
    this.imageX,
    this.imageY,
    this.imageWidth,
    this.imageHeight,
    this.x,
    this.y,
    this.width,
    this.height
  );
};

//bird Object
let bird = new Bird();

//Crane Class
function Crane() {
  this.totalSpriteImage = 6;

  this.width = craneImage.width / this.totalSpriteImage / 1.5;
  this.height = craneImage.height / 1.5;

  this.x = canvas.width;
  this.y = yPositionOfPenguin + penguin.imageHeight - this.height;

  this.spriteWidth = 1392;
  this.spriteHeight = 247;

  this.imageWidth = this.spriteWidth / this.totalSpriteImage;
  this.imageHeight = this.spriteHeight;

  this.imageX = 0;
  this.imageY = 0;

  this.currentFrameIndex = 0;
}

Crane.prototype.updateCraneSprite = function() {
  this.currentFrameIndex = ++this.currentFrameIndex % this.totalSpriteImage;
  this.imageX = this.currentFrameIndex * this.imageWidth;
  this.imageY = 0;
};

Crane.prototype.drawCrane = function() {
  ctx.drawImage(
    craneImage,
    this.imageX,
    this.imageY,
    this.imageWidth,
    this.imageHeight,
    this.x,
    this.y,
    this.width,
    this.height
  );
};

//crane Object
let crane = new Crane();

//Yeti Class
function Yeti(yetiImage) {
  this.width = yetiImage.width * 2.5;
  this.height = yetiImage.height * 2.5;

  this.x = xPositionOfPenguin + 50;
  this.y = yPositionOfPenguin + penguin.imageHeight - this.height;

  this.draw = function() {
    ctx.drawImage(yetiImage, this.x, this.y, this.width, this.height);
  };
}

/*
  0 - Elephant
  1 - Giraffe
  2 - Snake
  3 - Tree

  Total number = 4
*/

//Random Number Generator Between two points
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//animalArray Object
let animalArray = [];
let randomAnimal = getRandomInt(0, 4);
const initialXPositionOfAnimal = 100;

if (randomAnimal === 0) animalArray[0] = new Elephant(initialXPositionOfAnimal);
else if (randomAnimal === 1)
  animalArray[0] = new Giraffe(initialXPositionOfAnimal);
else if (randomAnimal === 2)
  animalArray[0] = new Snake(initialXPositionOfAnimal);
else if (randomAnimal === 3)
  animalArray[0] = new Tree(initialXPositionOfAnimal);

function drawAllAnimal() {
  animalArray.forEach(animal => {
    animal.draw();
  });
}

function updateAnimal() {
  if (moveBackground === 1) {
    for (let i = 0; i < animalArray.length; i++) {
      animalArray[i].x += xChangeOfBackground;

      //Add New Animal
      if (animalArray[animalArray.length - 1].x > 650) {
        randomAnimal = getRandomInt(0, 4);

        if (randomAnimal === 0) animalArray.push(new Elephant(-elephant.width));
        else if (randomAnimal === 1)
          animalArray.push(new Giraffe(-giraffe.width / 1.5));
        else if (randomAnimal === 2)
          animalArray.push(new Snake(-snake.width / 6 / 1.5));
        else if (randomAnimal === 3)
          animalArray.push(new Tree(-tree.width * 1.5));
      }
    }
  }
}

function checkCollision() {
  animalArray.forEach(animal => {
    animal.checkCollision();
  });
}

function collisionInRight() {
  speedOfPenguin = (20 * speedInPower) / 10;
  vxOfPenguin = speedOfPenguin;
  vyOfPenguin = speedOfPenguin;

  angleInRadianOfPenguin = (180 * Math.PI) / 180;

  collisionFlag = 1;
}

function collisionInLeft() {
  speedOfPenguin = (20 * speedInPower) / 20;
  vxOfPenguin = speedOfPenguin;
  vyOfPenguin = speedOfPenguin;

  angleInRadianOfPenguin = (0 * Math.PI) / 180;

  collisionFlag = 1;
}

function displayScore() {
  ctx.font = '30px arial';
  ctx.fillStyle = 'White';
  ctx.fillText('score : ' + Math.ceil(score / 100), 10, canvas.height - 20);
}

function displayLives() {
  ctx.font = '30px arial';
  ctx.fillStyle = 'Black';
  ctx.fillText('Lives : ' + lives, 10, 50);
}

let xPositionOfGameOver = canvas.width + crane.width;
let xDecrementOfGameOver = 0;

function displayGameOver() {
  ctx.beginPath();
  ctx.moveTo(
    crane.x + crane.width - 50,
    yPositionOfPenguin + penguin.imageHeight - 60
  );
  ctx.lineTo(
    xPositionOfGameOver - xDecrementOfGameOver + 100,
    yPositionOfPenguin + penguin.imageHeight - 60
  );
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath();

  ctx.fillStyle = 'grey';
  ctx.fillRect(
    xPositionOfGameOver - xDecrementOfGameOver + 100,
    yPositionOfPenguin + penguin.imageHeight - 120,
    155,
    100
  );

  ctx.font = '30px arial';
  ctx.fillStyle = 'Red';
  ctx.fillText(
    'Game Over',
    xPositionOfGameOver - xDecrementOfGameOver + 100,
    yPositionOfPenguin + penguin.imageHeight - 90
  );
  ctx.fillText(
    'Score : ' + Math.ceil(score / 100),
    xPositionOfGameOver - xDecrementOfGameOver + 100,
    yPositionOfPenguin + penguin.imageHeight - 60
  );
  ctx.fillText(
    'Play Again',
    xPositionOfGameOver - xDecrementOfGameOver + 100,
    yPositionOfPenguin + penguin.imageHeight - 30
  );
}

function gameOver() {
  if (crane.x >= 300) {
    crane.x -= 5;
    xDecrementOfGameOver += 5;
    crane.updateCraneSprite();
  }

  crane.drawCrane();
  displayGameOver();

  if (crane.x < 300) {
    document.getElementById('canvas').addEventListener('click', reload);
  }
}

function reload() {
  let x = event.clientX;
  let y = event.clientY;
  if (x >= 560 && x <= 715 && (y >= 545 && y <= 590)) {
    location.reload();
  }

  document.getElementById('canvas').removeEventListener('click', reload);
}

let animationNumber = 1;
let collisionFlag = 0;
let count;

function animateAngle() {
  background.render();
  penguin.drawPenguin();
  angle.drawCircle();
  angle.drawAngleMeasure();
  document.getElementById('canvas').addEventListener('click', angle.setAngle);

  displayScore();
  displayLives();

  drawAllAnimal();

  let yeti1 = new Yeti(firstYeti);
  yeti1.draw();

  collisionFlag = 0;
}

function animatePower() {
  background.render();
  penguin.drawPenguin();

  let yeti1 = new Yeti(firstYeti);
  yeti1.draw();
  yeti2.x = yeti1.x;

  angle.drawCircle();
  angle.drawLine();
  power.drawRectangle();
  power.drawSmallRectangle();
  power.drawPowerMeasure();

  document.getElementById('canvas').addEventListener('click', power.setPower);

  displayScore();
  displayLives();

  drawAllAnimal();
}

let yeti2 = new Yeti(secondYeti);

function animatePenguinSprite() {
  penguin.drawPenguin();

  yeti2.x += xChangeOfBackground;
  yeti2.draw();

  if (collisionFlag === 0) penguin.projectilePenguin();
  else if (collisionFlag === 1) {
    penguin.projectilePenguinAfterCollision();
    if (disappearBird === 1) {
      bird.y -= 5;
      bird.drawBird();
    }
  } else if (collisionFlag === 2) {
    // collisionFlag = 2 indicated the bird action being activated
    if (bird.y < -50) {
      bird.y += 5;
      penguin.y += 5;
      xChangeOfBackground = 10;
    }

    bird.drawBird();
    count++;

    if (count > 250) penguin.dropPenguin();
  }

  if (penguin.y < -8 * penguin.imageHeight) {
    // collisionFlag = 2 indicated the bird action being activated
    bird.y = -bird.height;
    penguin.y = -penguin.imageHeight;
    count = 0;
    collisionFlag = 2;
  }

  displayScore();
  displayLives();

  drawAllAnimal();
  checkCollision();
  updateAnimal();

  //Reload Game
  if (moveBackground === 0) {
    if (lives > 1) {
      xChangeOfBackground = 0;
      animationNumber = 1;
      penguin.y = yPositionOfPenguin;
    }

    if (lives > 0) lives--;

    if (lives === 0) gameOver();
  }
}

let mainProgram = setInterval(function() {
  if (animationNumber === 1) animateAngle();
  else if (animationNumber === 2) animatePower();
  else if (animationNumber === 3) animatePenguinSprite();
}, 1000 / 60);
