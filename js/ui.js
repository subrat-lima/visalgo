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

  sleep() {
    return new Promise(resolve => setTimeout(resolve, this.speed));
  }
}
