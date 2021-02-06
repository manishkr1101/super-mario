
const render = {
    init(gameObj) {
        // drawSky
        gameObj.tool.fillStyle = "#845ec2"
        gameObj.tool.fillRect(0,0,window.innerWidth, window.innerHeight);
        gameObj.tool.drawImage(castleImage, 100,100)
    }
}

class Game {
    init() {
        const canvas = document.querySelector('.board')
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        const tool = canvas.getContext("2d")

        const gameObj = {tool, canvas}

        render.init(gameObj)
    }

    run() {

    }

    reset() {
        location.reload()
    }
}

preload().then(function(obj) {
    const game = new Game()
    game.init()
    console.log(obj)
})

