var arr = new Array(4);
var moves = 0, score = 0, flagL = false, flagR = false, flagT = false, flagD = false, emptyTile = true;
var best = localStorage.getItem("2048_best") ? localStorage.getItem("2048_best") : 0;
var newAnimation=[], joinAnimation=[], addScoreAnimationPos=[];
var GamePlatform = {
    isGameOver: false,
    detachSwipe: false,
    showToast: function(message) {
        var toast = document.getElementById('toast-container');
        document.getElementById("toast-message").textContent = message;
        toast.className = "show";
        setTimeout(function () {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    },

    showModal: function(type, msg, showButtons){
        var info = document.getElementById('info-container');
        document.getElementById("info-message").textContent = msg;
        switch(type){
            case 'info':
                $('#info-ok').show();
                $('#info-cancel').hide();
                $('#info-yes').hide();
                break;
            case 'restart':
                $('#info-yes').show();
                $('#info-cancel').show();
                $('#info-ok').hide();
                break;
        }
        info.className = "show";
        document.getElementsByClassName('game-container')[0].style.opacity = 0.5;
        GamePlatform.detachSwipe = true;
    },

    showInformation: function() {
        var msg = 'Swipe right, left, up and down to add the numbers shown in tile, and make the tile with number 2048.';
        var showButtons = false;
        GamePlatform.showModal('info', msg, showButtons);
    },

    hideInformation: function(){
        document.getElementById('info-container').classList.replace("show", "hide");
        GamePlatform.detachSwipe = false;
        if(!GamePlatform.isGameOver){
            document.getElementsByClassName('game-container')[0].style.opacity = 1;
        }
    },

    restartGame: function(){
        var msg = 'Do you want to restart the game?';
        var showButtons = true;
        GamePlatform.showModal('restart', msg, showButtons);
    }
}

var GameContainer = {
    length: 0,
    tileLength: 0,
    setTile: function(){
        var screenWidth = window.screen.width-24;
        var screenHeight = window.screen.height-24;
        if(screenWidth <= screenHeight){
            GameContainer.length = screenWidth;
        }else {
            GameContainer.length = screenHeight/2;
        }
        GameContainer.tileLength = GameContainer.length / 4 - 4;
        var gameContainer = document.getElementsByClassName('game-container')[0];
        gameContainer.style.width = GameContainer.length + 'px';
        gameContainer.style.height = GameContainer.length + 'px';
        var tiles = document.getElementsByClassName('tile');
        for(let i=0; i < tiles.length; i++){
            tiles[i].style.width = GameContainer.tileLength + 'px';
            tiles[i].style.height = GameContainer.tileLength + 'px';
        }
    },

    addSwipeEvent: function(){
        $('.game-container').swipe({
            swipeLeft:function(event, direction, distance, duration, fingerCount) {
                                    if(!GamePlatform.detachSwipe){
                                        shiftLeft();
                                        event.preventDefault();
                                    }
                                },
            swipeRight:function(event, direction, distance, duration, fingerCount) {
                                    if(!GamePlatform.detachSwipe){
                                        shiftRight();
                                        event.preventDefault();
                                    }
                                },
            swipeUp:function(event, direction, distance, duration, fingerCount) {
                                    if(!GamePlatform.detachSwipe){
                                        shiftTop();
                                        event.preventDefault();
                                    }
                                },
            swipeDown:function(event, direction, distance, duration, fingerCount) {
                                    if(!GamePlatform.detachSwipe){
                                        shiftDown();
                                        event.preventDefault();
                                    }
                                },
        });
    },

    showAddScore: function(diff){
        var el = document.getElementById('addScore');
        el.innerHTML = '+' + diff;
        var __css = `@keyframes addScoreAnimation{
                        0%{ opacity: 1; top: `+addScoreAnimationPos[0]+`px;z-index:1;} 
                        90%{ opacity: 0.2;top: `+addScoreAnimationPos[1]+`px;z-index:1; }
                        100%{ opacity: 0; z-index:0; }
                    }`;
        $('#addScore').append('<style type="text/css">' + __css + '</style>');
        if(el.classList.contains('addScoreMove')){
            el.classList.remove('addScoreMove');
        }
        void el.offsetWidth;
        el.classList.add('addScoreMove'); 
    }
}
    

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
        newAnimation.push(a+''+b);
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

function showAnimation(el, animationToBeAdded){
    if(el.classList.contains('newAnimation')){
        el.classList.remove('newAnimation');
    }
    if(el.classList.contains('joinAnimation')){
        el.classList.remove('joinAnimation');
    }
    void el.offsetWidth;
    el.classList.add(animationToBeAdded);
}

function display() {
    var i = 0, j = 0, index;
    var tileData, tileDataParent;
    emptyTile = true;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            tileData = document.getElementById(i.toString() + j.toString());
            tileDataParent = tileData.parentElement;
            if (arr[i][j]) {
                index = newAnimation.indexOf(i+''+j);
                if(index != -1){
                    showAnimation(tileDataParent, 'newAnimation');
                    newAnimation.splice(index, 1);
                }
                index = joinAnimation.indexOf(i+''+j);
                if(index != -1){
                    showAnimation(tileDataParent, 'joinAnimation');
                    joinAnimation.splice(index,1);
                }
                switch(arr[i][j]){
                    case 2:
                        tileDataParent.style.backgroundColor = "#ccebff";
                        break;
                    case 4:
                        tileDataParent.style.backgroundColor = "#b3e0ff";
                        break;
                    case 8:
                        tileDataParent.style.backgroundColor = "#99d6ff";
                        break;
                    case 16:
                        tileDataParent.style.backgroundColor = "#80ccff";
                        break;
                    case 32:
                        tileDataParent.style.backgroundColor = "#66c2ff";
                        break;
                    case 64:
                        tileDataParent.style.backgroundColor = "#4db8ff";
                        break;
                    case 128:
                        tileDataParent.style.backgroundColor = "#33adff";
                        break;
                    case 256:
                        tileDataParent.style.backgroundColor = "#1aa3ff";
                        break;
                    case 512:
                        tileDataParent.style.backgroundColor = "#0099ff";
                        break;
                    case 1024:
                        tileDataParent.style.backgroundColor = "#008ae6";
                        break;
                    case 2048:
                        tileDataParent.style.backgroundColor = "#007acc";
                        break;
                    case 4096:
                        tileDataParent.style.backgroundColor = "#006bb3";
                        break;
                    default:
                        tileDataParent.style.backgroundColor = "#005c99";
                }
                tileData.innerHTML = arr[i][j];

            }
            else {
                tileData.innerHTML = "";
                tileDataParent.style.backgroundColor = "#e6f5ff";
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
    var i,j;
    GamePlatform.isGameOver=true;
    if (moves && !flagD && !flagL && !flagR && !flagT) {
        for(i=0;i<4;i++){
            for(j=0; j<3; j++){
                if(arr[i][j]==arr[i][j+1] || arr[j][i]==arr[j+1][i]){
                    GamePlatform.isGameOver=false;
                    break;
                }
            }
        }
        if(GamePlatform.isGameOver){
            document.getElementsByClassName('game-container')[0].style.opacity = 0.7;
            GamePlatform.showToast("Game Over!!\nYou don't have any moves.");
        }
    } 
}

function myKeyPress(e) {
    var keynum;
    if(!GamePlatform.detachSwipe){
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
}


function shiftLeft() {
    var i = 0, j = 1, k=0, x = 0, y = 0, index, isShiftNeeded, oldScore = score;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 1; j < 4; j++) {
            for(k=j;k>0;k--){
                if (arr[i][k - 1] == 0 && arr[i][k]!=0) {
                    arr[i][k - 1] = arr[i][k];
                    arr[i][k] = 0;
                    flagL = true;
                }
            }
        }
        for (j = 1; j < 4; j++) {
            isShiftNeeded = false;
            if (arr[i][j] && (arr[i][j - 1] == arr[i][j])) {
                arr[i][j - 1] += arr[i][j];
                arr[i][j] = 0;
                score += arr[i][j - 1];
                joinAnimation.push(i+''+(j-1));
                flagL = true;
                isShiftNeeded = true;
            }
            if(isShiftNeeded){
                for(k=j;k<=3;k++){
                    if (arr[i][k - 1] == 0 && arr[i][k]!=0) {
                        arr[i][k - 1] = arr[i][k];
                        arr[i][k] = 0;
                        index = joinAnimation.indexOf(i+''+k);
                        if(index != -1){
                            joinAnimation[index]=i+''+(k-1);
                        }
                        flagL = true;
                    }
                }
            }
        }
    }
    var diff = score - oldScore
    if(diff > 0){
        GameContainer.showAddScore(diff);
    }
        
    if (flagL) {
        generateNum();
        moves++;
    }
    display();
}

function shiftRight() {
    var i = 0, j = 2, k=0, x = 0, y = 0,index, isShiftNeeded, oldScore = score;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 2; j >= 0; j--) {
            for(k=j;k<3;k++){
                if (arr[i][k + 1] == 0 && arr[i][k]!=0) {
                    arr[i][k + 1] = arr[i][k];
                    arr[i][k] = 0;
                    flagR = true;
                }
            }
        }
        for (j = 2; j >= 0; j--) {
            isShiftNeeded = false;
            if (arr[i][j] && (arr[i][j + 1] == arr[i][j])) {
                arr[i][j + 1] += arr[i][j];
                arr[i][j] = 0;
                score += arr[i][j + 1];
                joinAnimation.push(i+''+(j+1));
                flagR = true;
                isShiftNeeded = true;
            }
            if(isShiftNeeded){
                for(k=j;k>=0;k--){
                    if (arr[i][k + 1] == 0 && arr[i][k]!=0) {
                        arr[i][k + 1] = arr[i][k];
                        arr[i][k] = 0;
                        index = joinAnimation.indexOf(i+''+k);
                        if(index != -1){
                            joinAnimation[index]=i+''+(k+1);
                        }
                        flagR = true;
                    }
                }
            }
        }
    }
    var diff = score - oldScore
    if(diff > 0){
        GameContainer.showAddScore(diff);
    }
        
    if (flagR) {
        generateNum();
        moves++;
    }
    display();
}

function shiftTop() {
    var i = 0, j = 1,k=0, x = 0, y = 0,index, isShiftNeeded, oldScore = score;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 1; j < 4; j++) {
            for(k=j;k>0;k--){
                if (arr[k - 1][i] == 0 && arr[k][i]!=0) {
                    arr[k-1][i] = arr[k][i];
                    arr[k][i] = 0;
                    flagT = true;
                }
            }
        }
        for (j = 1; j < 4; j++) {
            isShiftNeeded = false;
            if (arr[j][i] && (arr[j-1][i] == arr[j][i])) {
                arr[j-1][i] += arr[j][i];
                arr[j][i] = 0;
                score += arr[j-1][i];
                joinAnimation.push((j-1)+''+i);
                flagT = true;
                isShiftNeeded =true;
            }
            if(isShiftNeeded){
                for(k=j;k<=3;k++){
                    if (arr[k - 1][i] == 0 && arr[k][i]!=0) {
                        arr[k-1][i] = arr[k][i];
                        arr[k][i] = 0;
                        index = joinAnimation.indexOf(k+''+i);
                        if(index != -1){
                            joinAnimation[index]=(k-1)+''+i;
                        }
                        flagT = true;
                    }
                }
            }
        }
    }
    var diff = score - oldScore
    if(diff > 0){
        GameContainer.showAddScore(diff);
    }
        
    if (flagT) {
        generateNum();
        moves++;
    }
    display();
}

function shiftDown() {
    var i = 0, j = 2, k=0, x = 0, y = 0,index, isShiftNeeded, oldScore = score;
    flagL = false;
    flagD = false;
    flagR = false;
    flagT = false;
    for (i = 0; i < 4; i++) {
        for (j = 2; j >=0 ; j--) {
            for(k=j;k<3;k++){
                if (arr[k+1][i] == 0 && arr[k][i]!=0) {
                    arr[k+1][i] = arr[k][i];
                    arr[k][i] = 0;
                    flagD = true;
                }
            }
        }
        for (j = 2; j >= 0; j--) {
            isShiftNeeded = false;
            if (arr[j][i] && (arr[j+1][i] == arr[j][i])) {
                arr[j+1][i] += arr[j][i];
                arr[j][i] = 0;
                score += arr[j+1][i];
                joinAnimation.push((j+1)+''+i);
                flagD = true;
                isShiftNeeded = true;
            }
            if(isShiftNeeded){
                for(k=j;k>=0;k--){
                    if (arr[k+1][i] == 0 && arr[k][i]!=0) {
                        arr[k+1][i] = arr[k][i];
                        arr[k][i] = 0;
                        index = joinAnimation.indexOf(k+''+i);
                        if(index != -1){
                            joinAnimation[index]=(k+1)+''+i;
                        }
                        flagD = true;
                    }
                }
            }
        }
    }
    var diff = score - oldScore
    if(diff > 0){
        GameContainer.showAddScore(diff);
    }
        
    if (flagD) {
        generateNum();
        moves++;
    }
    display();
}

function getPosition(ele) {
    var position = ele.getBoundingClientRect();
    return {
        x: position.x,
        y: position.y,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        width: ele.offsetWidth,
        height: ele.offsetHeight
    }
}

function setAddScore(){
    var el = document.getElementById('addScore');
    var gameContainer = document.getElementsByClassName('game-container')[0];
    var gameContainerPosition = getPosition(gameContainer);
    el.style.top = gameContainerPosition.y + 'px';
    el.style.left = gameContainerPosition.x + gameContainerPosition.width/2 - 20 + 'px' ;

    var scoreEl = document.getElementById('score');
    var scoreElPosition = getPosition(scoreEl);
    addScoreAnimationPos[0] = gameContainerPosition.y-20;
    addScoreAnimationPos[1] = scoreElPosition.y+ 25; //scoreElPosition.height/2;
}


window.onload = function () {
    GameContainer.setTile();
    setAddScore();
    document.getElementById('best').innerHTML = best;
    resetTiles();
    window.addEventListener("keyup", myKeyPress);
    GameContainer.addSwipeEvent();
    $('.infoIcon').on('click', GamePlatform.showInformation);
    $('.closeIcon').on('click', GamePlatform.hideInformation);
    $('.refreshIcon').on('click', GamePlatform.restartGame);
    $('#info-yes').on('click', function(){
        resetTiles();
        GamePlatform.hideInformation();
    });
    $('#info-cancel').on('click', GamePlatform.hideInformation);
    $('#info-ok').on('click', GamePlatform.hideInformation);
}