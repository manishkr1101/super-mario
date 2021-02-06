class Sprite{
    constructor(img, srcX, srcY, srcW, srcH) {
        this.img = img
        this.srcX = srcX
        this.srcY = srcY
        this.srcW = srcW
        this.srcH = srcH
    }
}

class Entity{
    constructor(sprite, type, posX, posY, width, height) {
        this.sprite = sprite
        this.type = type
        // coordinates
        this.posX = posX
        this.posY = posY
        this.height = height
        this.width = width 
    }
}

class Mario extends Entity {
    constructor(spriteImg, posX, posY, width, height) {
        const sprite = new Sprite(spriteImg, 651, 3, 16, 19);
        super(sprite, 'mario',  posX, posY, width, height)
        this.velX = 4
    }
}
