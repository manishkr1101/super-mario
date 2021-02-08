const physics = {
    update(gameObj) {
        // this.checkCollision(gameObj.entities.mario)
        this.gravity(gameObj.entities.mario)
        this.bgCollision(gameObj)
        this.checkFallign(gameObj.entities.mario)
    },
    gravity(entity) {
        entity.velY += 1.1
        entity.posY += entity.velY
    },
    checkCollision(entity) {
        if (entity.posY + entity.height >= groundOffset && entity.velY > 0) {
            entity.posY = groundOffset - entity.height - 1
            entity.velY = 0
            entity.currentState = entity.states.standingAnim
        }
    },
    checkFallign(entity) {
        if(entity.posY > 250) {
            entity.posY = 250
            if(entity.type == 'mario') {
                alert("Game Over")
            }
            
        }

    },
    bgCollision(gameObj) {
        const mario = gameObj.entities.mario
        gameObj.entities.scenery.forEach(scene => {
            if (scene.type == 'pipe' || scene.type == 'stair') {
                if (this.checkRectCollision(scene, mario)) {
                    this.handleDirec(scene, mario)
                }
                
            }
            else if(scene.type == 'ground' && this.checkRectCollision(scene, mario)) {
                if(mario.posY < scene.posY && mario.posX + mario.width > scene.posX && scene.posX + scene.posY > mario.posX && mario.velY >= 0) {
                    mario.posY = scene.posY - mario.height 
                    mario.currentState = mario.states.standingAnim
                    mario.velY = 1.1
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
    handleDirec(scene, mario) {
        // left
        if(mario.posX <= scene.posX && mario.posY >= scene.posY) {
            mario.posX = scene.posX - mario.width
        }
        // right 
        if(mario.posX >= scene.posX && mario.posY >= scene.posY) {
            mario.posX = scene.posX + scene.width
        }

        //top
        if(mario.posY < scene.posY && mario.posX + mario.width > scene.posX && scene.posX + scene.posY > mario.posX && mario.velY >= 0) {
            mario.posY = scene.posY - mario.height 
            mario.currentState = mario.states.standingAnim
            mario.velY = 1.1
        }
        
    }
}