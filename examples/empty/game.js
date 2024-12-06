/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

"use strict";
const levelSize = vec2(38, 20);
let ball;
let score = 0;
class Paddle extends EngineObject {
  constructor() {
    super(vec2(0, 1), vec2(6, 0.5));
    this.setCollision(); //collison based obejct
    this.mass = 0; //making it static
  }
  update() {
    this.pos.x = mousePos.x; // move paddle to mouse
    this.pos.x = clamp(
      this.pos.x,
      this.size.x / 2,
      levelSize.x - this.size.x / 2
    );
  }
}

class Ball extends EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5)); // set object position and size
    this.setCollision();
    this.velocity = vec2(-0.1, -0.1); // give ball some movement
    this.elasticity = 1; // make object bounce
  }
}

class Wall extends EngineObject {
  constructor(pos, size) {
    super(pos, size); // set object position and size

    this.setCollision(); // make object collide
    this.mass = 0; // make object have static physics
    this.color = new Color(0,0,0,0); // make object invisible
  }
}

class Brick extends EngineObject
{
    constructor(pos, size)
    {
        super(pos, size);

        this.setCollision(); // make object collide
        this.mass = 0; // make object have static physics
    }

    collideWithObject(o)              
{
    this.destroy(); // destroy block when hit
    ++score;
    return true;
     // allow object to collide
}
}
///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  // create bricks
  setCanvasFixedSize(vec2(1280, 720)); // use a 720p fixed size canvas

  for (let x = 2; x <= levelSize.x - 2; x += 2)
    for (let y = 12; y <= levelSize.y - 2; y += 1) {
      const brick = new Brick(vec2(x, y), vec2(2, 1)); // create a brick
      brick.color = randColor(); // give brick a random color
    }

  setCameraPos(levelSize.scale(0.5)); // center camera in level

  new Paddle();

  new Wall(vec2(-0.5, levelSize.y / 2), vec2(1, 100)); // left
  new Wall(vec2(levelSize.x + 0.5, levelSize.y / 2), vec2(1, 100)); // right
  new Wall(vec2(levelSize.x / 2, levelSize.y + 0.5), vec2(100, 1)); // top
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
  drawRect(cameraPos, vec2(100), new Color(0.5, 0.5, 0.5)); // draw background
  drawRect(cameraPos, levelSize, new Color(0.1, 0.1, 0.1)); // draw level boundary

  // if there is no ball or ball is below level
if (!ball || ball.pos.y < -1)
    {
        // destroy old ball
        if (ball)
            ball.destroy();
    
        // create a ball
        ball = new Ball(cameraPos);
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  drawTextScreen("Score " + score, vec2(mainCanvasSize.x/2, 70), 50); // show score
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "tiles.png",
]);
