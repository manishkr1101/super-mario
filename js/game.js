const groundOffset = 200

const render = {
    init(gameObj) {
        // drawSky
        gameObj.tool.fillStyle = "#845ec2"
        gameObj.tool.fillRect(0, 0, window.innerWidth, window.innerHeight);
        gameObj.tool.fillStyle = "#eb5e0b"
        gameObj.tool.fillRect(0, 200, window.innerWidth, window.innerHeight - 200);
        const mario = gameObj.entities.mario
        gameObj.tool.drawImage(
            mario.sprite.img,
            mario.sprite.srcX,
            mario.sprite.srcY,
            mario.sprite.srcW,
            mario.sprite.srcH,
            mario.posX,
            mario.posY,
            mario.width,
            mario.height
        )
    },
    update(gameObj) {
        gameObj.tool.clearRect(0, 0, window.innerWidth, window.innerHeight);
        gameObj.tool.fillStyle = "#845ec2"
        gameObj.tool.fillRect(0, 0, window.innerWidth, window.innerHeight);
        gameObj.tool.fillStyle = "#eb5e0b"
        gameObj.tool.fillRect(0, 200, window.innerWidth, window.innerHeight - 200);
        const mario = gameObj.entities.mario
        gameObj.tool.drawImage(
            mario.sprite.img,
            mario.sprite.srcX,
            mario.sprite.srcY,
            mario.sprite.srcW,
            mario.sprite.srcH,
            mario.posX,
            mario.posY,
            mario.width,
            mario.height
        )
    }
}

class Game {
    init() {
        const canvas = document.querySelector('.board')
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        const tool = canvas.getContext("2d")
        const entities = {}
        const gameObj = { tool, canvas, entities }

        preload().then(() => {
            entities.mario = new Mario(spriteSheetImage, 175, 0, 16, 19)
            tool.scale(3,3)
            render.init(gameObj)

            input.init();

            this.update(gameObj)
        })


    }

    update(gameObj) {
        function gameloop() {
            input.update(gameObj)
            physics.update(gameObj)
            render.update(gameObj)
            requestAnimationFrame(gameloop)
        }
        gameloop()
    }

    reset() {
        location.reload()
    }
}
const game = new Game()
game.init()


