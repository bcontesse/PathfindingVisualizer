import Search_Node from './searchNode.js';

export default class Dijkstra {
    constructor(board) {
        this.board = board;
        this.in_order = [];
    }
    solve() {
        if (this.board.get_start() == null || this.board.get_goal() == null) {
            console.log("Must have a Start and a Goal. Cannot Solve.");
        }
        let start = this.board.get_start();
        let cur_search_node = new Search_Node(start, null, 1);
        let queue = [];
        queue.push(cur_search_node);
        var cur_node;
        var new_node;

        while (queue.length > 0) {
            cur_search_node = this.get_next_node(queue);
            cur_node = cur_search_node.get_node();
            if (!this.board.check_visited(cur_node)) {
                this.board.add_to_visited(cur_node);
                this.in_order.push(cur_node);
                if (this.board.is_goal(cur_node)){
                    this.board.clear_visited();
                    return cur_search_node.get_shortest_path();
                }
                var neighbors = this.board.get_neighbors(cur_node);
                for (let neighbor of neighbors) {
                    if (!this.board.check_visited(neighbor)) {
                        let new_weight = cur_search_node.get_g() + neighbor.get_weight();
                        new_node = new Search_Node(neighbor, cur_search_node, new_weight);
                        queue.push(new_node);
                    }
                }
            }
            
        }

        this.board.clear_visited();
        return [];
    }
    get_next_node(queue) {
        let best_index = 0;
        if (queue[0] === undefined) {
            console.log('bug')
        }
        let best_weight = queue[0].get_g();
        for (let i = 0; i < queue.length; i ++) {
            let cur_node = queue[i];
            if (cur_node.get_g() < best_weight) {
                best_index = i;
                best_weight = cur_node.get_g();
            }
        }
        return queue.splice(best_index, 1)[0];
    }
    get_in_order() {
        return this.in_order;
    }
}