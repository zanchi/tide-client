import { World } from 'ecsy'

import * as Systems from './Systems'
import * as Components from './Components'

import { loadSprites, sprites } from './sprites'

const world = new World()

world
  .registerSystem(Systems.Controls)
  .registerSystem(Systems.Network)
  .registerSystem(Systems.Renderer)

loadSprites().then(() => {
    world
      .createEntity('player')
      .addComponent(Components.Controllable)
      .addComponent(Components.Networked)
      .addComponent(Components.Position)
      .addComponent(Components.Static, { sprite: sprites.getSet('player').STANDING })

    world
      .createEntity('enemy-1')
      .addComponent(Components.Position, { x: 100, y: 100 })
      .addComponent(Components.Static, { sprite: sprites.getSet('golem').STANDING })
  })

let lastTime = performance.now()

const run = () => {
  // Compute delta and elapsed times
  const time = performance.now()
  const delta = time - lastTime

  // Run all the systems
  world.execute(delta, time)

  lastTime = time
  requestAnimationFrame(run)
}

run()
