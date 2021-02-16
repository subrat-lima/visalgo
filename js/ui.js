import { Node } from './node.js';
import { Algorithms } from './algorithms.js';

export class UI {
  constructor() {
    //this.addElem = 'Walls';
    this.initVariables();
    this.domElements();
    this.setGridSize();
    this.addEventListeners();
  }

  initVariables() {
    this.SPEED_LIST = {'instant': 0, 'fast': 25, 'average': 50, 'slow': 100};

    this.animate = true;
    this.algorithm = 'bfs';
    this.obstacle = 'wall';
    this.speed = 'fast';
  }

  domElements() {
    this.grid = document.getElementById('grid');
    this.visualize = document.getElementById('visualize');

    this.dropDownItems = Array.from(document.getElementsByClassName('dropdown__item'));


  };


  clearWalls(grid) {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        grid.nodes[i][j].wall = false;
        grid.nodes[i][j].visited = false;
        this.removeElementType(grid.nodes[i][j].elem, 'visited');
        this.removeElementType(grid.nodes[i][j].elem, 'shortest');
        this.removeElementType(grid.nodes[i][j].elem, 'wall');
      }
    }
  }

  clearWeights(grid) {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        if(grid.nodes[i][j].weight > 1)
          grid.nodes[i][j].elem.innerHTML = '';
        grid.nodes[i][j].weight = 1;
        grid.nodes[i][j].visited = false;
        this.removeElementType(grid.nodes[i][j].elem, 'visited');
        this.removeElementType(grid.nodes[i][j].elem, 'shortest');
      }
    }
  }

  clearObstacle(grid) {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        let node = grid.nodes[i][j];
        if(this.obstacle == 'wall') {
          if(node.wall) {
            grid.nodes[i][j].wall = false;
            this.removeElementType(node.elem, 'wall');
          }
        } else {
          if(node.weight > 1) {
            grid.nodes[i][j].weight = 1;
            node.elem.innerHTML = '';
          }
          if(node.visited) {
            grid.nodes[i][j].visited = false;
            this.removeElementType(node.elem, 'visited');
            this.removeElementType(node.elem, 'shortest');
          }
        }
      }
    }
  }

  clearPaths(grid) {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        grid.nodes[i][j].visited = false;
        grid.nodes[i][j].elem.removeAttribute('data-prev');
        this.removeElementType(grid.nodes[i][j].elem, 'visited');
        this.removeElementType(grid.nodes[i][j].elem, 'visited-animate');
        this.removeElementType(grid.nodes[i][j].elem, 'shortest');
        this.removeElementType(grid.nodes[i][j].elem, 'shortest-animate');
      }
    }
  }

  async addGridModifierListeners(grid) {

    this.startNode = document.getElementById('starticon');
    this.endNode = document.getElementById('endicon');

    this.startNode.ondragstart = this.drag;
    this.endNode.ondragstart = this.drag;

    /*
    this.clearWall.onclick = (e) => {
      this.gridContent.classList.toggle('show');
      this.clearWalls(grid);
    };

    this.clearWeight.onclick = (e) => {
      this.gridContent.classList.toggle('show');
      this.clearWeights(grid);
    };

*/
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        let elem = grid.nodes[i][j].elem;
        elem.ondrop = async (e) => await this.drop(e, grid);
        elem.ondragover = this.allowDrop;
        elem.onclick = (e) => {
          if(this.obstacle == 'wall') {
            grid.nodes[i][j].wall = true;
            this.setElementType(elem, 'wall');
          } else {
            grid.nodes[i][j].weight = 5;
            elem.innerHTML = '<i class="fa fa-lg fa-lock" aria-hidden="true"></i>';
            this.setElementType(elem, 'weight');
          }
        };
      }
    }

    this.dropDownItems.forEach(item => {
      item.onclick = (e) => {
        let span = e.target.parentElement.previousElementSibling.querySelector('span');
        let value = e.target.value;
        span.textContent = value;

        if(span.id == 'algo-value')
          this.algorithm = value.toLowerCase();
        else if(span.id == 'speed-value')
          this.speed = this.SPEED_LIST[value.toLowerCase()];
        else {
          this.obstacle = value.toLowerCase();
          if(e.target.dataset.type == 'clear') {
            this.clearObstacle(grid);
          }
        }
      };
    });
  }


  addEventListeners() {


  }

  allowDrop(e) {
    e.preventDefault();
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

  addNodeListener(elem) {
  }


  setGridSize() {
    this.columns = this.getNodeSize(window.innerWidth * .7);
    this.rows = this.getNodeSize(window.innerHeight * .6);
  }

  drawGrid() {
    let nodes = [];
    for(let i = 0; i < this.rows; i++) {
      const nodeRow = [];
      const elemRow = document.createElement('div');
      elemRow.classList.add('grid__row');
      for(let j = 0; j < this.columns; j++) {
        const elem = document.createElement('span');
        elem.classList.add('node');
        let nodeId = `${i}-${j}`;
        elem.setAttribute('data-id', nodeId);
        elemRow.appendChild(elem);
        this.addNodeListener(elem);

        let node = new Node(elem, nodeId);
        nodeRow.push(node);
      }
      this.grid.appendChild(elemRow);
      nodes.push(nodeRow);
    }
    return nodes;
  }

  getNodeSize(distance) {
    let size = parseInt(distance / 20);
    return Math.min(size, 60);
  }

  coOrdinateToId(position) {
    return `${position.x}-${position.y}`;
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
