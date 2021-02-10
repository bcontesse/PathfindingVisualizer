import Board from './board.js'

let navbar_height = $("#navbarDiv").height();
let text_height = $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - navbar_height - text_height) / 28);
let width = Math.floor($(document).width() / 25);
let new_board = new Board(width, height)
new_board.initialise();