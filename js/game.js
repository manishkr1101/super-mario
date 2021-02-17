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

        gameObj.entities.particles.forEach(particle => {
            this.drawEntity(camera, particle, gameObj)
        })

        gameObj.entities.coins.forEach(coin => {
            this.drawEntity(camera, coin, gameObj)
        })

        this.drawEntities(gameObj.entities.mushrooms, camera, gameObj)

        if(gameObj.userControl == false) {
            gameObj.tool.fillStyle = "black"
            gameObj.tool.font = "bold 35pt Tahoma";
            gameObj.tool.fillText("GAME OVER", 250, 100)
        }
        

    },
    drawEntities(entities, camera, gameObj) {
        entities.forEach(ent => {
            this.drawEntity(camera, ent, gameObj)
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
        const entities = { scenery: [], bricks: [], particles: [], blocks: [], coins: [], mushrooms: [] }
        const camera = {
            start: 0,
            width: window.innerWidth/2
        }
        const gameObj = {
            tool,
            canvas,
            entities,
            animFrame: 0,
            levelBuilder: new LevelBuilder(levelOne),
            camera,
            reset: this.reset,
            nextLevel: this.nextLevel,
            userControl : true
        }

        entities.goombas = []
        entities.koopas = []
        preload().then(() => {
            entities.mario = new Mario(spriteSheetImage, 175, -20, 15, 17)
            // entities.mario.posX = 3000
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
            tool.scale(2.5, 2.5)
            render.init(gameObj)

            input.init();
            audio.init();
            this.update(gameObj)

        })


    }

    update(gameObj) {
        function gameloop() {
            input.update(gameObj)
            animation.update(gameObj)
            physics.update(gameObj)
            movement.update(gameObj)
            render.update(gameObj)
            gameObj.animFrame++
            requestAnimationFrame(gameloop)
        }
        gameloop()
    }

    reset() {
        setTimeout(() => {
            location.reload()
            
        }, 2000);
    }

    nextLevel() {
        this.reset()
    }
}
const game = new Game()
game.init()


document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'visible') {
        audio.sounds.bgTheme.play()
    } else {
        audio.sounds.bgTheme.pause()
        debugger
    }
});
