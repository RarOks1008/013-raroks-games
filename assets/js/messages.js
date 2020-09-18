function fill_player_info (player, status) {
    var player_text = player == "player1" ? "Player 1" : "Player 2";
    $(".player_info").html(player_text);
    $(".toplay_info").html(status);
}
function player_notification(message) {
    var opacity = 1;
    $(".play_message").html(message);
    $(".play_message").css("opacity", opacity);
    $(".play_message").addClass("show_message");
    setTimeout( function () {
        var opacity_interval = setInterval(function() {
            if (opacity <= 0) {
                clearInterval(opacity_interval);
                $(".play_message").removeClass("show_message");
            }
            $(".play_message").css("opacity", opacity);
            opacity -= 0.1;
        }, 100);
    }, 3000);
}
function declare_endgame(winner) {
    var cong_text = "Congratulations " + (winner == "player1" ? "Player 1" : "Player 2");
    $(".victory_screen .congratulation_text").html(cong_text)
    $(".victory_screen").addClass("show_screen");
}
function rules_clicked() {
    $(".rules_holder").addClass("show_rules");
    $(".rules_holder .close_rules").on("click", function () {
        $(".rules_holder").removeClass("show_rules");
    });
}
