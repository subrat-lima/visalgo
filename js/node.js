/**
 * Node Class
 */
export class Node {
  constructor(elem, id) {
    // make a node wall or path
    this.isWall = false;

    // to keep track of visited nodes
    this.visited = false;

    // for variable weghts in dijkstra algorithm
    this.weight = 1;

    // reference of the corresponding node dom element
    this.elem = elem;

    // id refering to the x and y coordinate of grid
    this.id = id;

    // list of neighbours
    this.neighbours = [];
  }

 addNeighbours(neighbours) {
    this.neighbours = [...neighbours];
  }
}
