const input = {
    down: {},
    init(){
        window.addEventListener('keydown', e => {
            // console.log(e.code)
            this.down[e.code] = true
        })

        window.addEventListener('keyup', e => {
            delete this.down[e.code]
        })
    },

    update(gameObj) {
        let mario = gameObj.entities.mario
        if(this.isDown('ArrowLeft') || this.isDown('KeyA')) {
            mario.posX -= mario.velX
        }
        else if(this.isDown('ArrowRight') || this.isDown('KeyD')) {
            mario.posX += mario.velX
        }
    },

    isDown(key) {
        return this.down[key]
    }
}