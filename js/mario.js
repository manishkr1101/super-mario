class Sprite {
    constructor(img, srcX, srcY, srcW, srcH) {
        this.img = img
        this.srcX = srcX
        this.srcY = srcY
        this.srcW = srcW
        this.srcH = srcH
    }
}

class Entity {
    constructor(sprite, type, posX, posY, width, height) {
        this.sprite = sprite
        this.type = type
        // coordinates
        this.posX = posX
        this.posY = posY
        this.height = height
        this.width = width
    }

    draw(tool) {
        tool.drawImage(
            this.sprite.img,
            this.sprite.srcX,
            this.sprite.srcY,
            this.sprite.srcW,
            this.sprite.srcH,
            this.posX,
            this.posY,
            this.width,
            this.height
        )
    }
}

class Mario extends Entity {
    constructor(spriteImg, posX, posY, width, height) {
        const sprite = new Sprite(spriteImg, 651, 3, 16, 19);
        super(sprite, 'mario', posX, posY, width, height)
        this.velX = 2
        this.velY = 0
        this.won = false
        this.big = false
        this.invincible = false

        this.animFrame = {
            walkRight: {
                frames: [
                    new Sprite(spriteImg, 667, 5, 16, 16),
                    new Sprite(spriteImg, 683, 5, 16, 16),
                    new Sprite(spriteImg, 699, 5, 16, 16),
                ],
                counter: 0

            },
            walkLeft: {
                frames: [
                    new Sprite(spriteImg, 844, 21, 16, 16),
                    new Sprite(spriteImg, 828, 21, 16, 16),
                    new Sprite(spriteImg, 812, 21, 16, 16),
                ],
                counter: 0
            },
            standRight: new Sprite(spriteImg, 651, 5, 16, 16),
            standLeft: new Sprite(spriteImg, 860, 21, 16, 16),
            jumpRight: new Sprite(spriteImg, 731, 5, 16, 16),
            jumpLeft: new Sprite(spriteImg, 778, 22, 16, 16),
            dead: new Sprite(spriteImg, 748, 5, 16, 16)
        };

        this.states = {
            walkingAnim: gameObj => {
                if (gameObj.animFrame % 6 == 0) {
                    if (this.currentDirection == 'left') {
                        this.sprite = this.animFrame.walkLeft.frames[this.animFrame.walkLeft.counter]
                        this.animFrame.walkLeft.counter = (this.animFrame.walkLeft.counter + 1) % 3
                    }
                    else {
                        this.sprite = this.animFrame.walkRight.frames[this.animFrame.walkRight.counter]
                        this.animFrame.walkRight.counter = (this.animFrame.walkRight.counter + 1) % 3
                    }
                }

            },
            standingAnim: () => {
                if (this.currentDirection == 'left') {
                    this.sprite = this.animFrame.standLeft;
                }
                else {
                    this.sprite = this.animFrame.standRight;
                }
            },
            jumpingAnim: () => {
                if (this.currentDirection == 'left') {
                    this.sprite = this.animFrame.jumpLeft;
                }
                else {
                    this.sprite = this.animFrame.jumpRight;
                }
            },
            deadAnim: () => {
                this.sprite = this.animFrame.dead
            }
        }

        this.currentDirection = "right"
        this.currentState = this.states.standingAnim;
    }

    automove() {
        if(this.won) {
            this.currentState = this.states.walkingAnim
            this.currentDirection = "right"
            this.posX += this.velX/2
        }
        
    }

    promote() {
        if(this.big) return;
        this.height *= 1.3
        this.width *= 1.3
        this.big = true
    }

    demote() {
        if(!this.big) return;
        this.height /= 1.3
        this.width /= 1.3
        this.big = false
        this.invincible = true
        setTimeout(() => {
            this.invincible = false
        }, 2000)
    }
}
