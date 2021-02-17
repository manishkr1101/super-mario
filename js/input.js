

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
        if(gameObj.userControl==false) return;
        let mario = gameObj.entities.mario
        if (this.isDown('ArrowLeft') || this.isDown('KeyA')) {
            mario.posX -= mario.velX
            mario.posX = Math.max(mario.posX, 0)
            mario.currentDirection = "left"
            if(mario.velY == 1.1) {
                mario.currentState = mario.states.walkingAnim
            }
        }
        else if (this.isDown('ArrowRight') || this.isDown('KeyD')) {
            mario.posX += mario.velX
            mario.currentDirection = "right"
            if(mario.velY == 1.1) {
                mario.currentState = mario.states.walkingAnim
            }
        }

        if(this.isDown('KeyX')) {
            mario.velX += 1 // hack
        }
        
        if (this.isDown("Space") || this.isDown("KeyW")) {
            if (mario.velY == 1.1) {
                mario.velY -= 9;
                mario.currentState = mario.states.jumpingAnim
                audio.sounds.jump.play()
            }
        }

        if(this.isPressed('KeyM')) {
            audio.toggleMute()
        }

        if(this.isPressed('Equal')) {
            audio.volumeUp()
        }
        else if(this.isPressed('Minus')) {
            audio.volumeDown()
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