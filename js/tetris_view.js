Array.prototype.inject = function (callback, acc) {
  let idx = 0;
  if (acc === undefined) {
    acc = this[0];
    idx += 1;
  }
  for (idx; idx < this.length; idx++) {
    acc = callback(acc, this[idx]);
  }

  return acc;
};

Array.prototype.flatten = function () {
  return this.inject((a, b) => {
    if (b instanceof Array) {
      return a.concat(b.flatten());
    } else {
      return a.concat(b);
    }
  }, []);
}

Array.prototype.any = function (callback) {
  let answer;
  this.forEach(el => {
    if (callback(el)) {
      answer = true;
    } else if (!callback(el) && answer === undefined) {
      answer = false;
    }
  });

  return answer;
}

Array.prototype.uniq = function (callback) {
  if (callback === undefined) {
    callback = el => el;
  }
  let answer = [];
  let callbackResults = [];
  this.forEach(el => {
    let callbackResult = callback(el);
    if (!callbackResults.includes(callbackResult)) {
      callbackResults.push(callbackResult);
      answer.push(el);
    }
  });

  return answer;
}

Array.prototype.myIncludes = function (callback) {
  let answer = false;
  this.forEach(el => {
    if (callback(el)) {
      answer = true;
    }
  });

  return answer;
}


function merge (arr1, arr2, callback) {
  if (callback === undefined) {
    callback = function (x, y) {
      if (x < y) {
        return -1;
      } else if (x === y) {
        return 0;
      } else {
        return 1;
      }
    };
  }

  let result = [];
  while ((arr1.length !== 0) && (arr2.length !== 0)) {
    if (callback(arr1[0], arr2[0]) < 0) {
      result.push(arr1.shift());
    } else {
      result.push(arr2.shift());
    }
  }

  return result.concat(arr1).concat(arr2);
}

Array.prototype.mergeSort = function (callback) {
  if (this.length <= 1) {
    return this;
  }

  let half = Math.floor(this.length / 2);
  let left = this.slice(0, half);
  let right = this.slice(half);

  let sortedLeft = left.mergeSort(callback);
  let sortedRight = right.mergeSort(callback);

  return merge(sortedLeft, sortedRight, callback);
};

const I = require('./pieces/i.js');
const Square = require('./square.js');

class TetrisView {
  constructor() {
    this.el = document.getElementById('tetris-game');
    this.updateClasses = this.updateClasses.bind(this);
    this.fall = this.fall.bind(this);
    this.fallenPieces = [];
    for (let i = 0; i < 10; i++) {
    }
    this.allPieces = this.fallenPieces.concat(this.currentPiece);
    this.constructBoard();
    let piece1 = new I(this.grid);
    this.currentPiece = piece1;
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.clearLines = this.clearLines.bind(this);
    this.startEventListeners = this.startEventListeners.bind(this);
    this.startEventListeners();
    this.relevantCoords = this.relevantCoords.bind(this);
    this.render();
  }

  constructBoard () {
    let grid = [];
    for (let i = 0; i < 20; i++) {
      let row = [];
      for (let j = 0; j < 10; j++) {
        row.push(new Square(''));
      }
      grid.push(row);
    }

    this.grid = grid;
  }

  play () {
    this.timerId = window.setInterval(() => {
      this.fall();
      this.allPieces = this.fallenPieces.concat(this.currentPiece);
      this.constructBoard();
      this.updateClasses();
      this.render();
      let stop = false;
      let coordsDup = [];
      this.currentPiece.coords.forEach(coord => coordsDup.push(coord));
      let relevantCoords = this.relevantCoords();
      let squaresBelow = relevantCoords.map(coord => [coord[0] + 1, coord[1]]);
      let grid = this.grid;
      squaresBelow.forEach(square => {
        if ((square[0] === 20) || (grid[square[0]][square[1]].className !== '')) {
          stop = true;
        }
      });
      if (stop) {
        this.fallenPieces.push(this.currentPiece);
        this.clearLines();
        this.currentPiece = new I(this.grid);
      }
    }, 200);
  }

  relevantCoords () {
    let answer = [];
    this.currentPiece.coords.forEach(coord => {
      if (answer.myIncludes(savedCoord => savedCoord[1] === coord[1])) {
        let savedCoord = answer.find(answerCoord => coord[1] === answerCoord[1]);
        if (coord[0] > savedCoord[0]) {
          let answerIdx = answer.indexOf(savedCoord);
          answer.splice(answerIdx, 1, coord);
        }
      } else {
        answer.push(coord);
      }
    });

    return answer;
  }

  startEventListeners () {
    document.addEventListener('keydown', event => {
      if (event.key == 'ArrowLeft') {
        this.removeCurrentPieceClasses();
        this.moveLeft();
        this.updateClasses();
        this.render();
      } else if (event.key == 'ArrowRight') {
        this.removeCurrentPieceClasses();
        this.moveRight();
        this.updateClasses();
        this.render();
      } else if (event.key == 'z') {
        this.removeCurrentPieceClasses();
        this.currentPiece.rotateLeft();
        this.updateClasses();
        this.render();
      } else if (event.key == 'p') {
        window.clearInterval(this.timerId);
      } else if (event.key == 's') {
        this.play();
      }
    });
  }

  moveLeft () {
    let skip = this.currentPiece.coords.any(coord => coord[1] === 0);
    if (!skip) {
      let newCoords = [];
      this.currentPiece.coords.forEach(coord => {
        newCoords.push([coord[0], coord[1] - 1])
      });
      this.currentPiece.coords = newCoords;
    }
  }

  moveRight () {
    let skip = this.currentPiece.coords.any(coord => coord[1] === 9);
    if (!skip) {
      let newCoords = [];
      this.currentPiece.coords.forEach(coord => {
        newCoords.push([coord[0], coord[1] + 1])
      });
      this.currentPiece.coords = newCoords;
    }
  }

  clearLines () {
    let currentPieceYs = this.currentPiece.coords.map(coord => coord[0]).uniq();
    let grid = this.grid;
    currentPieceYs.forEach(y => {
      let remove = !grid[y].any(square => square.className === '');
      if (remove) {
        grid[y].forEach(square => square.removeClass());
        // grid[y] = grid[y].map(square => square.removeClass());
      }
    });
    this.grid = grid;
  }

  isAbove (coord1, coord2) {
    if ((coord1[0] === coord2[0] - 1) && (coord1[1] === coord2[1])) {
      return true;
    } else {
      return false;
    }
  }

  fall () {
    const updatedCoords = [];
    this.currentPiece.coords.forEach(coord => {
      updatedCoords.push([coord[0] + 1, coord[1]]);
    });

    this.currentPiece.coords = updatedCoords;
  }

  updateClasses () {
    this.allPieces.forEach(piece => {
      piece.coords.forEach(coord => {
        this.grid[coord[0]][coord[1]] = new Square('piece');
      });
    });
  }

  removeCurrentPieceClasses () {
    this.currentPiece.coords.forEach(coord => {
      this.grid[coord[0]][coord[1]] = new Square('');
    });
  }

  render () {
    this.html = '';
    this.grid.forEach(row => {
      let htmlRow = row.map(square => square.html);
      this.html += '<ul>'
      this.html += htmlRow.join('');
      this.html += '</ul>'
    });
    this.el.innerHTML = this.html;
  }
}

module.exports = TetrisView;
