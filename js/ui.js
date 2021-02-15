import { Node } from './node.js';

export class UI {
  constructor() {
    this.speed = {'0': 'Instant', '25': 'Fast', '50': 'Average', '100': 'Slow'};
    this.algoValues = {'bfs': 'BFS', 'dfs': 'DFS', 'dijkstra': 'Dijkstra', 'astar': 'A Star'};
    this.animate = true;
    this.animationSpeed = 25;
    this.algorithm = 'astar';
    this.addElem = 'Walls';

    this.domElements();
    this.setGridSize();
    this.addEventListeners();
  }

  domElements() {
    this.grid = document.getElementById('grid');
    this.visualize = document.getElementById('visualize');
    this.algoOptions = document.querySelectorAll('.algo-option');
    this.algoBtn = document.getElementById('algo-btn');
    this.algoContent = document.getElementById('dropdown-algo');
    this.gridContent = document.getElementById('dropdown-grid');
    this.speedBtn = document.getElementById('speed-btn');
    this.gridBtn = document.getElementById('grid-btn');
    this.speedContent = document.getElementById('dropdown-speed');
    this.speedOptions = document.querySelectorAll('.speed-option');

    this.algoValue = document.getElementById('algo-value');
    this.gridValue = document.getElementById('grid-value');
    this.speedValue = document.getElementById('speed-value');
    this.speedValue.innerHTML = this.speed[`${this.animationSpeed}`];
    this.algoValue.innerHTML = this.algoValues[this.algorithm];
    this.gridValue.innerHTML = this.addElem;

    this.clearWall = document.getElementById('clear-wall');
    this.clearWeight = document.getElementById('clear-weight');
    this.addWalls = document.getElementById('add-walls');
    this.addWeights = document.getElementById('add-weights');

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

  addGridModifierListeners(grid) {

    this.startNode = document.getElementById('starticon');
    this.endNode = document.getElementById('endicon');

    this.startNode.ondragstart = this.drag;
    this.endNode.ondragstart = this.drag;

    this.clearWall.onclick = (e) => {
      this.gridContent.classList.toggle('show');
      this.clearWalls(grid);
    };

    this.clearWeight.onclick = (e) => {
      this.gridContent.classList.toggle('show');
      this.clearWeights(grid);
    };

    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.columns; j++) {
        let elem = grid.nodes[i][j].elem;
        elem.ondrop = (e) => this.drop(e, grid);
        elem.ondragover = this.allowDrop;
        elem.onclick = (e) => {
          if(this.addElem == 'Walls') {
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

  }

  addEventListeners() {
    this.algoBtn.onclick = (e) => {
      this.algoContent.classList.toggle('show');
    };

    for(let option of this.algoOptions) {
      option.onclick = (e) => {
        this.algorithm = e.target.getAttribute('data-value');

        this.algoValue.innerHTML = this.algoValues[this.algorithm];
        this.algoContent.classList.toggle('show');
      }
    }

    this.gridBtn.onclick = (e) => {
      this.gridContent.classList.toggle('show');
    }

    this.addWalls.onclick = (e) => {
      this.gridContent.classList.toggle('show');
      this.addElem = 'Walls';
      this.gridValue.innerHTML = this.addElem;
    };

    this.addWeights.onclick = (e) => {
      this.gridContent.classList.toggle('show');
      this.addElem = 'Weights';
      this.gridValue.innerHTML = this.addElem;
    };

    this.speedBtn.onclick = (e) => {
      this.speedContent.classList.toggle('show');
    }

    this.speedOptions.forEach(speed => {
      speed.onclick = (e) => {
        let value = e.target.getAttribute('data-value');
        if(value == 0)
          this.animate = false;
        else
          this.animate = true;
        this.animationSpeed = parseInt(value);
        this.speedValue.innerHTML = this.speed[value];
        this.speedContent.classList.toggle('show');
      }
    });
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drag(e) {
    e.dataTransfer.setData('text/html', e.target.id)
  }

  drop(e, grid) {
    e.preventDefault();
    let data = e.dataTransfer.getData('text/html');
    e.target.appendChild(document.getElementById(data));
    let id = e.target.getAttribute('data-id');
    let loc = id.split('-');
    if(data == 'starticon')
      grid.startNode = grid.nodes[loc[0]][loc[1]];
    else if(data == 'endicon')
      grid.endNode = grid.nodes[loc[0]][loc[1]];
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
    return new Promise(resolve => setTimeout(resolve, this.animationSpeed));
  }
}
