/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__grid__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__painter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__enemies__ = __webpack_require__(4);




class Game {
  constructor(canvas, ctx) {
    this.grid = [];
    this.enemies = [];
    this.painter = new __WEBPACK_IMPORTED_MODULE_1__painter__["a" /* default */](canvas);

    this.ctx = ctx;
    this.canvas = canvas;
    this.addGrid(canvas);

    this.fps = 10; // ten frames per second
    this.fpsInterval = 1000 / this.fps;
    this.then = 0;
    this.level = 1;
    this.prevLevel = 1;
    this.enemyCount = 4;

    this.addEnemies(canvas);
  }


  addEnemies(canvas){
    for (let i = 0; i < this.enemyCount; i++) {
      this.enemies.push(new __WEBPACK_IMPORTED_MODULE_2__enemies__["a" /* default */](canvas, this.painter));
    }
  }

  addGrid(canvas) {
    let grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]({canvas: canvas});
    this.grid.push(grid);
  }

  allObjects(){
    return [].concat(this.grid, this.painter, this.enemies);
  }

  draw(ctx) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.allObjects().forEach((object) => {
      this.drawScore(ctx);
      this.painter.drawCurrentPos(ctx);
      object.draw(this.ctx);
    });

  }

  levelUp(canvas){
    let score = this.painter.score();
    if (score >= 0 && score < 10) {
      this.level = 1;
    } else if (score >= 10 && score < 30) {
      this.level = 2;
    } else if (score >= 30 && score < 60) {
      this.level = 3;
    } else if (score >= 60 && score < 80) {
      this.level = 4;
    } else if (score >= 80 && score < 100) {
      this.level = 5;
    }

  }

  start() {
    requestAnimationFrame(this.animate.bind(this));
  }


  drawScore(ctx) {
    let score = this.painter.score();
    ctx.beginPath();
    ctx.shadowBlur=3;
    ctx.shadowColor="white";
    ctx.font = '24px BioRhyme';
    ctx.fillText(`LVL: ${this.level} | SCORE: ${score}%`, 15, 705);
    ctx.closePath();
    ctx.fill();
  }

  animate(){
    const animationFrame = requestAnimationFrame(this.animate.bind(this));
    this.levelUp();
    if (this.prevLevel !== this.level) {
      this.addEnemies(this.canvas);
    }
    this.prevLevel = this.level;

    const now = Date.now();
    const timeDelta = now - this.then;

    if (timeDelta > this.fpsInterval) {
      this.then = now - (timeDelta % this.fpsInterval);
      this.painter.move();
      this.draw(this.ctx);
      this.enemies.forEach( (enemy) => enemy.move() );

    }

    if (this.painter.dead) {
      this.ctx.beginPath();
      this.ctx.shadowBlur=20;
      this.ctx.shadowColor="white";
      this.ctx.fillStyle="black";
      this.ctx.font = '90px Bungee Shade';
      this.ctx.fillText(`GAME OVER`, 130, 720 / 3 - 50);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.fillStyle="black";
      this.ctx.shadowBlur=0;
      this.ctx.shadowColor="white";
      this.ctx.font = '40px BioRhyme';
      this.ctx.fillText(`SCORE: ${this.painter.currentScore}%`, 290, 720 / 3 + 100);
      this.ctx.fillText(`CLICK TO PLAY AGAIN!`, 180, 720 / 3 + 200);
      this.ctx.closePath();
      this.ctx.fill();
      cancelAnimationFrame(animationFrame);
    }

    if (this.painter.won) {
      this.ctx.beginPath();
      this.ctx.shadowBlur=20;
      this.ctx.shadowColor="white";
      this.ctx.fillStyle="black";
      this.ctx.font = '70px Bungee Shade';
      this.ctx.fillText(`YOU WON!`, (this.DIM_Y/3), 200);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.fillStyle="black";
      this.ctx.shadowBlur=0;
      this.ctx.shadowColor="white";
      this.ctx.font = '40px BioRhyme';
      this.ctx.fillText(`SCORE: ${this.painter.currentScore}%`, 280, 300);
      this.ctx.fillText(`CLICK TO PLAY AGAIN!`, 180, 400);
      this.ctx.closePath();
      this.ctx.fill();
      cancelAnimationFrame(animationFrame);
    }
  }
}

Game.BG_COLOR = "#000000";
Game.DIM_X = 900;
Game.DIM_Y = 720;

/* harmony default export */ __webpack_exports__["default"] = (Game);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Game = __webpack_require__(0);

class Painter {
  constructor(canvas){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellSize = 15;
    document.addEventListener('keydown', this.keyDown.bind(this), false);

    this.keyPress = {
      rightPressed: false,
      leftPressed: false,
      upPressed: false,
      downPressed: false,
    };

    this.x = this.cellSize * Math.floor((Math.random() * (this.width / this.cellSize)));
    this.y = this.cellSize * Math.floor((Math.random() * (this.height / this.cellSize)));
    this.painted = [
      [this.x, this.y],
      [this.x + this.cellSize, this.y],
      [this.x + this.cellSize, this.y + this.cellSize],
      [this.x - this.cellSize, this.y + this.cellSize],
      [this.x, this.y + this.cellSize],
      [this.x - this.cellSize, this.y],
      [this.x - this.cellSize, this.y - this.cellSize],
      [this.x + this.cellSize, this.y - this.cellSize],
      [this.x, this.y - this.cellSize]
    ];
    this.trail = [];
    this.conquered = [];
    this.dead = false;
    this.currentScore = 0;
    this.won = false;
  }

  keyDown(e) {

    if (e.keyCode >= 37 && e.keyCode <= 40) {
      this.keyPress.rightPressed = false;
      this.keyPress.leftPressed = false;
      this.keyPress.upPressed = false;
      this.keyPress.downPressed = false;
      switch(e.keyCode) {
        case 37:
        this.keyPress.leftPressed = true;
        break;
        case 38:
        this.keyPress.downPressed = true;
        break;
        case 39:
        this.keyPress.rightPressed = true;
        break;
        case 40:
        this.keyPress.upPressed = true;
        break;
      }
    }
  }

  move() {
    if (this.keyPress.leftPressed) {
      this.x -= this.cellSize;
      if (!(this.x > 0 && this.x < this.width)) {
        this.keyPress.leftPressed = false;
      }

    } else if (this.keyPress.downPressed) {
      this.y -= this.cellSize;
      if (!(this.y > 0 && this.y < this.height)) {
        this.keyPress.downPressed = false;
      }

    } else if (this.keyPress.rightPressed) {
      this.x += this.cellSize;
      if (!(this.x > 0 && this.x < this.width - this.cellSize)) {
        this.keyPress.rightPressed = false;
      }

    } else if (this.keyPress.upPressed) {
      this.y += this.cellSize;
      if (!(this.y > 0 && this.y < this.height - this.cellSize)) {
        this.keyPress.upPressed = false;
      }

    }

    if (this.currentScore >= 100) {
      this.won = true;
    }

    if ((this.painted.find(el => el[0] === this.x
      && el[1] === this.y) === undefined)
      && (this.trail.find(el => el[0] === this.x
        && el[1] === this.y) === undefined)) {
          this.trail_safe = false;
          this.trail.push([this.x, this.y]);
        } else if (Boolean(this.trail.find(el => el[0] === this.x
          && el[1] === this.y))) {
            this.currentScore = this.score();
            this.dead = true;
          } else {
            this.conquered = this.trail.slice();
            this.painted = this.painted.concat(this.trail);
            this.trail = [];
            this.painted = this.sortCoords(this.painted);
            this.painted = this.mapAllCoords(this.painted);
            this.fillTrail();
            this.currentScore = this.score();
          }
  }

  drawCurrentPos(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.cellSize, this.cellSize);
    ctx.fillStyle="#4DA469";
    ctx.closePath();
    ctx.fill();
  }

  draw(ctx) {

    ctx.beginPath();
    this.trail.forEach( (coord, idx) => {
      ctx.fillStyle="#86e0be";
      ctx.fillRect(coord[0], coord[1], this.cellSize, this.cellSize);
    });
    this.painted.forEach( coord => {
      ctx.fillStyle="#4DA469";
      ctx.rect(coord[0], coord[1], this.cellSize, this.cellSize);
    });
    ctx.closePath();
    ctx.fill();
  }

  sortCoords(arr){
    let sorted = arr.slice();

    const funcSort = (x,  y) => {
      return (x[0] - y[0] || x[1] - y[1]) ;
    };

    sorted = sorted.sort(funcSort);
    return sorted;
  }



  mapAllCoords(sortedArr) {
    let newArr = sortedArr.slice();
    newArr.slice(0, sortedArr.length - 1).forEach( (coord, idx) => {
      if ((newArr[idx][0] === newArr[idx + 1][0])
        && (newArr[idx][1] !== (newArr[idx + 1][1]) - this.cellSize)) {
          newArr.splice(
            (idx + 1), 0, [newArr[idx][0], newArr[idx][1] + this.cellSize]
          );
        }
    });
    return newArr;
  }

  score(){
    return (this.painted.length /
      (this.height * this.width /
        (this.cellSize * this.cellSize)) * 100).toFixed(2);
  }

  won(){
    this.won = (this.score() >= 100);
  }

  trail(){
    return this.trail;
  }


  fillTrail(){
    if (this.conquered.length > 1){
      let arr = this.conquered.slice();
      let cornerPt = [arr[0][0], arr[arr.length-1][1]];
      let missingPts = [];
      let trailHash = {};
      arr.forEach( (coord) => {
        trailHash[parseInt(coord[0])] = trailHash[parseInt(coord[0])] || [];
        trailHash[parseInt(coord[0])].push(coord[1]);
      });

    }

  }
}


/* harmony default export */ __webpack_exports__["a"] = (Painter);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(0);


document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = __WEBPACK_IMPORTED_MODULE_0__game__["default"].DIM_X;
  canvasEl.height = __WEBPACK_IMPORTED_MODULE_0__game__["default"].DIM_Y;

  let game;
  const ctx = canvasEl.getContext("2d");
  game = new __WEBPACK_IMPORTED_MODULE_0__game__["default"](canvasEl, ctx);
  canvasEl.addEventListener('click', () => {
    if (game.painter.dead || game.painter.won) {
      game = new __WEBPACK_IMPORTED_MODULE_0__game__["default"](canvasEl, ctx);
      game.start();
    }
  });
  game.start();
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Grid {
  constructor(options){
    this.canvas = options.canvas;
    this.cols = 40;
    this.rows = 24;
  }

  draw(ctx) {
    ctx.shadowBlur=0.5;
    ctx.shadowColor="black";
    ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    ctx.stroke();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Grid);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__painter__ = __webpack_require__(1);



class Enemy {
  constructor(canvas, painter){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellSize = 15;

    this.x = this.cellSize * Math.floor((Math.random() * (this.width / this.cellSize)));
    this.y = this.cellSize * Math.floor((Math.random() * (this.height / this.cellSize)));

    this.painter = painter;
    this.kill = false;
  }

  move(){
    let moves = [
      [0, this.cellSize],
      [this.cellSize, 0],
      [0, -this.cellSize],
      [-this.cellSize, 0]
    ];

    let nextMove = moves[Math.floor(Math.random() * moves.length)];

    if (
      (this.x + nextMove[0]) > 0 && ((this.x + nextMove[0]) < this.width)
      &&
      (this.y + nextMove[1]) > 0 && ((this.y + nextMove[1]) < this.height)
    ) {
      this.x += nextMove[0];
      this.y += nextMove[1];
      if (!(this.painter.trail.find(el => el[0] === this.x
        && el[1] === this.y) === undefined) ||
        (this.x === this.painter.x && this.y === this.painter.y)) {
          this.painter.dead = true;
          this.painter.currentScore = this.painter.score();
        }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.shadowBlur=10;
    ctx.shadowColor="black";
    ctx.rect(this.x, this.y, this.cellSize, this.cellSize);
    ctx.fillStyle="black";
    ctx.closePath();
    ctx.fill();
  }
}
/* harmony default export */ __webpack_exports__["a"] = (Enemy);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map