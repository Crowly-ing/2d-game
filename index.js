const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.drawImage(playerImage, this.x, this.y, canvas.width / 5, canvas.height / 2)
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
        c.drawImage(bulletImage, this.x, this.y, canvas.width / 5, canvas.height / 2)
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
        c.drawImage(enemyImage, this.x, this.y, canvas.width / 5, canvas.height / 2)
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

function loadImages() {
    enemyImage = new Image();
    playerImage = new Image();
    bulletImage = new Image();

    enemyImage.src = "img/enemy.png";
    playerImage.src = "img/player.png"
    bulletImage.src = "img/bullet.png"
}

const x = canvas.width / 5
const y = canvas.height / 2
loadImages()
const player = new Player(x, y, 40, 'red')

const bullets = []
const enemies = []

function spawnEnemies() {
    setInterval(() => {
        const x = Math.random() * canvas.width / 5 + canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 20 + 10
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

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    bullets.forEach((bullet) => {
        bullet.update()
    })
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x,
            player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
        }
        bullets.forEach((bullet, bulletIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x,
                bullet.y - enemy.y)
            if (dist - enemy.radius - bullet.radius < 1) {
                setTimeout(() => {}, 0)
                enemies.splice(index, 1)
                bullets.splice(bulletIndex, 1)
            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 5)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    bullets.push(new Bullet(canvas.width / 5, canvas.height / 2,
        5, 'black', velocity))
})

animate()
spawnEnemies()