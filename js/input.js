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
        }
        else if (this.isDown('ArrowRight') || this.isDown('KeyD')) {
            mario.posX += mario.velX
        }
        
        if (this.isDown("Space")) {
            if (mario.velY == 1.1) {
                mario.velY -= 10;
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