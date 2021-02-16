const sounds = {
    jump: new Audio("assets/audio/sounds/jump.wav"),
    marioDead: new Audio("assets/audio/sounds/mario_death.wav"),
    bgTheme: new Audio("assets/audio/music/mario_theme.mp3"),
    levelComplete: new Audio("assets/audio/music/level_complete.mp3"),
    breakBrick: new Audio("assets/audio/sounds/break_block.wav"),
    stomp : new Audio("assets/audio/sounds/stomp.wav"),
    bump : new Audio("assets/audio/sounds/bump.wav"),
    coin : new Audio("assets/audio/sounds/coin.wav"),
    setVolume(vol) {
        for(let key in sounds) {
            sounds[key].volume = vol
        }
    }
}

// sounds.stomp.play()
for(let key in sounds) {
    sounds[key].volume = 0.01
}
sounds.bgTheme.volume = 0

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
                sounds.jump.play()
            }
        }

        if(this.isPressed('KeyM')) {
            if(gameObj.sounds) {
                gameObj.sounds = false;
                sounds.setVolume(0)
            }
            else {
                gameObj.sounds = true;
                sounds.setVolume(0.8)
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