var b;
var f;
var p;

function Ball() {
    this.ballX = 0;
    this.ballY = 0;
    this.velocityX = -1;
    this.velocityY = 1;
    this.width = 20;
    this.height = this.width;
    this.ballElem = document.getElementById("ball");
    this.initBall = () => {
        this.ballElem.style.width = `${this.width}px`;
        this.ballX = (f.width / 2);
        this.ballY = (f.height / 2);
        this.updatePositions();
    }
    this.updatePositions = () => {
        this.ballElem.style.top = `${this.ballY - (this.width / 2)}px`;
        this.ballElem.style.left = `${this.ballX - (this.width / 2)}px`;
    }
}

function Pedals() {
    this.pedalLeftElem = document.getElementById("pedalLeft");
    this.pedalRightElem = document.getElementById("pedalRight");
    this.leftY = 5;
    this.rightY = 5;
    this.height = 100;
    this.width = 10;
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.initPedals = () => {
        this.leftY = f.height / 2;
        this.rightY = f.height / 2;
        this.updatePositions();
    }
    this.updatePositions = () => {
        this.pedalLeftElem.style.top = `${this.leftY - (this.height / 2)}px`;
        this.pedalRightElem.style.top = `${this.rightY - (this.height / 2)}px`;
    }
}

function Field() {
    this.fieldElem = document.getElementById("field");
    this.scoreElem = document.getElementById("score");
    this.width = this.fieldElem.offsetWidth;
    this.height = this.fieldElem.offsetHeight;
    this.initGame = () => {
        b = new Ball();
        b.initBall();
        p = new Pedals();
        p.initPedals();
        this.updateInterval = setInterval(this.update, 1000 / 500);
    }
    this.update = () => {
        b.ballX += b.velocityX;
        b.ballY += b.velocityY;
        //bounce
        if (b.ballY  >= this.height - (b.width / 2) || b.ballY <= (b.width / 2)) {
            b.velocityY = b.velocityY * (-1);
        }
        //pedals
        //left
        if(b.ballY >= p.leftY - (p.height / 2) && b.ballY <= p.leftY + (p.height / 2)
            && b.ballX <= 25){
                b.velocityX = b.velocityX * (-1);
        }
        //right
        if(b.ballY >= p.rightY - (p.height / 2) && b.ballY <= p.rightY + (p.height / 2)
            && b.ballX >= this.width-25){
                b.velocityX = b.velocityX * (-1);
        }
        //lose
        if (b.ballX <= (b.width / 2) || b.ballX >= this.width - (b.width / 2)) {
            alert("You lost!");
            b.initBall();
            p.initPedals();
        }
        b.updatePositions();
    }
}

window.onload = () => {
    f = new Field();
    f.initGame();
}