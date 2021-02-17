import { Queue } from './queue.js';

/**
 * BFS Algorithm Implementation
 * @param ui: UI class for visualization
 * @param grid: Grid class for list of nodes
 * @param start: starting node
 * @param end: destination node
 * @param animate: to toggle animation for visualization
 * @return boolean: true if path found else false
 */
export const bfs = async (ui, grid, start, end, animate) => {
  // initialize queue
  let queue = new Queue();

  // add the first node to queue
  queue.enqueue(start);

  // loop till queue is not empty
  while(!queue.isEmpty()) {

    // remove node from queue
    let current = queue.dequeue();

    // if node already visited, skip it
    if(current.visited)
      continue;

    // set the node visited and visualize
    current.visited = true;
    current.elem.classList.add('visited');

    // animation option
    if(animate) {
      current.elem.classList.add('visited-animate');
      await ui.sleep();
    }

    // return true if destination node reached
    if(grid.areNodeEquals(current, end))
      return true;

    // get neighbours
    const neighbours = current.neighbours;

    neighbours.forEach(neighbour => {

      if(neighbour.isWall)
        return;
      // set parent node for neighbour to keep track of traversed path
      if(neighbour.elem.dataset.prev == null)
        neighbour.elem.dataset.prev = current.id;

      // add neighbour to the queue
      queue.enqueue(neighbour);
    });
  }

  // path not found, so, return false
  return false;
}
