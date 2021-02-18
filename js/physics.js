const physics = {
    g: 0.4,
    update(gameObj) {
        // this.checkCollision(gameObj.entities.mario)

        this.gravity(gameObj.entities.mario)
        gameObj.entities.goombas.forEach(g => this.gravity(g))
        gameObj.entities.koopas.forEach(k => this.gravity(k))
        gameObj.entities.particles.forEach(k => this.gravity(k))
        gameObj.entities.mushrooms.forEach(k => this.gravity(k))

        this.bgEntityCollision(gameObj)

        this.entityMarioCol(gameObj)
        this.staticEntityCol(gameObj)

        this.checkFallign(gameObj.entities.mario, gameObj)
        gameObj.entities.goombas.forEach(g => this.checkFallign(g))
        gameObj.entities.koopas.forEach(k => this.checkFallign(k))
    },
    staticEntityCol(gameObj) {
        let { mushrooms, blocks, bricks } = gameObj.entities;
        mushrooms.forEach((mushroom) => {
            blocks.forEach((block) => {
                if (this.checkRectCollision(block, mushroom)) {
                    this.handleDirec(block, mushroom);
                }
            })
        })
        mushrooms.forEach((mushroom) => {
            bricks.forEach((brick) => {
                if (this.checkRectCollision(brick, mushroom)) {
                    this.handleDirec(brick, mushroom);
                }
            })
        })
    },
    entityMarioCol(gameObj) {
        const { mario, goombas, koopas, bricks, blocks, mushrooms } = gameObj.entities;
        if (mario.currentState == mario.states.deadAnim) {
            return;
        }
        goombas.forEach(goomba => {
            if (this.checkRectCollision(mario, goomba)) {
                this.handleCol(mario, goomba, gameObj)
            }
        })
        koopas.forEach(koopa => {
            if (this.checkRectCollision(mario, koopa)) {
                this.handleCol(mario, koopa, gameObj)
            }
        })

        
        
        blocks.forEach(block => {
            if (this.checkRectCollision(mario, block)) {
                const wantToReveal = this.handleDirec(block, mario)
                if (wantToReveal) {
                    if (block.currentState == block.states.fullAnim) {
                        if(block.content == "coin") {
                            block.createCoin(gameObj)
                        }
                        else if(block.content == "mushroom") {
                            block.createMushroom(gameObj)
                        }
                        audio.sounds.coin.pause()
                        audio.sounds.coin.play()
                        block.currentState = block.states.emptyAnim
                    }
                    else {
                        audio.sounds.bump.play()
                    }
                }
            }

        })

        bricks.forEach(brick => {
            if (this.checkRectCollision(mario, brick)) {
                const wantToBreak = this.handleDirec(brick, mario)
                if (wantToBreak) {
                    if(mario.big) {
                        let idx = gameObj.entities.bricks.indexOf(brick);
                        brick.createParticles(gameObj)
                        audio.sounds.breakBrick.play()
                        gameObj.entities.bricks.splice(idx, 1);
                    }
                    else {
                        audio.sounds.bump.play()
                    }
                    
                }
            }
            
        })

        mushrooms.forEach(mushroom => {
            if(this.checkRectCollision(mushroom, mario)) {
                let idx = mushrooms.indexOf(mushroom)
                mushrooms.splice(idx, 1);
                mario.promote()
            }
        })
    },
    handleCol(mario, entity, gameObj) {

        // top 
        if (mario.posY + mario.height > entity.posY && mario.posY < entity.posY && mario.posY + mario.height < entity.posY + entity.height && mario.velY > 0) {

            if (entity.type == "goomba") {
                this.enemyDeath(entity, gameObj);
            }
            else if (entity.type == "koopa") {
                if (entity.currentState == entity.states.walkingAnim) {
                    entity.currentState = entity.states.hiding
                    entity.posX = mario.posX + mario.width + 1
                }
                else if (entity.currentState == entity.states.hiding) {
                    entity.currentState = entity.states.sliding
                    entity.posX = mario.posX + mario.width + 1
                    entity.currentDirection = "right"
                    // this.enemyDeath(entity, gameObj)
                }
                else if (entity.currentState == entity.states.sliding) {
                    this.enemyDeath(entity, gameObj);
                }
            }

        } else {
            // left or right

            if (entity.type == "goomba") {
                if (entity.currentState != entity.states.squashed) {
                    if(mario.big) {
                        mario.demote()
                    } else{
                        this.marioDeath(mario, gameObj)
                    }
                }
            }
            else if (entity.type == "koopa") {
                if (entity.currentState == entity.states.walkingAnim) {
                    this.marioDeath(mario, gameObj)
                }
                else if (entity.currentState == entity.states.hiding) {
                    if (mario.currentDirection == "left") {
                        entity.posX = mario.posX - entity.width - 1
                        entity.currentDirection = "left"
                    }
                    else if (mario.currentDirection == "right") {
                        entity.posX = mario.posX + mario.width + 3
                        entity.currentDirection = "right"
                    }
                    entity.currentState = entity.states.sliding
                }
                else if (entity.currentState == entity.states.sliding) {
                    this.marioDeath(mario, gameObj)
                }
            }
        }


    },
    marioDeath(mario, gameObj) {
        if(mario.invincible) return;
        mario.velX = 0
        mario.velY = this.getVelocityForDist(100)
        gameObj.userControl = false;
        mario.currentState = mario.states.deadAnim
        audio.sounds.marioDead.play()
    },
    enemyDeath(entity, gameObj) {
        if (entity.type == "goomba") {
            entity.currentState = entity.states.squashed
            audio.sounds.stomp.play()
            setTimeout(() => {
                const idx = gameObj.entities.goombas.indexOf(entity)
                delete gameObj.entities.goombas[idx]
            }, 200)
        }
        else if (entity.type == "koopa") {
            entity.currentState = entity.states.dead
            entity.velX = 1
            // entity.posY -= 14
            entity.velY = -14
            setTimeout(() => {
                const idx = gameObj.entities.koopas.indexOf(entity)
                delete gameObj.entities.koopas[idx]
            }, 1000)
        }
    },
    gravity(entity) {
        entity.velY += this.g
        entity.posY += entity.velY
    },
    // checks collision of entities with scenery like pipe and ground
    bgEntityCollision(gameObj) {
        const mario = gameObj.entities.mario
        const goombas = gameObj.entities.goombas
        if (mario.currentState != mario.states.deadAnim) {
            this.bgCollision(mario, gameObj)
        }
        goombas.forEach(g => {
            this.bgCollision(g, gameObj)
        })
        gameObj.entities.koopas.forEach(k => {
            if (k.currentState != k.states.dead) {
                this.bgCollision(k, gameObj)
            }
        })
        gameObj.entities.mushrooms.forEach(m => {
            this.bgCollision(m, gameObj)
        })
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

            if (scene.type == "flag" && entity.type == "mario" && this.checkRectCollision(scene, entity)) {
                this.handleLevelUp(gameObj, entity)
            }
            if (scene.type == "castle" && entity.type == "mario" && entity.posX >= scene.posX + scene.width / 2) {
                if (entity.won) {
                    entity.won = false
                    gameObj.nextLevel()
                }

            }
        })
    },

    handleLevelUp(gameObj, mario) {
        audio.sounds.bgTheme.pause()
        audio.sounds.levelComplete.play()
        gameObj.userControl = false;
        // mario.posX += mario.velX
        mario.won = true;
    },

    handleDirec(scene, entity) {
        // bottom 
        if (entity.posY > scene.posY && entity.posX + entity.width > scene.posX && scene.posX + scene.posY > entity.posX && entity.velY < 0) {
            if(scene.posX-entity.width/2 < entity.posX && entity.posX < scene.posX-entity.width/2+scene.width) {

                bottom = true;
                if (scene.type == "brick" || scene.type == "block") {
                    entity.posY = scene.posY + scene.height;
                    entity.velY = 0.1;
                    return true;
                }
                return false;
            }
        }

        // left
        if (entity.posX <= scene.posX && entity.posY >= scene.posY) {
            entity.posX = scene.posX - entity.width
            if (entity.type == 'goomba' || entity.type == "koopa" || entity.type == "mushroom") {
                entity.currentDirection = entity.currentDirection == "right" ? "left" : "right";
            }
        }
        // right 
        if (entity.posX >= scene.posX && entity.posY >= scene.posY) {
            entity.posX = scene.posX + scene.width
            if (entity.type == 'goomba' || entity.type == "koopa" || entity.type == "mushroom") {
                entity.currentDirection = entity.currentDirection == "right" ? "left" : "right";
            }
        }

        //top
        if (entity.posY < scene.posY && entity.posX + entity.width > scene.posX && scene.posX + scene.posY > entity.posX && entity.velY >= 0) {
            entity.posY = scene.posY - entity.height
            if(entity.type == "mushroom") {
                
            } else{
                entity.currentState = entity.states.standingAnim
            }
            entity.velY = 1.1
        }

    },
    checkFallign(entity, gameObj) {
        if (entity.posY > 250) {
            // entity.posY = 250
            if (entity.type == 'mario' && !entity.fallen) {
                entity.fallen = true;
                if (entity.currentState != entity.states.deadAnim) {
                    this.marioDeath(entity, gameObj)
                }
                gameObj.reset()
            }

        }

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
            if(scene.type == "mario" && entity.type == "brick") {
                console.log(scene.type)
            }
            return true;
        }
        return false;
    },
    checkCollision(entity) {
        if (entity.posY + entity.height >= groundOffset && entity.velY > 0) {
            entity.posY = groundOffset - entity.height - 1
            entity.velY = 0
            entity.currentState = entity.states.standingAnim
        }
    },
    getVelocityForDist(s) {
        return (- Math.sqrt(2 * this.g * s));
    }
}