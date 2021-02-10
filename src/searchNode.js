export default class Search_Node {
    constructor(node, parent, g, f) {
        this.node = node;
        this.parent = parent;
        this.g = g;
        this.f = f;
    }
    get_node(){
        return this.node;
    }
    get_parent() {
        return this.parent;
    }
    get_g() {
        return this.g;
    }
    get_f() {
        return this.f;
    }
    get_shortest_path() {
        let result = [];
        let search_node = this;
        var node;
        while (search_node !== null) {
            node = search_node.get_node();
            result.push(node);
            search_node = search_node.get_parent();
        }
        return result.reverse();
    }
}