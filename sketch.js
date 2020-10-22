var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, Restart, gameOver_Image, Restart_image;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var jumpsound, checkptsound, diesound;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOver_Image = loadImage("gameOver.png");
  Restart_Image = loadImage("restart.png");

  groundImage = loadImage("ground2.png");

  checkptsound = loadSound("checkPoint.mp3");
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");


}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, windowHeight - 20, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.7;


  ground = createSprite(200, windowHeight - 20, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  gameOver = createSprite(windowWidth/2, windowHeight/2 - 50, 400, 90);
  gameOver.addImage("Over", gameOver_Image);
  gameOver.scale = 1;

  Restart = createSprite(windowWidth/2, windowHeight/2, 40, 30);
  Restart.addImage("Restart", Restart_Image);
  Restart.scale = 0.6;



  invisibleGround = createSprite(200, windowHeight - 10, 400, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  // console.log("Hello" + 5);

  trex.setCollider("circle", 0, 0, 40);
  //trex.debug = true

  score = 0
}

function draw() {
  background(180);
  //displaying score
  fill("red");
  textSize(30);
  text("Score: " + score, windowWidth  - 200, 70);

  // console.log("this is ",gameState)

   
  
  

  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -(4 + score/1000);

    gameOver.visible = false;
    Restart.visible = false;

    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    if (score > 0 && score % 100 == 0) {
      // checkptsound.play();
    }


    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 508 || touches.length > 0) {
      trex.velocityY = -13;
      touches = [];
      jumpsound.play();
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      diesound.play();
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    Restart.visible = true;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);


    if (keyDown("R") || mousePressedOver(Restart)) {
      gameState = PLAY;
      score = 0;
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      trex.y = 190;
      trex.changeAnimation("running", trex_running);
    }




  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth, windowHeight - 35, 30, 80);
    obstacle.velocityX = -(4 + score / 6000);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 360;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(windowWidth + 20, windowHeight - 300, 40, 10);
    cloud.y = Math.round(random(90, 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 244;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}
