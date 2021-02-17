import { UI } from './ui.js';
import { Grid } from './grid.js';
import { Algorithms } from './algorithms.js';
import { Node } from './node.js';

export class PathFinder {
  constructor() {
    this.initVariables();
    this.generateGrid();
    this.initNodes();
    this.addListeners();
    this.grid.setNeighbours();
  }

  initVariables() {
    this.ui = new UI();
    this.rows = this.ui.rows;
    this.columns = this.ui.columns;

    this.grid = new Grid(this.rows, this.columns);
    this.nodes = this.grid.nodes;

    this.algo = new Algorithms();
  }

  generateGrid() {
    for(let i = 0; i < this.rows; i++) {
      const nodeRow = [];
      const elemRow = document.createElement('div');
      elemRow.className = 'grid__row';
      for(let j = 0; j < this.columns; j++) {
        const id = this.idFromValues(i, j);

        const elem = document.createElement('span');
        elem.className = 'node';
        elem.dataset.id = id;
        elemRow.append(elem);

        const node = new Node(elem, id);
        nodeRow.push(node);
      }
      this.ui.board.append(elemRow);
      this.nodes.push(nodeRow);
    }
  }

  locationFromId(id) {
    let str = id.split('-');
    let location = {x: parseInt(str[0]), y: parseInt(str[1])};
    return location;
  }

  idFromLocation(location) {
    return location.x + '-' + location.y;
  }

  idFromValues(x, y) {
    return x + '-' + y;
  }

  nodeFromId(id) {
    let location = this.locationFromId(id);
    return this.nodes[location.x][location.y];
  }

  nodeFromValues(x, y) {
    return this.nodes[x][y];
  }

  nodeFromElem(elem) {
    let id = elem.dataset.id;
    return this.nodeFromId(id);
  }

  elemFromId(id) {
    let location = this.locationFromId(id);
    return this.nodes[location.x][location.y].elem;
  }

  elemFromValues(x, y) {
    return this.nodes[x][y].elem;
  }

  initNodes() {
    let rowMiddle = parseInt(this.rows / 2 - 1);
    let columnStart = parseInt(this.columns / 4);
    let columnEnd = parseInt(this.columns - this.columns / 4);
    this.setStartNode(rowMiddle, columnStart);
    this.setEndNode(rowMiddle, columnEnd);
  }

  setStartNode(x, y) {
    this.grid.startNode = this.nodes[x][y];
    this.grid.startNode.elem.innerHTML = '<i id="starticon" class="fa fa-chevron-right fa-lg" aria-hidden="true" draggable="true"></i>';
  }

  setEndNode(x, y) {
    this.grid.endNode = this.nodes[x][y];
    this.grid.endNode.elem.innerHTML = '<i id="endicon" class="fa fa-dot-circle-o fa-lg" aria-hidden="true" draggable="true"></i>';
  }

  removeStartNode() {
    this.grid.startNode.elem.innerHTML = '';
    this.grid.startNode = null;
  }

  removeEndNode() {
    this.grid.endNode.elem.innerHTML = '';
    this.grid.endNode = null;
  }

  async addListeners() {
    this.ui.dropDownItems.forEach(item => {
      this.addDropDownItemListener(item);
    });

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        this.addObstacleListener(i, j);
      }
    }

    this.ui.visualize.onclick = (e) => this.startVisualization(this);
  }

  addDropDownItemListener(item) {
    item.onclick = (e) => {
      let span = e.target.parentElement.previousElementSibling.querySelector('span');
      let value = e.target.value;
      span.textContent = value;

      value = value.toLowerCase();
      if(span.id == 'algo-value')
        this.ui.algorithm = value;
      else if(span.id == 'speed-value')
        this.ui.speed = this.ui.SPEED_LIST[value];
      else {
        this.ui.obstacle = value;
        if(e.target.dataset.type == 'clear') {
          this.clearObstacles(value);
        }
      }
    }
  }

  clearObstacles(obstacle) {
    for(let i = 0; i < this.rows; i++)
      for(let j = 0; j < this.columns; j++) {
        this.clearObstacle(i, j, obstacle);
      }
  }

  clearObstacle(x, y, obstacle) {
    if(obstacle == 'wall') {
      this.clearWall(x, y);
    } else if(obstacle == 'weight'){
      this.clearWeight(x, y);
    } else if(obstacle == 'path') {
      this.clearPath(x, y);
    } else if(obstacle == 'all') {
      this.clearWall(x, y);
      this.clearWeight(x, y);
      this.clearPath(x, y);
    }
  }

  clearWall(x, y) {
    if(!this.nodes[x][y].isWall)
      return;
    this.nodes[x][y].isWall = false;
    this.nodes[x][y].elem.className = 'node';
  }

  clearWeight(x, y) {
    if(this.nodes[x][y].weight == 1)
      return;
    this.nodes[x][y].isWeight = 1;
    this.nodes[x][y].elem.innerHTML = '';
  }

  clearPath(x, y) {
    if(this.nodes[x][y].isWall || !this.nodes[x][y].visited)
      return;
    this.nodes[x][y].visited = false;
    this.nodes[x][y].elem.className = 'node';
  }

  addObstacleListener(x, y) {
    let elem = this.elemFromValues(x, y);
    elem.onclick = (e) => {
      this.addObstacle(x, y);
    };
  }

  addObstacle(x, y) {
    let node = this.nodeFromValues(x, y);
    if(this.isStartNode(node) || this.isEndNode(node))
      return;
    if(this.ui.obstacle == 'wall') {
      this.addWall(x, y);
    } else {
      this.addWeight(x, y);
    }
  }

  addWall(x, y) {
    if(this.nodes[x][y].isWall)
      return;
    if(this.nodes[x][y].weight > 1)
      this.clearWeight(x, y);
    if(this.nodes[x][y].visited)
      this.clearPath(x, y);
    this.nodes[x][y].isWall = true;
    this.nodes[x][y].elem.classList.add('wall');
  }

  addWeight(x, y) {
    if(this.nodes[x][y].weight > 1)
      return;
    if(this.nodes[x][y].isWall)
      this.clearWall(x, y);
    if(this.nodes[x][y].visited)
      this.clearPath(x, y);
    this.nodes[x][y].weight = this.grid.NODE_WEIGHT;
    this.nodes[x][y].elem.innerHTML = '<i class="fa fa-lg fa-lock" aria-hidden="true"></i>';
  }

  isStartNode(node) {
    return this.grid.startNode.id === node.id;
  }

  isEndNode(node) {
    return this.grid.endNode.id === node.id;
  }

  async startVisualization() {
    this.ui.visualize.disabled = true;
    this.ui.visualize.classList.add('wait');
    this.clearObstacles('path');
    await this.algo.runAlgorithm(this.ui, this.grid, this.grid.startNode, this.grid.endNode, true);
  }
}
