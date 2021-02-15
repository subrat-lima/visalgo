import { PriorityQueue } from './pqueue.js';

/**
 * A Star Algorithm Implementation
 * @param ui: UI class for visualization
 * @param grid: Grid class for list of nodes
 * @param start: starting node
 * @param end: destination node
 * @param animate: to toggle animation for visualization
 * @return boolean: true if path found else false
 */
export const astar = async (ui, grid, start, end, animate) => {
  // initialize priority queue
  let pqueue = new PriorityQueue();

  // declare and initialize minDistances
  const minDistances = [];
  initializeMinDistances(grid, minDistances);
  minDistances[start.getId()] = 0;

  // add start node to pqueue
  pqueue.enqueue(start, 0);

  // loop until pqueue is empty
  while(!pqueue.isEmpty()) {

    // remove highest priority elem from pqueue
    let current = pqueue.dequeue();
    let node = current.data;
    //let weight = current.priority;
    //console.log(node);

    // set the node visited and visualize
    node.setVisited();
    ui.setElementType(node.elem, 'visited');

    // animation option
    if(animate) {
      ui.setElementType(node.elem, 'visited-animate');
      await ui.sleep();
    }

    // return true if destination node reached
    if(grid.areNodeEquals(node, end))
      return true;


    // get neighbours
    const neighbours = node.getNeighbours();

    neighbours.forEach(neighbour => {

      //console.log(neighbour);
      if(neighbour.isWall())
        return;

      // calculate distance to neighbour through current node
      let distance = minDistances[node.id] + neighbour.weight;

      // update if the current distance is less than previous known distance
      if(distance < minDistances[neighbour.id]) {
        minDistances[neighbour.id] = distance;

        // consider heuristic for path optimization
        const heuristic = calculateHeuristic(neighbour, end);
        let priority = distance + heuristic;
        // add to pqueue
        pqueue.enqueue(neighbour, priority);

        // set parent node for neighbour to keep track of traversed path
        neighbour.elem.setAttribute('data-prev', node.id);
      }
    });
   // console.log(pqueue);
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

const calculateHeuristic = (current, end) => {
  let current_loc = current.elem.getAttribute('data-id').split('-');
  let end_loc = end.elem.getAttribute('data-id').split('-');
  return Math.abs(current_loc[0] - end_loc[0]) + Math.abs(current_loc[1] - end_loc[1]);
  //return Math.floor(Math.sqrt(Math.pow(current_loc, 2) + Math.pow(end_loc, 2)));
}
