class Coin extends Entity {
    constructor(tileset, posX, posY, width, height) {
        const sprite = new Sprite(tileset, 5, 5, 10, 14);
        super(sprite, 'coin', posX, posY, width, height);
        const self = this;
        this.velY = -0.7

        this.animFrame = {
            spin: {
                frames: [
                    new Sprite(spriteSheetImage, 5, 5, 10, 14),
                    new Sprite(spriteSheetImage, 21, 5, 10, 14),
                    new Sprite(spriteSheetImage, 37, 5, 10, 14),
                    new Sprite(spriteSheetImage, 53, 5, 10, 14),
                ],
                currentFrame: 0
            }
        }

        this.states = {
            spinning: {
                animation: (gameObj) => {
                    if(gameObj.animFrames % 3 == 0) {
                        this.sprite = this.animFrame.spin.frames[this.animFrame.spin.currentFrame]
                        this.animFrame.spin.currentFrame = (this.animFrame.spin.currentFrame + 1) % 4
                    }
                    
                },
                movement: () => {
                    this.posY += this.velY
                }
            }
        }

        this.currentState = this.states.spinning
    }
}