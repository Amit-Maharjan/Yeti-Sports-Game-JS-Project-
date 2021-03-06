function animateAngle() {
  if (readyFlyMusicFlag === 0) {
    readyMusic.play();
    readyFlyMusicFlag = 1;
  }

  background.render();
  penguin.drawPenguin();

  displayScore();
  displayLives();

  drawAllAnimal();

  //yeti1 Object
  let yeti1 = new Yeti(firstYeti);
  yeti1.draw();

  angle.drawCircle();
  angle.drawAngleMeasure();
  document.getElementById('canvas').addEventListener('click', angle.setAngle);

  collisionFlag = 0;
}

function animatePower() {
  background.render();
  penguin.drawPenguin();

  //yeti1 Object
  let yeti1 = new Yeti(firstYeti);
  yeti1.draw();
  yeti2.x = yeti1.x;

  displayScore();
  displayLives();

  drawAllAnimal();

  angle.drawCircle();
  angle.drawLine();
  power.drawRectangle();
  power.drawSmallRectangle();
  power.drawPowerMeasure();
  document.getElementById('canvas').addEventListener('click', power.setPower);
}

function animatePenguinSprite() {
  if (readyFlyMusicFlag === 1) {
    flyMusic.play();
    readyFlyMusicFlag = 0;
  }

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
    birdFly.play();

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

titleMusic.play();
firstPage.addEventListener('click', startGame);

function mainProgram() {
  initAnimal();

  setInterval(function() {
    if (animationNumber === 1) animateAngle();
    else if (animationNumber === 2) animatePower();
    else if (animationNumber === 3) animatePenguinSprite();
  }, 1000 / 60);
}
