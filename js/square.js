class Square {
  constructor (className) {
    this.className = className;
    this.html = `<li class=${this.className} />`;
  }

  removeClass () {
    this.className = '';
    this.html =  '<li class="" />';
  }
}

module.exports = Square;
