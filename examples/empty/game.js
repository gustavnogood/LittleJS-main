/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

"use strict";
const levelSize = vec2(38, 20);
let paddle;
let ball;
let score = 0;
const sound_bounce = new Sound(
  [, , 1e3, , 0.03, 0.02, 1, 2, , , 940, 0.03, , , , , 0.2, 0.6, , 0.06],
  0
);
const sound_break = new Sound(
  [, , 90, , 0.01, 0.03, 4, , , , , , , 9, 50, 0.2, , 0.2, 0.01],
  0
);
const sound_start = new Sound([
  ,
  0,
  500,
  ,
  0.04,
  0.3,
  1,
  2,
  ,
  ,
  570,
  0.02,
  0.02,
  ,
  ,
  ,
  0.04,
]);

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

  collideWithObject(o) {
    // prevent colliding with paddle if moving upwards
    if (o == paddle && this.velocity.y > 0) return false;

    sound_bounce.play(this.pos, 1, speed); // play bounce sound

    if (o == paddle) {
      // control bounce angle when ball collides with paddle
      const deltaX = this.pos.x - o.pos.x;
      this.velocity = this.velocity.rotate(0.3 * deltaX);

      // make sure ball is moving upwards with a minimum speed
      this.velocity.y = max(-this.velocity.y, 0.2);

      // speed up the ball
      const speed = min(1.04 * this.velocity.length(), 0.5);
      this.velocity = this.velocity.normalize(speed);

      // prevent default collision code
      return false;
    }

    return true; // allow object to collide
  }
}

class Wall extends EngineObject {
  constructor(pos, size) {
    super(pos, size); // set object position and size

    this.setCollision(); // make object collide
    this.mass = 0; // make object have static physics
    this.color = new Color(0, 0, 0, 0); // make object invisible
  }
}

class Brick extends EngineObject {
  constructor(pos, size) {
    super(pos, size);

    this.setCollision(); // make object collide
    this.mass = 0; // make object have static physics
  }

  collideWithObject(o) {
    this.destroy(); // destroy block when hit
    ++score;
    sound_break.play(this.pos);

    // create explosion effect
    const color = this.color;
    new ParticleEmitter(
      this.pos,
      0, // pos, angle
      this.size,
      0.1,
      200,
      PI, // emitSize, emitTime, emitRate, emiteCone
      undefined, // tileInfo
      color,
      color, // colorStartA, colorStartB
      color.scale(1, 0),
      color.scale(1, 0), // colorEndA, colorEndB
      0.2,
      0.5,
      1,
      0.1,
      0.1, // time, sizeStart, sizeEnd, speed, angleSpeed
      0.99,
      0.95,
      0.4,
      PI, // damping, angleDamping, gravityScale, cone
      0.1,
      0.5,
      false,
      true // fadeRate, randomness, collide, additive
    ); // play brick break sound
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

  paddle = new Paddle(); // create player's paddle

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
  if (ball && ball.pos.y < -1) {
    // if ball is below level
    // destroy old ball
    ball.destroy();
    ball = 0;
  }
  if (!ball && mouseWasPressed(0)) {
    // if there is no ball and left mouse is pressed
    ball = new Ball(cameraPos); // create the ball
    sound_start.play(); // play start sound
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
  drawTextScreen("Score " + score, vec2(mainCanvasSize.x / 2, 70), 50); // show score
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "tiles.png",
]);
