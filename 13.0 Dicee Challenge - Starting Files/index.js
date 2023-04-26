function rollDice() {
    var titleElement = document.querySelector("h1");

    var randomNumber1 = Math.floor((Math.random() * 6) + 1);
    var dice1 = document.querySelector(".img1");

    dice1.setAttribute("src", "./images/dice" + randomNumber1 + ".png");

    var randomNumber2 = Math.floor((Math.random() * 6) + 1);
    var dice2 = document.querySelector(".img2");

    dice2.setAttribute("src", "./images/dice" + randomNumber2 + ".png");

    if (randomNumber1 > randomNumber2) {
        titleElement.textContent = "Player1 Wins!";
    } else if (randomNumber2 > randomNumber1) {
        titleElement.textContent = "Player2 Wins!";
    } else {
        titleElement.textContent = "Draw!"
    }


}
