const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
class Player {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.b = 50
    }

    draw() {
        c.beginPath()
        c.drawImage(playerImage, this.x, this.y, canvas.width / 10, canvas.height / 5)
    }

    update() {
        this.draw()
        if (this.y <= canvas.height / 8)
            this.b = 50
        if (this.y >= canvas.height / 8 * 6)
            this.b = -50
        this.y = this.y + this.b
    }

}

class Bullet {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.drawImage(bulletImage, this.x, this.y, canvas.width / 50, canvas.height / 20)
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.drawImage(enemyImage, this.x, this.y, canvas.width / 10, canvas.height / 5)
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Boss {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.drawImage(bossImage, this.x, this.y, canvas.width / 2, canvas.height / 1)
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

function loadImages() {
    bossImage = new Image()
    enemyImage = new Image()
    playerImage = new Image()
    bulletImage = new Image()
    homeImage = new Image()

    bossImage.src = "img/boss.png"
    enemyImage.src = "img/enemy.png"
    playerImage.src = "img/player.png"
    bulletImage.src = "img/bullet.png"
    homeImage.src = "img/home.png"
}

const x = canvas.width / 5
const y = canvas.height / 2
loadImages()

function init() {
    player = new Player(x, y, 10, canvas.height / 5 * 4, 'red')
    bullets = []
    enemies = []
    bosses = []
    score = 10
    scoreEl.innerHTML = score
    if (score > bigScoreEl.innerHTML) {
        bigScoreEl.innerHTML = score
    }
}

function spawnEnemies() {
    setInterval(() => {
        const x = Math.random() * canvas.width / 5 + canvas.width
        const y = Math.random() * canvas.height
        const radius = 20
        const color = 'green'
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 5 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

function spawnBoss() {
    const x = Math.random() * canvas.width / 5 + canvas.width
    const y = Math.random() * canvas.height / 2
    const radius = 1
    const color = 'green'
    const angle = Math.atan2(
        canvas.height / 2 - y,
        canvas.width / 5 - x)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    bosses.push(new Boss(x, y, radius, color, velocity))
}

let animationId
let score = 10

function animate() {
    animationId = requestAnimationFrame(animate)
    c.drawImage(homeImage, 0, 0, canvas.width, canvas.height)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    bullets.forEach((bullet, index) => {
        bullet.update()

        if (bullet.x + bullet.radius < 0 ||
            bullet.x - bullet.radius > canvas.width ||
            bullet.y + bullet.radius < 0 ||
            bullet.y - bullet.radius > canvas.height) {
            setTimeout(() => {
                bullets.splice(index, 1)
            }, 0)
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x,
            player.y - enemy.y)
        if (dist - enemy.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            if (score > bigScoreEl.innerHTML) {
                bigScoreEl.innerHTML = score
            }
        }
        bullets.forEach((bullet, bulletIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x,
                bullet.y - enemy.y)
            if (dist - enemy.radius - bullet.radius < 1) {
                setTimeout(() => {
                    score += 100
                    scoreEl.innerHTML = score
                    enemies.splice(index, 1)
                    bullets.splice(bulletIndex, 1)
                    if (score > 1000)
                        spawnBoss()
                }, 0)
            }
        })
    })
    bosses.forEach((boss, index) => {
        boss.update()

        const dist = Math.hypot(player.x - boss.x,
            player.y - boss.y)
        if (dist - boss.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            if (score > bigScoreEl.innerHTML) {
                bigScoreEl.innerHTML = score
            }
        }
        bullets.forEach((bullet, bulletIndex) => {
            const dist = Math.hypot(bullet.x - boss.x,
                bullet.y - boss.y)
            if (dist - boss.radius - bullet.radius < 1) {
                setTimeout(() => {
                    score += 10000
                    scoreEl.innerHTML = score
                    bosses.splice(index, 1)
                    bullets.splice(bulletIndex, 1)
                }, 0)
            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 5)
    const velocity = {
        x: Math.abs(Math.cos(angle)),
        y: (Math.sin(angle))
    }
    bullets.push(new Bullet(player.x, player.y,
        5, 'black', velocity))
    score -= 45
    scoreEl.innerHTML = score
    player.update()

})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
})