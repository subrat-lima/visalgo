// imports
import { UI } from './ui.js';
import { Grid } from './grid.js';
import { Algorithms } from './algorithms.js';

// declarations
const ui = new UI();
const algo = new Algorithms();
const grid = new Grid(ui.rows, ui.columns, ui.drawGrid());

grid.setStartNode(ui, grid.nodes[parseInt(ui.rows / 2)][parseInt(ui.columns / 3)]);
grid.setEndNode(ui, grid.nodes[parseInt(ui.rows / 2)][parseInt(ui.columns - ui.columns / 3)]);

ui.addGridModifierListeners(grid);


//let startElem = grid.getStartNode().elem;
//let endElem = grid.getEndNode().elem;

//ui.addDragDropEvent(startElem);

const visualize = ui.visualize;

visualize.onclick = async () => {
  ui.clearPaths(grid);
  await algo.runAlgorithm(ui, grid, grid.getStartNode(), grid.getEndNode(), ui.animate);
};
