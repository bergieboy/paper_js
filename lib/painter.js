const Game = require("./game");

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


export default Painter;
