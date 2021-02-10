export default class Animations {
    constructor(board) {
        this.board = board;
        this.speed = board.speed;
        this.max_nodes_to_visit = board.visited_in_order.length;
    }
    timeout(index) {
        let animation_data = this;
        setTimeout(function() {
            if (index === animation_data.max_nodes_to_visit) {
                // add logic to find shortest path
                animation_data.add_shortest_path(0);
                return;
            } else if (index === 0) {
                let start_elem = animation_data.board.get_start().get_id();
                document.getElementById(start_elem).className = 'start-node-visited';
            } else {
                animation_data.change_node(animation_data.board.visited_in_order[index])
            }
            animation_data.timeout(index + 1);
        }, animation_data.speed)
    }
    change_node(cur_node) {
        let cur_elem_html = document.getElementById(cur_node.get_id());
        if (cur_node.get_type() === 'gate-node') {
            cur_elem_html.className = 'gate-node-visited';
        } else if (cur_node.get_type() === 'goal-node') {
            cur_elem_html.className = 'goal-node-visited';
        } else {
            cur_elem_html.className = 'no-type-visited';
        }
    }
    add_shortest_path(index) {
        let animation_data = this;
        setTimeout(function () {
            if (index === animation_data.board.shortest_path.length) {
                animation_data.board.toggle_buttons();
                return;
            }
            animation_data.shortest_path_change(animation_data.board.shortest_path[index]);
            animation_data.add_shortest_path(index + 1);
        }, 50)
    }
    shortest_path_change(cur_node) {
        let cur_elem_html = document.getElementById(cur_node.get_id());
        if (cur_node.get_type() === 'gate-node') {
            cur_elem_html.className = 'gate-node-shortest';
        } else if (cur_node.get_type() === 'goal-node') {
            cur_elem_html.className = 'goal-node-shortest';
        } else if (cur_node.get_type() === 'start-node') {
            cur_elem_html.className = 'start-node-shortest';
        } else {
            cur_elem_html.className = 'no-type-shortest';
        }
    }
    draw_maze(index, maze_in_order) {
        let animation_data = this;
        setTimeout(function() {
            if (index === maze_in_order.length) {
                animation_data.board.toggle_buttons();
                return;
            } else {
                let cur_pos = maze_in_order[index];
                let [cur_x, cur_y] = [cur_pos[0], cur_pos[1]];
                animation_data.board.set_wall(cur_x, cur_y);
            }
            animation_data.draw_maze(index + 1, maze_in_order);
        }, 0)
    }
}