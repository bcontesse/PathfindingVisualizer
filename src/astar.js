import Search_Node from './searchNode.js';

export default class Astar {
    constructor(board) {
        this.board = board;
        this.in_order = [];
        this.max_iterations = board.get_width() **10;
    }
    solve() {
        if (this.board.get_start() == null || this.board.get_goal() == null) {
            console.log("Must have a Start and a Goal. Cannot Solve.");
        }
        let start = this.board.get_start();
        let goal = this.board.get_goal();
        let cur_search_node = new Search_Node(start, null, 1, 1);
        let queue = [];
        queue.push(cur_search_node);
        let iterations = 0
        var cur_node;
        var new_node;

        while (queue.length > 0) {
            cur_search_node = this.get_next_node(queue);
            cur_node = cur_search_node.get_node();
            if (!this.board.check_visited(cur_node)) {
                this.board.add_to_visited(cur_node);
                this.in_order.push(cur_node);
                iterations++;
                if (iterations > this.max_iterations) {
                    console.log('No Path Exists within Max Iterations.')
                    this.board.clear_visited();
                    return []
                }
                if (this.board.is_goal(cur_node)) {
                    this.board.clear_visited();
                    return cur_search_node.get_shortest_path();
                }
                var neighbors = this.board.get_neighbors(cur_node);
                for (let neighbor of neighbors) {
                    if (!this.board.check_visited(neighbor)) {
                        let new_g = cur_search_node.get_g() + neighbor.get_weight();
                        let new_h = this.manhattan_distance(neighbor, goal);
                        new_node = new Search_Node(neighbor, cur_search_node, new_g, new_g + new_h);
                        this.add_to_queue(queue, new_node);
                    }
                }
            }
        }

        this.board.clear_visited();
        return [];
    }
    manhattan_distance(node, goal) {
        let [node_x, node_y] = node.get_position();
        let [goal_x, goal_y] = goal.get_position();
        // return Math.pow((node_x-goal_x), 2) + Math.pow((node_y-goal_y), 2);
        return Math.abs(node_x - goal_x) + Math.abs(node_y - goal_y);
    }
    add_to_queue(queue, new_search_node) {
        let new_node = new_search_node.get_node()
        for(let cur_search_node of queue) {
            if(cur_search_node.get_node() === new_node && cur_search_node.get_g() < new_search_node.get_g()) {
                return
            }
        }
        queue.push(new_search_node);
        return
    }
    get_next_node(queue) {
        let best_index = 0;
        let best_f = queue[0].get_f();
        for (let i = 0; i < queue.length; i ++) {
            let cur_node = queue[i];
            if (cur_node.get_f() < best_f) {
                best_index = i;
                best_f = cur_node.get_f();
            }
        }
        return queue.splice(best_index, 1)[0];
    }
    get_in_order() {
        return this.in_order;
    }
  }