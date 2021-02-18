const audio = {
    isMute: false,
    volume: 0.5,
    sounds: {
        jump: new Audio("assets/audio/sounds/jump.wav"),
        marioDead: new Audio("assets/audio/sounds/mario_death.wav"),
        bgTheme: new Audio("assets/audio/music/mario_theme.mp3"),
        levelComplete: new Audio("assets/audio/music/level_complete.mp3"),
        breakBrick: new Audio("assets/audio/sounds/break_block.wav"),
        stomp : new Audio("assets/audio/sounds/stomp.wav"),
        bump : new Audio("assets/audio/sounds/bump.wav"),
        coin : new Audio("assets/audio/sounds/coin.wav")
    },
    setVolume(vol) {
        for(let key in this.sounds) {
            this.sounds[key].volume = vol
        }
    },
    init() {
        this.setVolume(this.volume)
        setTimeout(() => {
            this.sounds.bgTheme.play()
        }, 1000)
    },
    toggleMute() {
        this.isMute = !this.isMute
        if(this.isMute) {
            this.setVolume(0)
        }
        else {
            this.setVolume(this.volume)
        }
    },
    volumeUp() {
        this.volume = Math.min(1, this.volume + 0.1)
        this.setVolume(this.volume)
    },
    volumeDown() {
        this.volume = Math.max(0, this.volume - 0.1)
        this.setVolume(this.volume)
    }
}

