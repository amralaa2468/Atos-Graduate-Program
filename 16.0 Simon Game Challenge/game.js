var level = 0;
var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

function nextSequence() {
    level++;
    $("h1").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];


    gamePattern.push(randomChosenColor);

    $("#" + randomChosenColor).fadeOut(100).fadeIn(100);

    playSound(randomChosenColor);
}

$(".btn").on("click", function () {
    var userChosenColor = "";

    userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);

    checkAnswer();

});

function playSound(name) {
    var colorAudio = new Audio("./sounds/" + name + ".mp3");
    colorAudio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");

    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);

}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function checkAnswer() {
    if (gamePattern.length === userClickedPattern.length) {
        if (arrayEquals(gamePattern, userClickedPattern) === true) {

            console.log("success");
            
            setTimeout(function () {
                nextSequence();
            }, 1000);

            userClickedPattern = [];

        } else {

            console.log("wrong");

            playSound("wrong");
            
            $("body").addClass("game-over");

            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 200);

            $("h1").text("Game Over, Press Me to Restart");
            startOver();

        }
    }

}

function startOver() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
}

$("h1").on("click", function () {
    nextSequence();
    $("h1").text("Level " + level);
});