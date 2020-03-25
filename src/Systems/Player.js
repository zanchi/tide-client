import { System } from 'ecsy'
import Vector from 'victor'

import {
  Animated,
  KeyControlled,
  MouseControlled,
  Player as PlayerComponent,
  Position,
  Static,
  Velocity
} from '../Components'
import { sprites } from '../sprites'

class Player extends System {
  static queries = {
    player: {
      components: [PlayerComponent]
    }
  }

  // TODO: Make this data-driven so different attacks can have different limits etc
  bulletLimiter = 0

  getAnimation(keys) {
    const animation = {
      fps: 5
    }

    if (keys.has('a')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_LEFT
      }
    }

    if (keys.has('d')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_RIGHT
      }
    }

    if (keys.has('w')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_UP
      }
    }

    if (keys.has('s')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_DOWN
      }
    }
  }

  handleKeys = (keys, pos, vel, dt, player) => {
    if (keys.keys.size === 0) {
      this.stopMoving(player, vel)
      return
    }

    const left = keys.keys.has('a')
    const down = keys.keys.has('s')
    const up = keys.keys.has('w')
    const right = keys.keys.has('d')

    if (left) {
      vel.x = -10
    }

    if (down) {
      vel.y = 10
    }

    if (up) {
      vel.y = -10
    }

    if (right) {
      vel.x = 10
    }

    if (!left && !right) {
      vel.x = 0
    }

    if (!up && !down) {
      vel.y = 0
    }

    if (!left && !down && !up && !right) {
      this.stopMoving(player, vel)
      return
    }
    
    player.removeComponent(Static)

    const animation = this.getAnimation(keys.keys)

    if (player.hasComponent(Animated)) {
      const a = player.getMutableComponent(Animated)
      a.fps = animation.fps
      a.frameIndices = animation.frameIndices
      a.sprites = animation.sprites
    } else {
      player.addComponent(Animated, animation)
    }
  }

  handleMouse = (mouse, pos, vel, dt) => {
    if (mouse.LMB && this.bulletLimiter === 0) {
      const vel = new Vector(mouse.x - pos.x, mouse.y - pos.y)
        .normalize()
        .multiply(new Vector(64, 64))
        .toObject()

      // Create bullet
      this.world
        .createEntity()
        .addComponent(Position, pos)
        .addComponent(Velocity, vel)
        .addComponent(Static, { sprite: sprites.getSet('bullet').DEFAULT })
      this.bulletLimiter += dt

      return
    }

    if (this.bulletLimiter > 0 && this.bulletLimiter < 200) {
      this.bulletLimiter += dt
      return
    } else {
      this.bulletLimiter = 0
    }
  }

  stopMoving(player, vel) {
    player.removeComponent(Animated)
    player.addComponent(Static, { sprite: sprites.getSet('player').STANDING })

    vel.x = 0
    vel.y = 0
  }

  execute(dt) {
    const player = this.queries.player.results[0]

    // Not sure how big, if any, the performance gains are from doing this
    // Basically, we're calling all the getComponents here, so we only do them once
    // instead of multiple times inside each handle function
    const kc = player.getComponent(KeyControlled)
    const mc = player.getComponent(MouseControlled)
    const pos = player.getComponent(Position)
    const vel = player.getMutableComponent(Velocity)

    this.handleKeys(kc, pos, vel, dt, player)
    this.handleMouse(mc, pos, vel, dt, player)
  }
}

export default Player