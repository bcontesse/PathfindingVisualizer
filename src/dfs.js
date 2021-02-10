import Search_Node from './searchNode.js';

export default class Bread_First_Search {
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

        let last_node = this.solve_helper(cur_search_node);
        this.board.clear_visited();
        if (last_node !== null) {
            return last_node.get_shortest_path();
        }
        
        return [];
    }
    solve_helper(cur_search_node) {
        let cur_node = cur_search_node.get_node();
        this.in_order.push(cur_node);
        if (this.board.is_goal(cur_node)) {
            return cur_search_node
        }
        var neighbors = this.board.get_neighbors(cur_node);
        for (let neighbor of neighbors) {
            if (!this.board.check_visited(neighbor)) {
                this.board.add_to_visited(neighbor);
                let new_node = new Search_Node(neighbor, cur_search_node);
                let result = this.solve_helper(new_node);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }
    get_in_order() {
        return this.in_order;
    }
  }