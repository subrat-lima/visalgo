/**
 * DFS Algorithm Implementation
 * @param ui: UI class for visualization
 * @param grid: Grid class for list of nodes
 * @param start: starting node
 * @param end: destination node
 * @param animate: to toggle animation for visualization
 * @return boolean: true if path found else false
 */
export const dfs = async (ui, grid, start, end, animate) => {
  // set the node visited and visualize
  start.setVisited();
  ui.setElementType(start.elem, 'visited');

  // return true if destination node reached
  if(grid.areNodeEquals(start, end))
    return true;

  // animation option
  if(animate) {
    await ui.sleep();
      ui.setElementType(start.elem, 'visited-animate');
  }

  // get neighbours
  const neighbours = start.getNeighbours();
  for(let i = 0; i < neighbours.length; i++) {

    if(neighbours[i].isWall())
      continue;
    // skip if neighbour has been visited
    if(neighbours[i].isVisited())
      continue;

    // set parent node for neighbour to keep track of traversed path
    neighbours[i].elem.setAttribute('data-prev', start.id);

    // recursive call to find path from neighbour to destination
    // if path found, then return true
    if(await dfs(ui, grid, neighbours[i], end, animate))
      return true;
  }

  // path not found, return false
  return false;

}
