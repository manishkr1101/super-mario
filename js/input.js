const sounds = {
    jump: new Audio("assets/audio/sounds/jump.wav")
}

for(let key in sounds) {
    sounds[key].volume = 0.1
}

const input = {
    down: {},
    pressed: {},
    init() {
        window.addEventListener('keydown', e => {
            // console.log(e.code)
            this.down[e.code] = true
            this.pressed[e.code] = true
        })

        window.addEventListener('keyup', e => {
            delete this.down[e.code]
            // delete this.pressed[e.code]
        })
    },

    update(gameObj) {
        let mario = gameObj.entities.mario
        if (this.isDown('ArrowLeft') || this.isDown('KeyA')) {
            mario.posX -= mario.velX
            mario.posX = Math.max(mario.posX, 0)
            mario.currentDirection = "left"
            mario.currentState = mario.states.walkingAnim
        }
        else if (this.isDown('ArrowRight') || this.isDown('KeyD')) {
            mario.posX += mario.velX
            mario.currentDirection = "right"
            mario.currentState = mario.states.walkingAnim
        }

        if(this.isDown('KeyX')) {
            mario.velX += 1 // hack
        }
        
        if (this.isDown("Space")) {
            if (mario.velY == 1.1) {
                mario.velY -= 14;
                mario.currentState = mario.states.jumpingAnim
                sounds.jump.play()
            }
        }
    },

    isDown(key) {
        return this.down[key]
    },
    isPressed(key) {
        if (this.pressed[key]) {
            delete this.pressed[key]
            return true;
        } 
    }
}