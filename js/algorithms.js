import { bfs } from './bfs.js';
import { dfs } from './dfs.js';
import { dijkstra } from './dijkstra.js';
import { astar } from './astar.js';

/**
 * Purpose: Choose the selected algorithm, tracePath and visualize it
 */
export class Algorithms {
  // execute the algorithm
  async runAlgorithm(ui, grid, start, end, animate) {
    let found;

    // choose the right algorithm
    switch(ui.algorithm) {
      case 'bfs':
        found = await bfs(ui, grid, start, end, animate);
        break;
      case 'dfs':
        found = await dfs(ui, grid, start, end, animate);
        break;
      case 'dijkstra':
        found = await dijkstra(ui, grid, start, end, animate);
        break;
      case 'a*':
        found = await astar(ui, grid, start, end, animate);
        break;
    }

    // if path found, trace path and visualize it
    if(found) {
      let path = this.tracePath(grid, start, end);
      await this.printPath(ui, path, animate);
    }
    ui.visualize.disabled = false;
    ui.visualize.classList.remove('wait');
  }

  // trace path
  tracePath(grid, start, end) {
    // initialize path and add the end
    let path = [];
    let current = end;
    path.push(current);

    // loop till starting node reached
    // for every node find the previous / parent node
    // add it to the path
    while(!grid.areNodeEquals(current, start)) {
      let parentId = current.elem.getAttribute('data-prev');
      let location = parentId.split('-');
      current = grid.nodes[location[0]][location[1]];
      path.push(current);
    }
    return path;
  }

  // visualize path
  async printPath(ui, path, animate) {
    // as we started from end to start, loop in reverse order
    // and visualize each path
    for(let i = path.length - 1; i >= 0; i--) {

      // visualize
      ui.setElementType(path[i].elem, 'shortest');

      // animation
      if(animate) {
        ui.setElementType(path[i].elem, 'shortest-animate');
        await ui.sleep();
      }
    }
  }
}
