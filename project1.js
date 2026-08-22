const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const endGame = document.querySelector(".game-over");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const blockHeight = 30;
const blockwidth = 30;
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;
highScoreElement.textContent = highScore;

const rows = Math.floor(board.clientHeight/blockHeight);
const cols = Math.floor(board.clientWidth/blockwidth);

const blocks = [];
let snake = [{x:1,y:5},{x:1,y:4},{x:1,y:3}];
let direction = "right";
let food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
let intervalId = null;
let timerId = null;


// making the board
for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
    }
}

// snake running logic
function render(){
    let head = null;
    // Creating the food
    blocks[`${food.x}-${food.y}`].classList.add("food");

    // changing the snake direction
    if(direction==="left")
    head = {x:snake[0].x, y:snake[0].y-1};
    if(direction==="right")
    head = {x:snake[0].x, y:snake[0].y+1};
    if(direction==="up")
    head = {x:snake[0].x-1, y:snake[0].y};
    if(direction==="down")
    head = {x:snake[0].x+1, y:snake[0].y};

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    
    // adding and removing food (food consuming logic)
    if(food.x === head.x && food.y === head.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;
    }
    
    // Terminating the game
    if(head.x < 0 || head. x >= rows || head.y < 0 || head.y >= cols){
        // updating highScore
        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore",highScore.toString());
            score = 0;
        }
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        clearInterval(intervalId);
        clearInterval(timerId);
        modal.style.display = "flex";
        startGame.style.display = "none";
        endGame.style.display = "flex";
        return;
    }
    
    // if snake bites itself
    for(let i=1; i<snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            clearInterval(intervalId);
            clearInterval(timerId);

            modal.style.display = "flex";
            startGame.style.display = "none";
            endGame.style.display = "flex";

            return;
        }
    }

    snake.unshift(head);
    snake.pop();
    
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

// functionality of start button
startButton.addEventListener("click",()=>{
    modal.style.display = "none";
    intervalId = setInterval(() => {render()}, 200);
    timerId = setInterval(()=>{
        let [min,sec] = time.split("-").map(Number);
        if(sec==59){
            min+=1;
            sec=0;
        }
        else
        sec+=1;

        time = `${min}-${sec}`;
        timeElement.textContent = time;  
    },1000);
});

// functionality of restart button
restartButton.addEventListener("click",restartGame);
function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    modal.style.display = "none";

    // Resetting scores
    score = 0;
    time = `00-00`;
    highScoreElement.textContent = highScore;
    scoreElement.textContent = score;
    timeElement.textContent = time;

    // Restarting timer
    timerId = setInterval(()=>{
        let [min,sec] = time.split("-").map(Number);
        if(sec==59){
            min+=1;
            sec=0;
        }
        else
        sec+=1;

        time = `${min}-${sec}`;
        timeElement.textContent = time;  
    },1000);

    // resetting the snake
    snake = [{x:1,y:5},{x:1,y:4},{x:1,y:3}];
    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
    direction = "right";
    intervalId = setInterval(() => {
        render();
    }, 200);

}

// fetching the direction through arrow keys from the keyboard
addEventListener("keydown",(event)=>{
    if(event.key === "ArrowUp"){
        if(direction==="down")
        direction = "down";
        else
        direction = "up";
    }
    
    if(event.key === "ArrowDown"){
        if(direction==="up")
        direction = "up";
        else
        direction = "down";
    }
   
    if(event.key === "ArrowRight"){
        if(direction==="left")
        direction = "left";
        else
        direction = "right";
    }
 
    if(event.key === "ArrowLeft"){
        if(direction==="right")
        direction = "right";
        else
        direction = "left";
    }
    
});