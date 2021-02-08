const groundOffset = 193

const render = {
    init(gameObj) {
        // drawSky
        gameObj.tool.fillStyle = "#3498db"
        gameObj.tool.fillRect(0, 0, window.innerWidth, window.innerHeight);
        gameObj.tool.fillStyle = "#eb5e0b"
        gameObj.tool.fillRect(0, groundOffset, window.innerWidth, window.innerHeight - groundOffset);
        const mario = gameObj.entities.mario
        gameObj.levelBuilder.stock(gameObj)
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
        this.updateFrame(gameObj)
        gameObj.tool.clearRect(0, 0, window.innerWidth, window.innerHeight);
        gameObj.tool.fillStyle = "#63adff"
        gameObj.tool.fillRect(0, 0, window.innerWidth, window.innerHeight);

        gameObj.levelBuilder.render(gameObj)
        const camera = gameObj.camera
        const mario = gameObj.entities.mario
        this.drawEntity(camera, mario, gameObj)

        gameObj.entities.goombas.forEach(goomba => {
            this.drawEntity(camera, goomba, gameObj)
        })

        gameObj.entities.koopas.forEach(koopa => {
            this.drawEntity(camera, koopa, gameObj)
        })

    },
    drawEntity(camera, entity, gameObj) {
        const entityEnd = entity.posX + entity.width
        const frameEnd = camera.start + camera.width
        if (entityEnd >= camera.start && entity.posX <= frameEnd) {
            gameObj.tool.drawImage(
                entity.sprite.img,
                entity.sprite.srcX,
                entity.sprite.srcY,
                entity.sprite.srcW,
                entity.sprite.srcH,
                entity.posX - camera.start,
                entity.posY,
                entity.width,
                entity.height
            )
        }

    },
    updateFrame(gameObj) {
        const center = gameObj.entities.mario.posX + gameObj.entities.mario.width / 2;
        const dist = window.innerWidth / 9;
        gameObj.camera.start = Math.max(center - dist, 0);
    }
}

class Game {
    init() {
        const canvas = document.querySelector('.board')
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        const tool = canvas.getContext("2d")
        const entities = { scenery: [] }
        const camera = {
            start: 0,
            width: window.innerWidth
        }
        const gameObj = {
            tool,
            canvas,
            entities,
            animFrame: 0,
            levelBuilder: new LevelBuilder(levelOne),
            camera,
            reset: this.reset
        }

        entities.goombas = []
        entities.koopas = []
        preload().then(() => {
            entities.mario = new Mario(spriteSheetImage, 175, 0, 16, 19)
            entities.mario.posX = 800
            levelOne.goombas.forEach(coord => {
                entities.goombas.push(
                    new Goomba(spriteSheetImage, ...coord)
                )
            });
            levelOne.koopas.forEach(coord => {
                entities.koopas.push(
                    new Koopa(spriteSheetImage, ...coord)
                )
            });
            console.log(entities)
            tool.scale(3, 3)
            render.init(gameObj)

            input.init();

            this.update(gameObj)
        })


    }

    update(gameObj) {
        function gameloop() {
            input.update(gameObj)
            animation.update(gameObj)
            movement.update(gameObj)
            physics.update(gameObj)
            render.update(gameObj)
            gameObj.animFrame++
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

// const audio = new Audio('assets/audio/music/mario_theme.mp3')

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'visible') {

    } else {
        debugger
    }
});
