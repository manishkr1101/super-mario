const animation = {
    update(gameObj) {
        const mario = gameObj.entities.mario
        mario.currentState(gameObj);
    }
}