let b,
    p,
    f;

function randomIntBetween(min, max) {
    return Math.random() * (max - min + 1) + min
}


function Ball() {
    this.ballX = 0;
    this.ballY = 0;
    this.velocityX = -1;
    this.velocityY = 1;
    this.width = 20;
    this.halfWidth = this.width / 2;
    this.velMin = -1.3;
    this.velMax = 1.3;
    this.height = this.width;
    this.ballElem = document.getElementById("ball");
    this.initBall = () => {
        this.velocityX = -1;
        this.velocityY = 1;
        this.ballElem.style.width = `${this.width}px`;
        this.ballX = (f.width / 2);
        this.ballY = (f.height / 2);
        this.velocityX = this.velocityX * randomIntBetween(this.velMin, this.velMax)
        this.velocityY = this.velocityY * randomIntBetween(this.velMin, this.velMax)

        while (this.velocityX >= -0.5 && this.velocityX <= 0.5) {
            this.velocityX = -1 * randomIntBetween(this.velMin, this.velMax)
        }

        while (this.velocityY >= -0.5 && this.velocityY <= 0.5) {
            this.velocityY = 1 * randomIntBetween(this.velMin, this.velMax)
        }

        this.updatePositions();
    }
    this.updatePositions = () => {
        this.ballElem.style.top = `${this.ballY - this.halfWidth}px`;
        this.ballElem.style.left = `${this.ballX - this.halfWidth}px`;
    }
}

function Pedals() {
    this.pedalLeftElem = document.getElementById("pedalLeft");
    this.pedalRightElem = document.getElementById("pedalRight");
    this.leftY = 5;
    this.rightY = 5;
    this.height = 100;
    this.halfHeight = this.height / 2;
    this.width = 10;
    this.scoreLeft = 0;
    this.pedalSpeed = 1;
    // if the screen height is higher than the width, the pedal speed is increased
    if (f.height > f.width) {
        this.pedalSpeed = 2;
    }
    this.scoreRight = 0;
    this.initPedals = () => {
        this.leftY = f.height / 2;
        this.rightY = f.height / 2;
        this.updatePositions();
    }
    this.updatePositions = () => {
        this.pedalLeftElem.style.top = `${this.leftY - (this.halfHeight)}px`;
        this.pedalRightElem.style.top = `${this.rightY - (this.halfHeight)}px`;
    }
}

function Field() {
    this.fieldElem = document.getElementById("field");
    this.scoreElem = document.getElementById("score");
    this.width = this.fieldElem.offsetWidth;
    this.height = this.fieldElem.offsetHeight;
    this.animationFrameId = null;
    this.pressedKeys = [];
    this.opAI = false;
    this.lastTapTime = 0;
    this.doubleTapSpeed = 300;

    this.initGame = () => {
        b = new Ball();
        b.initBall();
        p = new Pedals();
        p.initPedals();
        if (localStorage.getItem("opAI") === "true") {
            this.opAI = true;
        }
        window.addEventListener("resize", this.resize)
        this.animationFrameId = requestAnimationFrame(this.update);
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
        // touchscreen support
        window.addEventListener("touchstart", this.touchStart);
        window.addEventListener("touchmove", this.touchMove);
        window.addEventListener("touchend", this.touchEnd);
    }
    this.keyDown = (e) => {
        this.pressedKeys[e.code] = true;
        if (e.code === "Escape" && !this.isPaused) {
            this.pauseGame();
            this.isPaused = true;
        }
        else if (e.code === "Escape" && this.isPaused) {
            this.resumeGame();
            this.isPaused = false;
        }
    }
    this.keyUp = (e) => {
        this.pressedKeys[e.code] = false;
    }
    this.touchStart = (e) => {
        if (e.touches.length > 0) {
            if (e.touches[0].clientY <= this.height / 2) {
                this.pressedKeys["ArrowUp"] = true;
            } else {
                this.pressedKeys["ArrowDown"] = true;
            }
        }
    }
    this.touchMove = (e) => {
        if (e.touches.length > 0) {
            if (e.touches[0].clientY <= this.height / 2) {
                this.pressedKeys["ArrowUp"] = true;
                this.pressedKeys["ArrowDown"] = false;
            } else {
                this.pressedKeys["ArrowDown"] = true;
                this.pressedKeys["ArrowUp"] = false;
            }
        }
    }
    this.touchEnd = (e) => {
        if (e.changedTouches.length > 0) {
            if (e.changedTouches[0].clientY <= this.height / 2) {
                this.pressedKeys["ArrowUp"] = false;
            } else {
                this.pressedKeys["ArrowDown"] = false;
            }
        } else {
            console.error("congrats, you broke it again");
            this.pressedKeys["ArrowUp"] = false;
            this.pressedKeys["ArrowDown"] = false;
        }
    }
    this.resize = (e) => {
        this.width = this.fieldElem.offsetWidth;
        this.height = this.fieldElem.offsetHeight;
        if (this.height > this.width) {
            p.pedalSpeed = 2;
        } else {
            p.pedalSpeed = 1;
        }
    }
    this.pauseGame = () => {
        cancelAnimationFrame(this.animationFrameId);
    }
    this.resumeGame = () => {
        console.log("resume");
        this.animationFrameId = requestAnimationFrame(this.update);
    }
    this.resetGame = () => {
        this.pauseGame();
        b.initBall();
        p.initPedals();
        this.animationFrameId = requestAnimationFrame(this.update);
    }
    this.update = () => {
        b.ballX += b.velocityX;
        b.ballY += b.velocityY;

        // Collisions
        //bounce
        if (b.ballY >= this.height - (b.width / 2) || b.ballY <= (b.width / 2)) {
            b.velocityY = b.velocityY * (-1);
        }
        //pedals
        //left
        if (b.ballY >= p.leftY - (p.height / 2) && b.ballY <= p.leftY + (p.height / 2)
            && b.ballX <= 25) {
            b.velocityX = b.velocityX * (-1);
        }
        //right
        if (b.ballY >= p.rightY - (p.height / 2) && b.ballY <= p.rightY + (p.height / 2)
            && b.ballX >= this.width - 25) {
            b.velocityX = b.velocityX * (-1);
        }

        // left pedal position update
        if (this.pressedKeys["ArrowUp"] && p.leftY - p.height / 2 > 0) {
            p.leftY -= p.pedalSpeed;
        }

        if (this.pressedKeys["ArrowDown"] && p.leftY + p.height / 2 < f.height) {
            p.leftY += p.pedalSpeed;
        }

        // right pedal AI
        if (!this.opAI) {
            if (b.ballY < p.rightY && p.rightY - p.height / 2 > 0 && !this.opAI) {
                p.rightY -= p.pedalSpeed;
            }

            if (b.ballY > p.rightY && p.rightY + p.height / 2 < f.height && !this.opAI) {
                p.rightY += p.pedalSpeed;
            }
        } else {
            p.rightY = Math.max(Math.min(b.ballY, f.height - p.height / 2), p.height / 2);

        }

        //lose
        if (b.ballX <= (b.width / 2) || b.ballX >= this.width - (b.width / 2)) {
            if (b.ballX <= (b.width / 2)) {
                p.scoreRight += 1;
            }
            if (b.ballX >= this.width - (b.width / 2)) {
                p.scoreLeft += 1;
            }
            this.scoreElem.textContent = `${p.scoreLeft}|${p.scoreRight}`;
            return this.resetGame();
        }

        b.updatePositions();
        p.updatePositions();

        this.animationFrameId = requestAnimationFrame(this.update);
    }
}

window.onload = () => {
    f = new Field();
    f.initGame();
}
