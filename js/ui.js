import { Node } from './node.js';
import { Algorithms } from './algorithms.js';

export class UI {
  constructor() {
    this.initVariables();
    this.initDOM();
    this.setGridSize();
  }

  initVariables() {
    this.SPEED_LIST = {'instant': 0, 'fast': 25, 'average': 50, 'slow': 100};
    this.NODE_SIZE = 25;
    this.MAX_NODES = 50;

    this.animate = true;
    this.algorithm = 'bfs';
    this.obstacle = 'wall';
    this.speed = 'fast';
    this.addObstacle = false;
  }

  initDOM() {
    this.board = document.getElementById('grid');
    this.visualize = document.getElementById('visualize');

    this.dropDownItems = Array.from(document.getElementsByClassName('dropdown__item'));
  }

  setGridSize() {
    this.columns = this.totalPossibleNodes(window.innerWidth * .85);
    this.rows = this.totalPossibleNodes(window.innerHeight * .75);
  }

  totalPossibleNodes(distance) {
    let size = parseInt(distance / this.NODE_SIZE);
    return Math.min(size, this.MAX_NODES);
  }

  /*
   * Clean code
   */

  async addGridModifierListeners(grid) {

    this.startNode = document.getElementById('starticon');
    this.endNode = document.getElementById('endicon');

    this.startNode.ondragstart = this.drag;
    this.endNode.ondragstart = this.drag;

    this.grid.onmousedown = (e) => {
      this.addObstacle = true;
      console.log('active');
    };

    this.grid.onmouseup = (e) => {
      this.addObstacle = false;
      console.log('deactive');
    }

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        let elem = grid.nodes[i][j].elem;
        //elem.ondrop = async (e) => await this.drop(e, grid);
        elem.ondragover = async (e) => await this.allowDrop(e, grid);
      }
    }
  }

  async allowDrop(e, grid) {
    e.preventDefault();
    let data = e.dataTransfer.getData('text/html');
    e.target.appendChild(document.getElementById(data));
    let id = e.target.getAttribute('data-id');
    let loc = id.split('-');
    let enode = grid.endNode;
    if(data == 'starticon')
      grid.startNode = grid.nodes[loc[0]][loc[1]];
    else if(data == 'endicon')
      grid.endNode = grid.nodes[loc[0]][loc[1]];
    if(enode.isVisited) {
      this.clearPaths(grid);
      const algo = new Algorithms();
      await algo.runAlgorithm(this, grid, grid.getStartNode(), grid.getEndNode(), false);
    }
  }

  drag(e) {
    e.dataTransfer.setData('text/html', e.target.id)
  }

  async drop(e, grid) {
    e.preventDefault();
    let data = e.dataTransfer.getData('text/html');
    e.target.appendChild(document.getElementById(data));
    let id = e.target.getAttribute('data-id');
    let loc = id.split('-');
    let enode = grid.endNode;
    if(data == 'starticon')
      grid.startNode = grid.nodes[loc[0]][loc[1]];
    else if(data == 'endicon')
      grid.endNode = grid.nodes[loc[0]][loc[1]];
    if(enode.isVisited) {
      this.clearPaths(grid);
      const algo = new Algorithms();
      await algo.runAlgorithm(this, grid, grid.getStartNode(), grid.getEndNode(), false);
    }
  }

  setElementType(elem, className) {
    elem.classList.add(className);
  }

  removeElementType(elem, className) {
    elem.classList.remove(className);
  }

  sleep() {
    return new Promise(resolve => setTimeout(resolve, this.speed));
  }
}
