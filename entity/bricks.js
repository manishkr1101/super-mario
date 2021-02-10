class Brick extends Entity {
    constructor(tileset, posX, posY, width, height) {
        const sprite = new Sprite(tileset, 18, 0, 18, 18);
        super(sprite, 'brick', posX, posY, width, height);
    }

    createParticles(gameObj) {
        const l1 = new Particle(tilesetImage, this.posX, this.posY, this.width/2, this.height/2, 10, -3)
        let r1 = new Particle(tilesetImage, this.posX, this.posY, this.width / 2, this.height / 2, -20, -3);
        gameObj.entities.particles.push(l1,r1)

        setTimeout(() => {
            let idx = gameObj.entities.particles.indexOf(l1)
            delete gameObj.entities.particles[idx]
            idx = gameObj.entities.particles.indexOf(r1)
            delete gameObj.entities.particles[idx]
        }, 700)
    }
}