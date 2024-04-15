const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const userStart = [230, 10]
const ballStart = [270, 40]
const boardWidth = 560
const boardHeight = 300
const ballDiameter = 20
let ballPosition = ballStart
let currentPosition = userStart
let timerId
let xDirection = -2
let yDirection = 2
let score = 0

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240)
]

function addBlocks() {
    for (let i = 0; i < blocks.length; ++i) {
        const block = document.createElement('div');
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)    
    }
}
addBlocks()

function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

function drawBall() {
    ball.style.left = ballPosition[0] + 'px'
    ball.style.bottom = ballPosition[1] + 'px'
}

const user = document.createElement('div')
user.classList.add('user')
user.style.left = currentPosition[0] + 'px'
user.style.bottom = currentPosition[1] + 'px'
grid.appendChild(user)

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft' :
        if (currentPosition[0] > 0) {
            currentPosition[0] -= 10
            drawUser()
        }
        break;
        case 'ArrowRight' :
        if (currentPosition[0] < 460) {
            currentPosition[0] += 10
            drawUser()
        }
        break;
    }
}

//GAMESTATES

function startGame() {
    document.addEventListener('keydown', moveUser)
    timerId = setInterval(moveBall, 50)
    document.getElementById('startButton').remove()
}

let gamepause = 0;

function pauseGame(){
    if (gamepause === 0) {
        document.removeEventListener('keydown', moveUser)
        clearInterval(timerId)
        gamepause = 1
    } else {
        document.addEventListener('keydown', moveUser)
        timerId = setInterval(moveBall, 50)
        gamepause = 0
    }
}

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

// COLLISION
function checkForCollision() {
    if (ballPosition[0] + 10 > currentPosition[0] && ballPosition[0] + 10 < currentPosition[0] + blockWidth &&
        ballPosition[1] > currentPosition[1] && ballPosition[1] < currentPosition[1] + blockHeight) {
            changeDirection()
        }
    for (let i = 0; i < blocks.length ; ++i) {
        if (ballPosition[0] > blocks[i].bottomLeft[0] && ballPosition[0] + 10 < blocks[i].bottomRight[0] &&
            (ballPosition[1] + 10) > blocks[i].bottomLeft[1] && ballPosition[1] - 10 < blocks[i].topLeft[1]) {
                const allBlocks = Array.from(document.querySelectorAll('.block'))
                allBlocks[i].classList.remove('block')
                blocks.splice(i, 1)
                changeDirection()
                score++
                scoreDisplay.innerHTML = score
        } 
        if (blocks.length === 0) {
            scoreDisplay.innerHTML = "YOU WIN"
            clearInterval(timerId)
            document.removeEventListener('keydown', moveUser)
        }
    }
    if (ballPosition[0] >= boardWidth - ballDiameter ||
        ballPosition[1] >= boardHeight - ballDiameter ||
        ballPosition[0] <= 0) {
        changeDirection()
    }
    if (ballPosition[1] <= 0) {
        scoreDisplay.innerHTML = 'You lose'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
    }
}

// MOVEMENT

function moveBall() {
    ballPosition[0] += xDirection
    ballPosition[1] += yDirection
    drawBall()
    checkForCollision()
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        console.log('hit up-right')
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        console.log('hit low-right')
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        console.log('hit low-left')
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        console.log('hit up-left')
        return
    }
}