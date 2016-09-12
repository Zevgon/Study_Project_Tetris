class I {
  constructor (grid) {
    this.position = 'flat';
    this.coords = [[-1, 3], [-1, 4], [-1, 5], [-1, 6]];
    this.rotateLeft = this.rotateLeft.bind(this);
    this.grid = grid;
  }

  rotateLeft () {
    if (this.position === 'flat') {
      let first = [this.coords[0][0] - 1, this.coords[0][1] + 1];
      let second = this.coords[1];
      let third = [this.coords[2][0] + 1, this.coords[2][1] - 1];
      let fourth = [this.coords[3][0] + 2, this.coords[3][1] - 2];
      this.coords = [first, second, third, fourth];
      this.position = 'upright';
    } else {
      let first = [this.coords[0][0] + 1, this.coords[0][1] - 1];
      let second = this.coords[1];
      let third = [this.coords[2][0] - 1, this.coords[2][1] + 1];
      let fourth = [this.coords[3][0] - 2, this.coords[3][1] + 2];
      this.coords = [first, second, third, fourth];
      this.position = 'flat';
    }
  }
}

module.exports = I;
