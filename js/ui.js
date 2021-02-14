import { Node } from './node.js';

export class UI {
  constructor() {
    this.speed = {'0': 'instant', '25': 'fast', '50': 'average', '100': 'slow'};
    this.algoValues = {'bfs': 'BFS', 'dfs': 'DFS', 'dijkstra': 'Dijkstra', 'astar': 'A Star'};
    this.animate = true;
    this.animationSpeed = 25;
    this.algorithm = 'bfs';

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
    this.speedContent = document.getElementById('dropdown-speed');
    this.speedOptions = document.querySelectorAll('.speed-option');

    this.algoValue = document.getElementById('algo-value');
    this.speedValue = document.getElementById('speed-value');
    this.speedValue.innerHTML = this.speed[`${this.animationSpeed}`];
    this.algoValue.innerHTML = this.algoValues[this.algorithm];
  };

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

  addNodeListener(elem) {
    elem.ondragover = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    elem.ondrop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/html');
      e.target.appendChild(document.getElementById(data));
    };
  }

  addDragDropEvent(elem) {
    elem.ondragstart = (e) => {
      e.dataTransfer.setData('text/html', e.target.id);
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  setGridSize() {
    this.columns = this.getNodeSize(window.innerWidth * .8);
    this.rows = this.getNodeSize(window.innerHeight * .6);
  }

  drawGrid() {
    let nodes = [];
    const tbody = document.createElement('tbody');
    tbody.classList.add('grid-body');
    for(let i = 0; i < this.rows; i++) {
      const nodeRow = [];
      const elemRow = document.createElement('tr');
      elemRow.classList.add('grid__row');
      for(let j = 0; j < this.columns; j++) {
        const elem = document.createElement('td');
        elem.classList.add('node');
        let nodeId = `${i}-${j}`;
        elem.setAttribute('data-id', nodeId);
        elemRow.appendChild(elem);
        this.addNodeListener(elem);

        let node = new Node(elem, nodeId);
        nodeRow.push(node);
      }
      tbody.appendChild(elemRow);
      nodes.push(nodeRow);
    }
    this.grid.appendChild(tbody);
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
