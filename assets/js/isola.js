var PIECE_PAIRS = [
        [1, 2], [1, 8], [1, 9], [2, 3], [2, 8], [2, 9], [2, 10], [3, 4], [3, 9], [3, 10], [3, 11],
        [4, 5], [4, 10], [4, 11], [4, 12], [5, 6], [5, 11], [5, 12], [5, 13], [6, 7], [6, 12], [6, 13], [6, 14],
        [7, 13], [7, 14], [8, 9], [8, 15], [8, 16], [9, 10], [9, 15], [9, 16], [9, 17], [10, 11], [10, 16], [10, 17], [10, 18],
        [11, 12], [11, 17], [11, 18], [11, 19], [12, 13], [12, 18], [12, 19], [12, 20], [13, 14], [13, 19], [13, 20], [13, 21],
        [14, 20], [14, 21], [15, 16], [15, 22], [15, 23], [16, 17], [16, 22], [16, 23], [16, 24], [17, 18], [17, 23], [17, 24],
        [17, 25], [18, 19], [18, 24], [18, 25], [18, 26], [19, 20], [19, 25], [19, 26], [19, 27], [20, 21], [20, 26], [20, 27],
        [20, 28], [21, 27], [21, 28], [22, 23], [22, 29], [22, 30], [23, 24], [23, 29], [23, 30], [23, 31], [24, 25], [24, 30],
        [24, 31], [24, 32], [25, 26], [25, 31], [25, 32], [25, 33], [26, 27], [26, 32], [26, 33], [26, 34], [27, 28], [27, 33],
        [27, 34], [27, 35], [28, 34], [28, 35], [29, 30], [29, 36], [29, 37], [30, 31], [30, 36], [30, 37], [30, 38], [31, 32],
        [31, 37], [31, 38], [31, 39], [32, 33], [32, 38], [32, 39], [32, 40], [33, 34], [33, 39], [33, 40], [33, 41], [34, 35],
        [34, 40], [34, 41], [34, 42], [35, 41], [35, 42], [36, 37], [36, 43], [36, 44], [37, 38], [37, 43], [37, 44], [37, 45],
        [38, 39], [38, 44], [38, 45], [38, 46], [39, 40], [39, 45], [39, 46], [39, 47], [40, 41], [40, 46], [40, 47], [40, 48],
        [41, 42], [41, 47], [41, 48], [41, 49], [42, 48], [42, 49], [43, 44], [44, 45], [45, 46], [46, 47], [47, 48], [48, 49]
    ],
    current_player = 'player1',
    player1_piece = 4,
    player2_piece = 46,
    pieces_removed = [];
$(document).ready(function() {
    start_moving_pieces();
    $(".rules_button").on("click", rules_clicked);
});
function start_moving_pieces() {
    fill_player_info(current_player, "move your piece on the empty place on board.");
    var real_player = current_player == "player1" ? player1_piece : player2_piece,
        other_player = current_player == "player1" ? player2_piece : player1_piece,
        movable = check_possible_moves(real_player, other_player);
    if (!movable) { declare_endgame(current_player == "player1" ? "player2" : "player1"); }
    $(".isola_board tr td").on("click", function() {
        var clicked_piece = $(this).attr("data-piece"),
            clicked_piece_whole = $(this);
        if (pieces_removed.indexOf(parseInt(clicked_piece)) >= 0 ||
            player1_piece == parseInt(clicked_piece) || player2_piece == parseInt(clicked_piece)) {
                player_notification("This place on board is already taken or removed, please select another one.");
                $(".isola_board tr td").off();
                start_moving_pieces();
        } else {
            var can_move = false;
            PIECE_PAIRS.forEach((pair) => {
                if (can_move) { return; }
                if (pair.indexOf(parseInt(clicked_piece)) >= 0 && pair.indexOf(real_player) >= 0) {
                    can_move = true;
                }
            });
            if (!can_move) {
                player_notification("You can only move to adjacent fields, please select another one.");
                $(".isola_board tr td").off();
                start_moving_pieces();
            } else {
                var classname = "." + current_player;
                pieces_removed.push(parseInt($(classname).attr("data-piece")));
                $(classname).removeClass("standing").removeClass(current_player).addClass("dropped");
                clicked_piece_whole.addClass("standing").addClass(current_player);
                if (current_player == "player1") { player1_piece = parseInt(clicked_piece); }
                if (current_player == "player2") { player2_piece = parseInt(clicked_piece); }
                current_player = current_player == "player1" ? "player2" : "player1";
                $(".isola_board tr td").off();
                start_moving_pieces();
            }
        }
    });
}
function check_possible_moves(pl, op) {
    var mv = false;
    PIECE_PAIRS.forEach((pair) => {
        if (mv) { return; }
        if ((pair[0] == pl && (pieces_removed.indexOf(pair[1]) < 0 && pair[1] != op))
            || (pair[1] == pl && (pieces_removed.indexOf(pair[0]) < 0 && pair[0] != op))) {
                mv = true;
        }
    });
    return mv;
}
