import Search_Node from './searchNode.js';

export default class Breadth_First_Search {
    constructor(board) {
        this.board = board;
        this.in_order = [];
    }
    solve() {
        if (this.board.get_start() == null || this.board.get_goal() == null) {
            console.log("Must have a Start and a Goal. Cannot Solve.");
        }
        let start = this.board.get_start();
        this.board.add_to_visited(start);
        let cur_search_node = new Search_Node(start, null);
        let queue = [];
        queue.push(cur_search_node);
        var cur_node;
        var new_node;

        while (queue.length > 0) {
            cur_search_node = queue.shift();
            cur_node = cur_search_node.get_node();
            this.in_order.push(cur_node);
            if (this.board.is_goal(cur_node)) {
                this.board.clear_visited();
                return cur_search_node.get_shortest_path();
            }
            var neighbors = this.board.get_neighbors(cur_node);
            for (let neighbor of neighbors) {
                if (!this.board.check_visited(neighbor)) {
                    new_node = new Search_Node(neighbor, cur_search_node);
                    queue.push(new_node);
                    this.board.add_to_visited(neighbor);
                }
            }
        }

        this.board.clear_visited();
        return [];
    }
    get_in_order() {
        return this.in_order;
    }
  }