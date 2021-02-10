export default class Node {
    constructor(row, col) {
        this.type = 'no-type';
        this.weight = 1;
        this.pos_x = col;
        this.pos_y = row;
        this.id = `${col}-${row}`;
    }
    reset() {
        this.type = null;
        this.weight = 1;
    }
    get_type() {
        return this.type;
    }
    get_weight() {
        return this.weight;
    }
    get_id() {
        return this.id;
    }
    get_position() {
        return [this.pos_x, this.pos_y];
    }
    set_type(new_type) {
        this.type = new_type;
        this.weight = 1;
        if (new_type == 'gate-node') {
            this.weight = 10;
        }
    }
}
