import Breadth_First_Search from './bfs.js';
import Depth_First_Search from './dfs.js';
import Dijkstra from './dijkstra.js';
import Node from './node.js';
import Animations from './animations.js';
import Astar from './astar.js';
import Greedy from './greedybfs.js'
import Maze from './maze.js'

export default class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.board_tiles = [];
        this.start = null;
        this.goal = null;
        this.prev_node_type = null;
        this.use_gate = false;
        this.seen = new Set()
        this.visited_in_order = [];
        this.mouse_down = false;
        this.cur_node_status = null;
        this.cur_algorithm = null;
        this.algo_done = false;
        this.speed = 50;
        this.buttons_on = false;
        this.special_types = ['start-node', 'goal-node', 'bomb-node']
        this.unweighted_algos = ['dfs', 'bfs']
    }
    initialise() {
        this.create_grid();
        let x_val = Math.floor(this.width/3);
        let y_val = Math.floor(this.height/2);
        this.set_start(x_val, y_val);
        this.set_goal(x_val*2, y_val);
        this.get_started_button();
    }
    get_started_button() {
        document.getElementById('getStartedButton').onclick = () => {
            document.getElementById('tutorial').style.display = 'none';
            this.add_event_listeners();
            this.toggle_buttons();
        }
    }
    reset_board() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cur_node = this.get_node(col, row);
                let cur_id = cur_node.get_id();
                let cur_elem = document.getElementById(cur_id);
                cur_node.set_type('no-type');
                cur_elem.className = 'no-type';
            }
        }
        let x_val = Math.floor(this.width/3);
        let y_val = Math.floor(this.height/2);
        this.set_start(x_val, y_val);
        this.set_goal(x_val*2, y_val);
    }
    create_grid() {
        let output_html = "";
        for (let row = 0; row < this.height; row++) {
            let array_row = [];
            let row_html = `<tr id="row ${row}">`;
            for (let col = 0; col < this.width; col++) {
                let new_node = new Node(row, col);
                let node_class = new_node.get_type();
                let node_id = new_node.get_id();
                array_row.push(new_node);
                row_html += `<td id="${node_id}" class="${node_class}"></td>`;
            }
            this.board_tiles.push(array_row);
            output_html += `${row_html}</tr>`;
        }
        let board = document.getElementById("board");
        board.innerHTML = output_html;
    }
    add_event_listeners() {
        document.addEventListener('keydown', e => {
            if (e.code === 'KeyG' && !this.unweighted_algos.includes(this.cur_algorithm)) {
                this.use_gate = !this.use_gate;
                let gate_status = this.use_gate ? 'selected' : '';
                document.getElementById("gate-instruct").className = gate_status;
            }
        })
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cur_node = this.get_node(col, row);
                let cur_id = cur_node.get_id();
                let cur_elem = document.getElementById(cur_id)
                cur_elem.onmousedown = (e) => {
                    e.preventDefault();
                    this.mouse_down = true;
                    if (!this.special_types.includes(cur_node.get_type())){
                        this.switch_node(cur_node);
                    } else {
                        this.cur_node_status = cur_node.get_type();
                    }
                }
                cur_elem.onmouseup = () => {
                    this.mouse_down = false;
                    if (this.cur_node_status !== null && !this.algo_done) {
                        cur_elem.className = this.cur_node_status;
                        cur_node.set_type(this.cur_node_status);
                    }
                    this.prev_node_type = null;
                    this.cur_node_status = null;
                }
                cur_elem.onmouseenter = () => {
                    if (this.mouse_down && this.cur_node_status !== null) {
                        this.prev_node_type = cur_node.get_type();
                        cur_elem.className = this.cur_node_status;
                        cur_node.set_type(this.cur_node_status);
                        if (this.cur_node_status === 'start-node'){
                            this.start = cur_node;
                            if (this.algo_done) {
                                this.solve();
                                this.update_search();
                            }
                        } else if (this.cur_node_status === 'goal-node') {
                            this.goal = cur_node;
                            if (this.algo_done) {
                                this.solve();
                                this.update_search();
                            }
                        }
                    } else if (this.mouse_down && !this.special_types.includes(cur_node.get_type())) {
                        this.switch_node(cur_node);
                    }
                }
                cur_elem.onmouseleave = () => {
                    if (this.mouse_down && this.cur_node_status !== null) {
                        if (this.prev_node_type !== null) {
                            cur_node.set_type(this.prev_node_type);
                            cur_elem.className = this.prev_node_type;
                        } else {
                            cur_node.set_type('no-type');
                            cur_elem.className = 'no-type';
                        }
                    }
                }
            }
        }
    }
    toggle_buttons() {
        document.getElementById('refreshButton').onclick = () => {
            window.location.reload();
        }
        this.buttons_on = !this.buttons_on;
        if (this.buttons_on) {
            document.getElementById('startButton').onclick = () => {
                this.reset_search();
                this.algo_done = false;
                if (this.cur_algorithm === null) {
                    document.getElementById('startButton').innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>';
                } else {
                    let success = this.solve();
                    if (success) {
                        this.toggle_buttons();
                        this.launch_animations();
                    }
                }
            }
            document.getElementById('startButtonBFS').onclick = () => {
                document.getElementById("startButton").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize BFS!</button>'
                this.switch_algo('bfs')
            }
            document.getElementById('startButtonDFS').onclick = () => {
                document.getElementById("startButton").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize DFS!</button>'
                this.switch_algo('dfs');
            }
            document.getElementById('startButtonDijkstra').onclick = () => {
                document.getElementById("startButton").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra!</button>'
                this.switch_algo('dijkstra')
            }
            document.getElementById('startButtonAstar').onclick = () => {
                document.getElementById("startButton").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize A-Star!</button>'
                this.switch_algo('astar')
            }
            document.getElementById('startButtonGreedy').onclick = () => {
                document.getElementById("startButton").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Greedy BFS!</button>'
                this.switch_algo('greedy')
            }
            document.getElementById("adjustSlow").onclick = () => {
                this.speed = 200;
                document.getElementById("adjustSpeed").innerHTML = 'Speed: Slow<span class="caret"></span>';
            }
            document.getElementById("adjustAverage").onclick = () => {
                this.speed = 50;
                document.getElementById("adjustSpeed").innerHTML = 'Speed: Average<span class="caret"></span>';
            }
            document.getElementById("adjustFast").onclick = () => {
                this.speed = 0;
                document.getElementById("adjustSpeed").innerHTML = 'Speed: Fast<span class="caret"></span>';
            }
            document.getElementById("createMazeButton").onclick = () => {
                this.create_maze();
            }
            document.getElementById("clearWallsButton").onclick = () => {
                this.clear_objects();
            }
            document.getElementById("clearPathButton").onclick = () => {
                this.reset_search();
            }
            document.getElementById("clearBoardButton").onclick = () => {
                this.reset_board();
            }
            document.getElementById("actualStartButton").style.backgroundColor = "";
        } else {
            document.getElementById("startButtonDFS").onclick = null;
            document.getElementById("startButtonBFS").onclick = null;
            document.getElementById("startButtonDijkstra").onclick = null;
            document.getElementById("startButtonAstar").onclick = null;
            document.getElementById("startButtonGreedy").onclick = null;
            document.getElementById("createMazeButton").onclick = null;
            document.getElementById("clearPathButton").onclick = null;
            document.getElementById("clearWallsButton").onclick = null;
            document.getElementById("clearBoardButton").onclick = null;
            document.getElementById("startButton").onclick = null;
            document.getElementById("adjustFast").onclick = null;
            document.getElementById("adjustAverage").onclick = null;
            document.getElementById("adjustSlow").onclick = null;

            document.getElementById("actualStartButton").style.backgroundColor = "rgb(185, 15, 15)";
        }    
    }
    launch_animations() {
        let cur_animations = new Animations(this);
        cur_animations.timeout(0);
    }
    set_start(x, y) {
        let cur_node = this.get_node(x, y);
        let cur_id = cur_node.get_id();
        let cur_elem = document.getElementById(cur_id);
        cur_node.set_type('start-node');
        cur_elem.className = 'start-node';
        this.start = cur_node;
    }
    set_goal(x, y) {
        let cur_node = this.get_node(x, y);
        let cur_id = cur_node.get_id();
        let cur_elem = document.getElementById(cur_id);
        cur_node.set_type('goal-node');
        cur_elem.className = 'goal-node';
        this.goal = cur_node;
    }
    set_wall(x, y) {
        let cur_node = this.get_node(x, y);
        let cur_id = cur_node.get_id();
        let cur_elem = document.getElementById(cur_id);
        cur_node.set_type('wall-node');
        cur_elem.className = 'wall-node';
    }
    switch_node(node) {
        let cur_id = node.get_id();
        let cur_elem = document.getElementById(cur_id);
        let new_type;
        if (this.use_gate) {
            new_type = node.get_type() !== 'gate-node' ? 'gate-node' : 'no-type';
        } else {
            new_type = node.get_type() !== 'wall-node' ? 'wall-node' : 'no-type';
        }
        cur_elem.className = new_type;
        node.set_type(new_type);
    }
    clear_objects() {
        this.remove_type('wall-node');
            let gate_nodes = ['gate-node', 'gate-node-visited', 'gate-node-shortest']
            for (let node_type of gate_nodes){
                this.remove_type(node_type);
            }
    }
    remove_type(type) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cur_node = this.get_node(col, row);
                if (cur_node.get_type() === type) {
                    cur_node.set_type('no-type');
                    let cur_elem = document.getElementById(cur_node.get_id());
                    cur_elem.className = 'no-type';
                }
            }
        }
    }
    reset_search() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cur_node = this.get_node(col, row);
                let cur_elem = document.getElementById(cur_node.get_id());
                cur_elem.className = cur_node.get_type();
            }
        }
    }
    update_search() {
        this.reset_search();
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cur_node = this.get_node(col, row);
                if (this.shortest_path.includes(cur_node)) {
                    this.visit_node(cur_node, 'shortest')
                } else if (this.visited_in_order.includes(cur_node)) {
                    this.visit_node(cur_node, 'visited');
                }
            }
        }
    }
    switch_algo(new_algo) {
        this.cur_algorithm = new_algo;
        this.change_descriptor(new_algo);
        this.reset_search();
        this.use_gate = false;
        this.algo_done = false;
        if (this.unweighted_algos.includes(new_algo)) {
            this.remove_type('gate-node');
            document.getElementById("gate-instruct").className = "turned-off";
        } else {
            document.getElementById("gate-instruct").className = "";
        }
    }
    change_descriptor(new_algo) {
        if (new_algo === 'bfs') {
            document.getElementById('algorithmDescriptor').innerHTML = '<b>Unweighted</b> and <b>Guarantees</b> the shortest path!';
        } else if (new_algo === 'dfs') {
            document.getElementById('algorithmDescriptor').innerHTML = '<b>Unweighted</b> and <b>Does Not Guarantee</b> the shortest path!';
        } else if (new_algo === 'dijkstra' || new_algo === 'astar') {
            document.getElementById('algorithmDescriptor').innerHTML = '<b>Weighted</b> and <b>Guarantees</b> the shortest path!';
        } else if (new_algo === 'greedy') {
            document.getElementById('algorithmDescriptor').innerHTML = '<b>Weighted</b> and <b>Does Not Guarantee</b> the shortest path!';
        } else {
            document.getElementById('algorithmDescriptor').innerHTML = 'Pick an algorithm and visualize it!';
        }
    }
    visit_node(node, visit_type) {
        let node_type = node.get_type();
        let new_type = node_type + '-' + visit_type;
        let cur_elem = document.getElementById(node.get_id());
        cur_elem.className = new_type;
    }
    get_node(x, y) {
        return this.board_tiles[y][x];
    }
    get_start() {
        return this.start;
    }
    get_goal() {
        return this.goal;
    }
    get_neighbors(node) {
        let result = []
        let cur_pos = node.get_position();
        let [x, y] = cur_pos;
        let dirs = [[1,0], [0,1], [-1,0], [0,-1]]
        for (let i = 0; i < dirs.length; i++) {
            let new_x = x + dirs[i][0];
            let new_y = y + dirs[i][1];
            if (this.valid_position(new_x, new_y) && this.valid_node(new_x, new_y)) {
                result.push(this.get_node(new_x, new_y))
            }
        }
        return result;
    }
    valid_position(x, y) {
        return (!(x < 0 || x >= this.width || y < 0 || y >= this.height));
    }
    valid_node(x, y) {
        let node = this.get_node(x, y);
        return node.get_type() !== 'wall-node';
    }
    is_goal(node) {
        return this.goal === node;
    }
    add_to_visited(node) {
        let node_id = node.get_id();
        this.seen.add(node_id);
    }
    check_visited(node) {
        let node_id = node.get_id();
        return this.seen.has(node_id);
    }
    clear_visited() {
        this.seen = new Set();
    }
    get_width() {
        return this.width;
    }
    get_height() {
        return this.height;
    }
    create_maze() {
        this.clear_objects();
        this.reset_search();
        let cur_maze = new Maze(this);
        cur_maze.create_maze();
        let cur_animations = new Animations(this);
        this.toggle_buttons();
        cur_animations.draw_maze(0, cur_maze.get_in_order());
    }
    solve() {
        var cur_search;
        if (this.cur_algorithm === 'bfs') {
            cur_search = new Breadth_First_Search(this);
        } else if (this.cur_algorithm === 'dfs') {
            cur_search = new Depth_First_Search(this);
        } else if (this.cur_algorithm === 'dijkstra') {
            cur_search = new Dijkstra(this);
        } else if (this.cur_algorithm === 'astar') {
            cur_search = new Astar(this);
        } else if (this.cur_algorithm === 'greedy') {
            cur_search = new Greedy(this);
        }
        else {
            return false
        }
        let shortest_path = cur_search.solve();
        if (shortest_path.length > 0) {
            this.change_descriptor(this.cur_algorithm)
            let visited_in_order = cur_search.get_in_order();
            this.shortest_path = shortest_path;
            this.visited_in_order = visited_in_order;
            this.algo_done = true;
            return true
        } else {
            this.reset_search();
            this.visited_in_order = [];
            this.shortest_path = [];
            document.getElementById('algorithmDescriptor').innerHTML = 'Current setup <b>CANNOT</b> be solved!';
            return false
        }
    }
}