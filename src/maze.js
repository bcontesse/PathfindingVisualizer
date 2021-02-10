export default class Maze {
    constructor(board) {
        this.board = board;
        this.width = board.get_width();
        this.height = board.get_height();
        this.in_order = [];
    }
    get_in_order() {
        return this.in_order;
    }
    create_maze() {
        let start_pos = this.board.get_start().get_position();
        let goal_pos = this.board.get_goal().get_position();
        this.create_maze_helper(1, this.width - 2, 1, this.height - 2, start_pos[0], start_pos[1], goal_pos[0], goal_pos[1]);
    }
    create_maze_helper(left, right, top, bottom, start_x, start_y, goal_x, goal_y) {
        if (left > right || top > bottom) {
            return;
        }

        let row_options = [];
        let col_options = [];
        for (let row = top; row <= bottom; row += 2) {
            row_options.push(row);
        }
        for (let col = left; col <= right; col += 2) {
            col_options.push(col);
        }

        let midpoint_row = row_options[Math.floor(Math.random()*row_options.length)];
        let midpoint_col = col_options[Math.floor(Math.random()*col_options.length)];
        
        if (right - left > bottom - top) {
            let pos_x = midpoint_col;
            for (let row = top; row < bottom; row++) {
                if (row !== midpoint_row && row !== start_y && row !== goal_y) {
                    let pos_y = row;
                    this.in_order.push([pos_x, pos_y]);
                }
            }
            this.create_maze_helper(left, midpoint_col - 2, top, bottom, start_x, start_y, goal_x, goal_y);
            this.create_maze_helper(midpoint_col + 2, right, top, bottom, start_x, start_y, goal_x, goal_y);
            return;
        } else {
            let pos_y = midpoint_row;
            for (let col = left; col < right; col++) {
                if (col !== midpoint_col && col !== start_x && col !== goal_x) {
                    let pos_x = col;
                    this.in_order.push([pos_x, pos_y]);
                }
            }
            this.create_maze_helper(left, right, top, midpoint_row - 2, start_x, start_y, goal_x, goal_y);
            this.create_maze_helper(midpoint_col + 2, right, midpoint_row + 2, bottom, start_x, start_y, goal_x, goal_y);
            return;
        }
    }
}