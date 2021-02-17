import { Node } from './node.js';

export class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.nodes = [];
    this.startNode = null;
    this.endNode = null;
    this.NODE_WEIGHT = 5;
  }


  areNodeEquals(a, b) {
    return a.id == b.id;
  }

  setNeighbours() {
    const paths = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        const neighbours = [];
        paths.forEach(path => {
          let neighbour = {x: path[0] + i, y: path[1] + j};
          if(this.isValidNode(neighbour))
            neighbours.push(this.nodes[neighbour.x][neighbour.y]);
        });
        this.nodes[i][j].addNeighbours(neighbours);
      }
    }
  }

  isValidNode(node) {
    if(node.x < 0 || node.y < 0 || node.x >= this.rows || node.y >= this.columns)
      return false;
    return true;
  }

}
