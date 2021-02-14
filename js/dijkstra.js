import { PriorityQueue } from './pqueue.js';

/**
 * Dijkstra Algorithm Implementation
 * @param ui: UI class for visualization
 * @param grid: Grid class for list of nodes
 * @param start: starting node
 * @param end: destination node
 * @param animate: to toggle animation for visualization
 * @return boolean: true if path found else false
 */
export const dijkstra = async (ui, grid, start, end, animate) => {
  // initialize priority queue
  let pqueue = new PriorityQueue();

  // declare and initialize minDistances
  const minDistances = [];
  initializeMinDistances(grid, minDistances);
  minDistances[start.getId()] = 0;

  // add start node to pqueue
  pqueue.enqueue(start, minDistances[start.getId()]);

  // loop until pqueue is empty
  while(!pqueue.isEmpty()) {

    // remove highest priority elem from pqueue
    let current = pqueue.dequeue();
    let node = current.data;
    let weight = current.priority;

    // set the node visited and visualize
    node.setVisited();
    ui.setElementType(node.elem, 'visited');

    // animation option
    if(animate) {
      await ui.sleep();
      ui.setElementType(node.elem, 'visited-animate');
    }

    // return true if destination node reached
    if(grid.areNodeEquals(node, end))
      return true;


    // get neighbours
    const neighbours = node.getNeighbours();

    neighbours.forEach(neighbour => {

      if(neighbour.isWall())
        return;

      // calculate distance to neighbour through current node
      let distance = weight + neighbour.weight;

      // update if the current distance is less than previous known distance
      if(distance < minDistances[neighbour.id]) {
        minDistances[neighbour.id] = distance;

        // add to pqueue
        pqueue.enqueue(neighbour, distance);

        // set parent node for neighbour to keep track of traversed path
        neighbour.elem.setAttribute('data-prev', node.id);
      }
    });
  }

  // path not found, so, return false
  return false;
}

// loop through the grid and for each node initialize minDistance to Infinity
const initializeMinDistances = (grid, minDistances) => {
  for(let i = 0; i < grid.rows; i++) {
    for(let j = 0; j < grid.columns; j++) {
      let id = grid.nodes[i][j].getId();
      minDistances[id] = Infinity;
    }
  }
}
