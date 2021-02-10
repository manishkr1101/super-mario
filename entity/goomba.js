class Goomba extends Entity {
    constructor(spritesheet, posX, posY, width, height) {
        const sprite = new Sprite(spritesheet, 115, 5, 16, 16);
        super(sprite, 'goomba', posX, posY, width, height)
        this.velX = 0.8
        this.velY = 0
        let self = this
        this.animFrame = {
            walking: {
                frames: [
                    new Sprite(spritesheet, 115, 5, 16, 16),
                    new Sprite(spritesheet, 131, 5, 16, 16),
                ],
                counter: 0,
            },
            squashed: new Sprite(spritesheet, 147.5, 5, 16, 16)
        };
        // animation
        this.states = {
            walkingAnim: {
                animation(gameObj) {
                    if (gameObj.animFrame % 6 == 0) {
                        self.sprite = self.animFrame.walking.frames[self.animFrame.walking.counter];
                        self.animFrame.walking.counter++;
                        if (self.animFrame.walking.counter > 1) {
                            self.animFrame.walking.counter = 0;
                        }
                    }
                },
                movement() {
                    if (self.currentDirection == "left") {
                        self.posX -= self.velX;
                    } else {
                        self.posX += self.velX;

                    }
                }
            },
            squashed: {
                movement() {
                    self.velX = 0
                },
                animation() {
                    self.sprite = self.animFrame.squashed
                }
            }

        }
        this.currentDirection = "left";
        this.currentState = this.states.walkingAnim;
    }
}
