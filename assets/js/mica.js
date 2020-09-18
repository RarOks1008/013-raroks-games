var PIECES_COMBINATIONS = [
        [1, 2, 3], [1, 10, 22], [2, 5, 8], [3, 15, 24], [4, 5, 6], [4, 11, 19], [6, 14, 21], [7, 8, 9], [7, 12, 16],
        [9, 13, 18], [10, 11, 12], [13, 14, 15], [16, 17, 18], [17, 20, 23], [19, 20, 21], [22, 23, 24]
    ],
    PIECE_PAIRS = [
        [1, 2], [1, 10], [2, 3], [2, 5], [3, 15], [4, 5], [4, 11], [5, 6], [5, 8], [6, 14], [7, 8], [7, 12], [8, 9],
        [9, 13], [10, 11], [10, 22], [11, 12], [11, 19], [12, 16], [13, 14], [13, 18], [14, 15], [14, 21], [15, 24],
        [16, 17], [17, 18], [17, 20], [19, 20], [20, 21], [20, 23], [22, 23], [23, 24]
    ],
    NUMBER_PIECES = 18,
    current_player = 'player1',
    player1_pieces = [],
    player2_pieces = [],
    number_played = 0;
$(document).ready(function() {
    place_pieces();
    $(".rules_button").on("click", rules_clicked);
});
function place_pieces() {
    if (number_played == NUMBER_PIECES) { start_moving(); return; }
    fill_player_info(current_player, "put a piece on the empty place on board.");
    $(".mica_board li").on("click", function() {
        var clicked_piece = $(this).attr("data-piece");
        if (player1_pieces.indexOf(parseInt(clicked_piece)) >= 0 ||
            player2_pieces.indexOf(parseInt(clicked_piece)) >= 0) {
                player_notification("This place on board is already taken, please select another one.");
                $(".mica_board li").off();
                place_pieces();
        } else {
            if (current_player == "player1") { player1_pieces.push(parseInt(clicked_piece)); }
            if (current_player == "player2") { player2_pieces.push(parseInt(clicked_piece)); }
            number_played += 1;
            $(this).addClass(current_player);
            if (current_player == "player1") {
                current_player = "player2";
            } else {
                current_player = "player1";
            }
            $(".mica_board li").off();
            check_placed_three(current_player, clicked_piece, place_pieces);
        }
    });
}
function check_placed_three(player, clicked_piece, when_done) {
    var real_player_pieces = player == "player1" ? player2_pieces : player1_pieces,
        opponent_pieces = player == "player2" ? player2_pieces : player1_pieces,
        class_name = ".mica_board li." + player;
    if (real_player_pieces.length < 3) { when_done(); return; }
    var found_combination = three_in_row(real_player_pieces, clicked_piece);
    if (found_combination) {
        fill_player_info(current_player == "player1" ? "player2" : "player1", "select an oponnent piece to remove from the game.");
        $(class_name).on("click", function() {
            var all_three = true,
                clicked_num = $(this).attr("data-piece");
            opponent_pieces.forEach((pc) => {
                all_three = all_three && three_in_row(opponent_pieces, pc);
            });
            if (!all_three && three_in_row(opponent_pieces, clicked_num)) {
                player_notification("You can not remove an enemy piece which is in a mill.");
                return;
            }
            $(this).removeClass(player);
            if (player == "player1") {
                player1_pieces.splice(player1_pieces.indexOf(parseInt(clicked_num)), 1);
            } else {
                player2_pieces.splice(player2_pieces.indexOf(parseInt(clicked_num)), 1);
            }
            $(".mica_board li").off();
            when_done();
        });
    } else {
        when_done();
    }
}
function three_in_row(which_pieces, clicked_piece) {
    var i, j, k,
        found = false;
    for (i = 0; i < which_pieces.length - 2; i++) {
        for (j = i + 1; j < which_pieces.length - 1; j++) {
            for (k = j + 1; k < which_pieces.length; k++) {
                PIECES_COMBINATIONS.forEach((comb) => {
                    if (found) { return; }
                    var fp = which_pieces[i],
                        sp = which_pieces[j],
                        tp = which_pieces[k];
                    if (comb.indexOf(fp) >= 0 && comb.indexOf(sp) >= 0 && comb.indexOf(tp) >= 0 &&
                    (fp == clicked_piece || sp == clicked_piece || tp == clicked_piece)) {
                        found = true;
                    }
                });
            }
        }
    }
    return found;
}
function start_moving() {
    if (player1_pieces.length < 3 || player2_pieces.length < 3) {
        declare_endgame(current_player == "player1" ? "player2" : "player1");
        return;
    }
    var real_player = current_player == "player1" ? player1_pieces : player2_pieces,
        class_name = ".mica_board li." + current_player,
        movable = check_possible_moves(real_player);
    if (!movable && real_player.length != 3) {
        declare_endgame(current_player == "player1" ? "player2" : "player1");
    }
    fill_player_info(current_player, "select a piece which you want to move.");
    $(class_name).on("click", function() {
        var current_clicked = $(this).attr("data-piece"),
            exists_move = false,
            current_element = $(this);
        PIECE_PAIRS.forEach((pair) => {
            if (exists_move) { return; }
            if (pair.indexOf(parseInt(current_clicked)) < 0) { return; }
            var second_pair;
            if (pair[0] == parseInt(current_clicked)) {
                second_pair = pair[1];
            } else {
                second_pair = pair[0];
            }
            exists_move = player1_pieces.indexOf(second_pair) < 0 && player2_pieces.indexOf(second_pair) < 0;
        });
        if (!exists_move && real_player.length != 3) {
            player_notification("This piece can not be moved, please select another one to move.");
            return;
        }
        $(".mica_board li").off();
        fill_player_info(current_player, real_player.length == 3 ? "select any non-occupied place to move to." :
            "select an adjacent non-occupied place to move to.");
        $(".mica_board li").on("click", function() {
            var curr_click = $(this).attr("data-piece"),
                is_legit_move = false,
                curr_el = $(this);
            if (player1_pieces.indexOf(parseInt(curr_click)) >= 0 ||
                player2_pieces.indexOf(parseInt(curr_click)) >= 0) {
                    player_notification("You can not move to a taken place, please select another one.");
                    $(".mica_board li").off();
                    start_moving();
                    return;
            }
            PIECE_PAIRS.forEach((pr) => {
                if (is_legit_move) { return; }
                if (pr.indexOf(parseInt(current_clicked)) < 0) { return; }
                if (pr.indexOf(parseInt(curr_click)) < 0) { return; }
                is_legit_move = true;
            });
            if (!is_legit_move && real_player.length != 3) {
                player_notification("You can only move to an adjacent place, please select another one.");
                $(".mica_board li").off();
                start_moving();
                return;
            }
            current_element.removeClass(current_player);
            curr_el.addClass(current_player);
            if (current_player == "player1") {
                player1_pieces.splice(player1_pieces.indexOf(parseInt(current_clicked)), 1);
                player1_pieces.push(parseInt(curr_click));
            } else {
                player2_pieces.splice(player2_pieces.indexOf(parseInt(current_clicked)), 1);
                player2_pieces.push(parseInt(curr_click));
            }
            if (current_player == "player1") {
                current_player = "player2";
            } else {
                current_player = "player1";
            }
            $(".mica_board li").off();
            check_placed_three(current_player, curr_click, start_moving);
        });
    });
}
function check_possible_moves(pl) {
    var mv = false;
    pl.forEach((p) => {
        if (mv) { return; }
        PIECE_PAIRS.forEach((pair) => {
            if (mv) { return; }
            if (pair.indexOf(parseInt(p)) < 0) { return; }
            var second_pair;
            if (pair[0] == parseInt(p)) {
                second_pair = pair[1];
            } else {
                second_pair = pair[0];
            }
            mv = player1_pieces.indexOf(second_pair) < 0 && player2_pieces.indexOf(second_pair) < 0;
        });
    });
    return mv;
}
