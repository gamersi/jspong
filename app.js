var b;
var f;
var p;

function randomIntBetween(min, max) { 
    return Math.random() * (max - min + 1) + min
}
  

function Ball() {
    this.ballX = 0;
    this.ballY = 0;
    this.velocityX = -1;
    this.velocityY = 1;
    this.width = 20;
    this.velMin = -1.5;
    this.velMax = 1.3;
    this.height = this.width;
    this.ballElem = document.getElementById("ball");
    this.initBall = () => {
        this.ballElem.style.width = `${this.width}px`;
        this.ballX = (f.width / 2);
        this.ballY = (f.height / 2);
        this.velocityX = this.velocityX * randomIntBetween(this.velMin,this.velMax)
        this.velocityY = this.velocityY * randomIntBetween(this.velMin,this.velMax)
        while(this.velocityX >= -0.5 && this.velocityX <= 0.5){
            this.velocityX = this.velocityX * randomIntBetween(this.velMin,this.velMax)
        }
        while(this.velocityY >= -0.5 && this.velocityY <= 0.5) {
            this.velocityY = this.velocityY * randomIntBetween(this.velMin,this.velMax)
        }
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
    this.pedalSpeed = 1;
    // this.AIImperfecion = 1;
    this.moveInterval = [];
    this.scoreRight = 0;
    this.initPedals = () => {
        this.leftY = f.height / 2;
        this.rightY = f.height / 2;
        this.updatePositions();
        document.addEventListener("keydown", this.keyDown)
        document.addEventListener("keyup", this.keyUp)
    }
    this.stopInterval = (interval) => {
        clearInterval(this.moveInterval[interval]);
        this.moveInterval.splice(interval, 1)
    }
    this.keyDown = (e) => {
        if(e.code == "ArrowUp"){
            this.moveInterval.push(setInterval(() => {
                console.log("set interval" + this.moveInterval);
                if((this.leftY - (this.height / 2)) > 0) this.leftY -= this.pedalSpeed;
                if(this.moveInterval.length > 1){
                    this.stopInterval(0)
                }
            }, 1000 / 500));
        } else if(e.code == "ArrowDown") {
            this.moveInterval.push(setInterval(() => {
                console.log("set interval" + this.moveInterval);
                if((this.leftY + (this.height / 2)) < f.height) this.leftY += this.pedalSpeed;
                if(this.moveInterval.length > 1){
                    this.stopInterval(0)
                }
            }, 1000 / 500));
        }
    }
    this.keyUp = (e) => {
        console.log("Keyup" + this.moveInterval.length)
        if(this.moveInterval.length > 0){
            if(this.moveInterval.length > 1) return console.error("RIP")
            clearInterval(this.moveInterval[0])
            console.log("cleared Interval" + this.moveInterval)
            this.moveInterval.splice(0, 1)
        } else {
            console.error("Requested KeyUp but key was never down")
        }
    }
    this.updatePositions = () => {
        this.pedalLeftElem.style.top = `${this.leftY - (this.height / 2)}px`;
        this.pedalRightElem.style.top = `${this.rightY - (this.height / 2)}px`;
    }
}

function Field() {
    this.fieldElem = document.getElementById("field");
    this.scoreElem = document.getElementById("score");
    this.fpsElem = document.getElementById("fps");
    this.width = this.fieldElem.offsetWidth;
    this.height = this.fieldElem.offsetHeight;
    this.initGame = () => {
        this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if(this.isFirefox) return window.location.href = "/unsupported"
        b = new Ball();
        b.initBall();
        p = new Pedals();
        p.initPedals();
        window.addEventListener("resize", this.resize)
        this.then = Date.now() / 1000;
        this.updateInterval = setInterval(this.update, 1000 / 500);
    }
    this.resize = (e) => {
        // b.initBall();
        // p.initPedals();
        this.width = this.fieldElem.offsetWidth;
        this.height = this.fieldElem.offsetHeight;
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


        //right pedal AI
        if(b.ballY < p.rightY && (p.rightY - (p.height / 2)) > 0){
            p.rightY -= p.pedalSpeed /*+ p.AIImperfecion*/
        }

        if(b.ballY > p.rightY && (p.rightY + (p.height / 2)) < this.height) {
            p.rightY += p.pedalSpeed /*+ p.AIImperfecion*/
        }

        //lose
        if (b.ballX <= (b.width / 2) || b.ballX >= this.width - (b.width / 2)) {
            if(b.ballX <= (b.width / 2)){
                p.scoreLeft += 1;
                this.scoreElem.textContent = `${p.scoreLeft}|${p.scoreRight}`
            }
            if(b.ballX >= this.width - (b.width / 2)) {
                p.scoreRight += 1;
                this.scoreElem.textContent = `${p.scoreLeft}|${p.scoreRight}`
            }
            b.initBall();
            p.initPedals();
        }
        b.updatePositions();
        p.updatePositions();
        
        //fps
        this.now = Date.now() / 1000;  

        this.elapsedTime = this.now - this.then;
        this.then = this.now;
        
        this.fps = 1 / this.elapsedTime;
        this.fpsElem.innerText = this.fps.toFixed(2); 
    }
}

window.onload = () => {
    f = new Field();
    f.initGame();
}