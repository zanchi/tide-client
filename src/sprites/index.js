import { createSprites, flipRow } from './utils'

import crosshairimg from '../assets/img/crosshair.png'
import bulletimg from '../assets/img/bullet.png'
import goblinimgs from '../assets/img/goblin.png'
import golemimgs from '../assets/img/golem.png'
import itemimgs from '../assets/img/items.png'
import playerimgs from '../assets/img/player.png'
import wallimgs from '../assets/img/walls.png'

class SpriteManager {
  sprites = {}

  /**
   * Add a set of sprites at key `name`
   * @param {String} name
   * @param {Object.<string, ImageBitmap[]} spritemap
   */
  addSet(name, spritemap) {
    if (process.env.NODE_ENV === 'development') {
      if (this.sprites[name] != undefined) {
        console.warn(`Key ${name} is alread set, overriding`)
      }
    }

    this.sprites[name] = spritemap
    return this
  }

  /**
   * Returns the set of sprites at key `name`
   * @param {String} name
   * @returns {Object}
   */
  getSet(name) {
    return this.sprites[name]
  }
}

export const sprites = new SpriteManager()

const loadBullet = () => createSprites(bulletimg, 8, 8)
const loadCrosshair = () => createSprites(crosshairimg, 15, 15)
const loadGoblin = () => createSprites(goblinimgs, 64, 64)
const loadGolem = () => createSprites(golemimgs, 64, 64)
const loadItems = () => createSprites(itemimgs, 14, 18)
const loadWall = () => createSprites(wallimgs, 16, 16)

const loadPlayer = () =>
  createSprites(playerimgs, 16, 32).then(rows => {
    const flipped = flipRow(rows[2])
    return flipped.then(f => {
      rows.push(f)
      return rows
    })
  })

export const loadSprites = () =>
  Promise.all([
    loadBullet(),
    loadCrosshair(),
    loadGoblin(),
    loadGolem(),
    loadItems(),
    loadPlayer(),
    loadWall()
  ]).then(([bs, cs, gs, gos, is, ps, ws]) => {
    const bullet = {
      DEFAULT: bs[0][0],
      BLUE: cs[0][1],
      RED: cs[0][2],
    }

    const crosshair = {
      DEFAULT: cs[0][0]
    }

    const goblin = {
      STANDING: gs[0][0],
      WALK_DOWN: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gs[0]
      },
      WALK_RIGHT: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gs[1]
      },
      WALK_UP: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gs[2]
      },
      WALK_LEFT: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gs[3]
      }
    }

    const golem = {
      STANDING: gos[2][0],
      WALK_UP: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gos[0]
      },
      WALK_LEFT: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gos[1]
      },
      WALK_DOWN: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gos[2]
      },
      WALK_RIGHT: {
        frameIndices: [0, 1, 2, 3, 4, 5, 6],
        sprites: gos[3]
      }
    }

    const items = {
      SWORD: is[0][0]
    }

    const player = {
      STANDING: ps[0][0],
      WALK_DOWN: {
        frameIndices: [1, 1, 2, 2],
        sprites: ps[0]
      },
      WALK_RIGHT: {
        frameIndices: [0, 1, 0, 2],
        sprites: ps[2]
      },
      WALK_UP: {
        frameIndices: [1, 1, 2, 2],
        sprites: ps[1]
      },
      WALK_LEFT: {
        frameIndices: [0, 1, 0, 2],
        sprites: ps[3]
      }
    }

    const walls = {
      TOP1: ws[0][0],
      TOP2: ws[0][1],
      TOP3: ws[1][0],
      DOORWAY: ws[1][1],
      DOOR: ws[2][0],
      TOP_LEFT: ws[2][1],
      TOP_RIGHT: ws[3][0],
      LEFT: ws[3][1],
      RIGHT: ws[4][0],
      BOTTOM: ws[4][1],
    }

    sprites.addSet('bullet', bullet)
    sprites.addSet('crosshair', crosshair)
    sprites.addSet('goblin', goblin)
    sprites.addSet('golem', golem)
    sprites.addSet('items', items)
    sprites.addSet('player', player)
    sprites.addSet('walls', walls)
  })
