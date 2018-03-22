var arr = new Array(4);
var moves = 0, score = 0, flagL = false, flagR = false, flagT = false, flagD = false, emptyTile = true;
var best = localStorage.getItem("2048_best") ? localStorage.getItem("2048_best") : 0;
function resetTiles() {
    moves = 0;
    score = 0;
    initializeArray();
    generateNum();
    generateNum();
    display();
    document.getElementsByClassName('game-container')[0].style.opacity = 1;
}
function getRandomNum(upperLimit, lowerLimit) {
    return Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
}

function generateNum() {
    var a = getRandomNum(3, 0).toString();
    var b = getRandomNum(3, 0).toString();
    if (arr[a][b]) {
        generateNum();
    }
    else {
        if (getRandomNum(3, 0) < 3) {
            arr[a][b] = 2;
        }
        else {
            arr[a][b] = 4;
        }
    }
}


function initializeArray() {
    var i=0,j=0;
    for (i = 0; i < 4; i++) {
        arr[i] = new Array(4);
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            arr[i][j] = 0;
        }
    }
}

function display() {
    var i = 0, j = 0;
    var p;
    emptyTile = true;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (arr[i][j]) {
                p = document.getElementById(i.toString() + j.toString());
                if(arr[i][j]==2){
                    p.style.color = "#D4AC0D";
                }
                else if (arr[i][j] == 4) {
                    p.style.color = "#F39C12";
                }
                else if (arr[i][j] == 8) {
                    p.style.color = "#CA6F1E";
                }
                else if (arr[i][j] == 16) {
                    p.style.color = "#E67E22";
                }
                else if (arr[i][j] == 64) {
                    p.style.color = "#7D6608";
                }
                else if (arr[i][j] == 128) {
                    p.style.color = "#C0392B";
                }
                else if (arr[i][j] == 256) {
                    p.style.color = "#873600";
                }
                else if (arr[i][j] == 512) {
                    p.style.color = "#5D6D7E";
                }
                else if (arr[i][j] == 1024) {
                    p.style.color = "#283747";
                }
                else if (arr[i][j] == 2048) {
                    p.style.color = "#9A7D0A";
                }
                else {
                    p.style.color = "#B03A2E";
                }
                p.innerHTML = arr[i][j];

            }
            else {
                p = document.getElementById(i.toString() + j.toString());
                p.innerHTML = "";
                emptyTile = false;
            }
        }
    }
    updateScoreBoard();
    if(emptyTile){
        checkGameOver();
    }

}

function updateScoreBoard(){
    document.getElementById('moves').innerHTML = moves;
    document.getElementById('score').innerHTML = score;
    if (score > best) {
        best = score;
        document.getElementById('best').innerHTML = best;
        localStorage.setItem('2048_best', best);
    }
}

function checkGameOver() {
    if (moves && !flagD && !flagL && !flagR && !flagT) {
        document.getElementsByClassName('game-container')[0].style.opacity = 0.7;
        showToast("Game Over!!\nYou don't have any moves.");
    } 
}

function myKeyPress(e) {
    var keynum;

    if (window.event) { // IE                    
        keynum = e.keyCode;
    } else if (window.which) { // Netscape/Firefox/Opera/Google                
        keynum = e.which;
    }
    var key=String.fromCharCode(keynum);
    if (keynum == 37) {
        shiftLeft();
    }
    if (keynum == 38) {
        shiftTop();
    }
    if (keynum == 39) {
        shiftRight();
    }
    if (keynum == 40) {
        shiftDown();
    }
    
}


function shiftLeft() {
    var i = 0, j = 1, x = 0, y = 0;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 1; j < 4; j++) {
            x=i;y=j;
            if (arr[x][y] && (arr[x][y - 1] == arr[x][y] || arr[x][y - 1] == 0)) {
                while (y != 0) {
                    if (arr[x][y - 1] == 0) {
                        arr[x][y - 1] = arr[x][y];
                        arr[x][y] = 0;
                        y--;
                        flagL = true;
                    }
                    else if (arr[x][y - 1] == arr[x][y]) {
                        arr[x][y - 1] += arr[x][y];
                        arr[x][y] = 0;
                        score += arr[x][y - 1];
                        y--;
                        flagL = true;
                        
                    }
                    else {
                        y--;
                    }
                }
            }
        }
    }
    if (flagL) {
        generateNum();
        moves++;
    }
    display();
}

function shiftRight() {
    var i = 0, j = 2, x = 0, y = 0;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 2; j >= 0; j--) {
            x = i; y = j;
            if (arr[x][y] && (arr[x][y + 1] == arr[x][y] || arr[x][y + 1] == 0)) {
                while (y != 3) {
                    if (arr[x][y + 1] == 0) {
                        arr[x][y + 1] = arr[x][y];
                        arr[x][y] = 0;
                        y++;
                        flagL = true;
                    }
                    else if (arr[x][y + 1] == arr[x][y]) {
                        arr[x][y + 1] += arr[x][y];
                        arr[x][y] = 0;
                        score += arr[x][y + 1];
                        y++;
                        flagL = true;
                    }
                    else {
                        y++;
                    }
                }
            }
        }
    }
    if (flagL) {
        generateNum();
        moves++;
    }
    display();
}

function shiftTop() {
    var i = 0, j = 1, x = 0, y = 0;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 1; j < 4; j++) {
            x = j; y = i;
            if (arr[x][y] && (arr[x - 1][y] == arr[x][y] || arr[x - 1][y] == 0)) {
                while (x != 0) {
                    if (arr[x-1][y] == 0) {
                        arr[x-1][y] = arr[x][y];
                        arr[x][y] = 0;
                        x--;
                        flagT = true;
                    }
                    else if (arr[x-1][y] == arr[x][y]) {
                        arr[x-1][y] += arr[x][y];
                        arr[x][y] = 0;
                        score += arr[x - 1][y];
                        x--;
                        flagT = true;
                    }
                    else {
                        x--;
                    }
                }
            }
        }
    }
    if (flagT) {
        generateNum();
        moves++;
    }
    display();
}

function shiftDown() {
    var i = 0, j = 2, x = 0, y = 0;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 2; j >=0 ; j--) {
            x = j; y = i;
            if (arr[x][y] && (arr[x + 1][y] == arr[x][y] || arr[x + 1][y] == 0)) {
                while (x != 3) {
                    if (arr[x + 1][y] == 0) {
                        arr[x + 1][y] = arr[x][y];
                        arr[x][y] = 0;
                        x++;
                        flagD = true;
                    }
                    else if (arr[x + 1][y] == arr[x][y]) {
                        arr[x + 1][y] += arr[x][y];
                        arr[x][y] = 0;
                        score += arr[x + 1][y];
                        x++;
                        flagD = true;
                    }
                    else {
                        x++;
                    }
                }
            }
        }
    }
    if (flagD) {
        generateNum();
        moves++;
    }
    display();
}

function showToast(message) {
    var toast = document.getElementById('toast-container');
    document.getElementById("toast-message").textContent = message;
    toast.className = "show";
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}


window.onload = function () {
    document.getElementById('best').innerHTML = best;
    initializeArray();
    generateNum();
    generateNum();
    display();
    window.addEventListener("keyup", myKeyPress);
	$('.game-container').swipe({
	swipeLeft:function(event, direction, distance, duration, fingerCount) {
							shiftLeft();
							event.preventDefault();
						},
	swipeRight:function(event, direction, distance, duration, fingerCount) {
							shiftRight();
							event.preventDefault();
						},
	swipeUp:function(event, direction, distance, duration, fingerCount) {
							shiftTop();
							event.preventDefault();
						},
	swipeDown:function(event, direction, distance, duration, fingerCount) {
							shiftDown();
							event.preventDefault();
						},
});
}