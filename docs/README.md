## Tetris

### Background

Tetris is a classic game that involves fitting blocks together. You start with an empty grid, 10 by 20, and pieces that are different arrangements of four blocks fall continuously, one at a time. Once one piece hits the bottom, if there are any rows on the grid that are entirely occupied by pieces, that line disappears and any pieces above it fall to collapse the space, and the next piece starts falling.

### Functionality & MVP  

- [ ] Start, pause, and restart
- [ ] Have pieces fall continuously
- [ ] Clear lines when they're full of pieces
- [ ] Be able to rotate pieces

### Wireframes

The UI of Tetris will consist of one screen displaying the board. To the right of the board will be the controls, and to the left will be a link to the Github repository.

![wireframes](./tetris_wireframe.png)

### Architecture and Technologies

Tetris will be constructed using the following:

- Vanilla JavaScript
- `babel` to allow use of ES6 syntax
- Webpack to bundle the scripts.

Structure:

- main.js file where the tetris view is rendered onto the DOM
- tetris_view.js, where the larger game logic will be executed
- pieces folder containing [piece].js files, each of which has its own starting coordinates and toString() method, which returns its html `<li />`.

### Implementation Timeline

**Day 1**: Set up the groundwork, including webpack, the main.js file and the index.html file.

- Make square.js file. The Square class will take in a className.
- Construct 20 `<ul>`s, each with 10 `<li>`s, constructed from Square instances, and render them on the screen.
- Style the board so that it looks like Tetris

**Day 2**: Create a single piece class and implement the falling of the pieces.

- play() method
- window.setInterval for moving a piece down one row at a time.
- logic for when the piece should stop
  - helper methods to:
    - find what the lowest y coordinates are in the current falling piece
    - find the squares that are below those coordinates
    - check the classes of those squares

**Day 3**: Add the remaining piece classes and implement the logic for rotating them left and right.

- In the constructors, pieces will get their own classNames
- The toString() method will probably be:

```node
return <li ${this.className} />
```

- Turning logic, coordinate math

**Day 4**: Get rows to clear when they're filled with pieces.

- Look at the rows that the piece that just fell is occupying
- Look at the class names of the Squares in each row, and if none of them are `''`, clear the classes from all squares in that row
- Move any squares with piece classes that are above that row down one row.


### Bonus features

- [ ] Add levels (every 10 rows cleared, increase falling speed)
- [ ] Add a "hold piece" option, where if you don't like the piece that's falling, you can switch it with the piece that you're holding.
- [ ] Add "hard drop" option so that if you already know where you want a piece to go, you can make it fall to the bottom immediately.
