const physics = {
    update(gameObj) {
        // this.checkCollision(gameObj.entities.mario)
        
        this.gravity(gameObj.entities.mario)
        gameObj.entities.goombas.forEach(g => this.gravity(g))
        gameObj.entities.koopas.forEach(k => this.gravity(k))
        this.bgEntityCollision(gameObj)

        this.entityMarioCol(gameObj)

        this.checkFallign(gameObj.entities.mario, gameObj)
        gameObj.entities.goombas.forEach(g => this.checkFallign(g))
        gameObj.entities.koopas.forEach(k => this.checkFallign(k))
    },
    entityMarioCol(gameObj) {
        const { mario, goombas } = gameObj.entities;
        if(mario.currentState == mario.states.deadAnim) {
            return;
        }
        goombas.forEach(goomba => {
            if (this.checkRectCollision(mario, goomba)) {
                this.handleCol(mario, goomba, gameObj)
            }
        })
    },
    handleCol(mario, entity, gameObj) {
        if (entity.type == "goomba") {
            // top 
            if (mario.posY + mario.height > entity.posY && mario.posY < entity.posY && mario.posY + mario.height < entity.posY + entity.height && mario.velY > 0) {
                this.enemyDeath(entity, gameObj);
            } else {
                // left or right
                if (entity.currentState != entity.states.squashed) {
                    this.marioDeath(mario, gameObj)
                }
            }
        }

    },
    marioDeath(mario, gameObj) {
        mario.velX = 0
        mario.velY = -14
        gameObj.userControl = false;
        mario.currentState = mario.states.deadAnim
        sounds.marioDead.play()
    },
    enemyDeath(entity, gameObj) {
        if(entity.type == "goomba") {
            entity.currentState = entity.states.squashed
            setTimeout(() => {
                const idx = gameObj.entities.goombas.indexOf(entity)
                delete gameObj.entities.goombas[idx]
            }, 200)
        }
    },
    gravity(entity) {
        entity.velY += 1.1
        entity.posY += entity.velY
    },
    bgEntityCollision(gameObj) {
        const mario = gameObj.entities.mario
        const goombas = gameObj.entities.goombas
        if(mario.currentState != mario.states.deadAnim) {
            this.bgCollision(mario, gameObj)
        }
        goombas.forEach(g => {
            this.bgCollision(g, gameObj)
        })
        gameObj.entities.koopas.forEach(k => this.bgCollision(k, gameObj))
    },
    checkCollision(entity) {
        if (entity.posY + entity.height >= groundOffset && entity.velY > 0) {
            entity.posY = groundOffset - entity.height - 1
            entity.velY = 0
            entity.currentState = entity.states.standingAnim
        }
    },
    checkFallign(entity, gameObj) {
        if (entity.posY > 250) {
            // entity.posY = 250
            if (entity.type == 'mario' && !entity.fallen) {
                entity.fallen = true;
                this.marioDeath(entity, gameObj)
                gameObj.reset()
            }

        }

    },
    bgCollision(entity, gameObj) {
        gameObj.entities.scenery.forEach(scene => {
            if (scene.type == 'pipe' || scene.type == 'stair') {
                if (this.checkRectCollision(scene, entity)) {
                    this.handleDirec(scene, entity)

                }

            }
            if (scene.type == 'ground' && this.checkRectCollision(scene, entity)) {
                if (entity.posY < scene.posY && entity.posX + entity.width > scene.posX && scene.posX + scene.posY > entity.posX && entity.velY >= 0) {
                    entity.posY = scene.posY - entity.height
                    entity.velY = 1.1
                    if (entity.type == "mario") {
                        entity.currentState = entity.states.standingAnim
                    }
                }
            }


        })
    },
    checkRectCollision(scene, entity) {
        //x->r2>l1&&l2<r1
        let l1 = scene.posX;
        let l2 = entity.posX;
        let r1 = scene.posX + scene.width;
        let r2 = entity.posX + entity.width;
        let t1 = scene.posY + scene.height;
        let t2 = entity.posY + entity.height;
        let b1 = scene.posY;
        let b2 = entity.posY;
        // y-> t2>b1&&t1>b2
        if (r2 > l1 && l2 < r1 && t2 > b1 && t1 > b2) {
            return true;
        }
        return false;
    },
    handleDirec(scene, entity) {
        // left
        if (entity.posX <= scene.posX && entity.posY >= scene.posY) {
            entity.posX = scene.posX - entity.width
            if (entity.type == 'goomba' || entity.type == "koopa") {
                entity.currentDirection = entity.currentDirection == "right" ? "left" : "right";
            }
        }
        // right 
        if (entity.posX >= scene.posX && entity.posY >= scene.posY) {
            entity.posX = scene.posX + scene.width
            if (entity.type == 'goomba' || entity.type == "koopa") {
                entity.currentDirection = entity.currentDirection == "right" ? "left" : "right";
            }
        }

        //top
        if (entity.posY < scene.posY && entity.posX + entity.width > scene.posX && scene.posX + scene.posY > entity.posX && entity.velY >= 0) {
            entity.posY = scene.posY - entity.height
            entity.currentState = entity.states.standingAnim
            entity.velY = 1.1
        }

    }
}