# visalgo
Visualizing an algorithm is a nice way to learn how the algorithm works. When I found [clement's pathfinding visualizer](https://clementmihailescu.github.io/Pathfinding-Visualizer/), I was amazed. This is a complete rebuild of clement's pathfinding visualizer from scratch with plain HTML, CSS and JS.

[This is the live project link](https://visalgo.subratlima.xyz/)

## Algorithms implemented
* Breadth First Search (unweighted) -  The algorithm starts at the tree root, and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.
* Depth First Search (unweighted) - This algorithm starts at the root node and explores as far as possible along each branch before backtracking.
* Dijkstra's Algorithm (weighted) - This algorithm traverses similar to BFS, however, it also keeps a track of distances from the start node to other nodes. It finds the shortest path from a given node to every other nodes in the graph.
* A* Algorithm (weighted) - This algorithm is a modification of Dijkstra's Algorithm. It also takes into consideration heuristics for prioritizing the traversal path. It also finds the shortest distance of given nodes, however, due to the added heuristics, it is faster than Dijkstra.

## Features added
* Select algorithms and modify animation speed from the nav menu.
* Add or remove weights and walls. Toggle between walls and weights in the grid menu. (Note: Weights are ignored for unweighted algorithms.)
* Move around **StartNode** and **EndNode**.

**NOTE: For weighted algorithms, normal node has the weight of 1 and weighted node has the value of 5.**
