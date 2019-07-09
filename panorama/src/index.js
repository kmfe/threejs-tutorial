import Panorama from './panorama'
import banner from './assets/banner.png'
import doorCover from './assets/door.png'
import bg from './assets/bg.jpg'
import cloud from './assets/cloud.png'
import { boutique } from './config'

new Panorama({
  el: 'boutique',
  data: boutique,
  cover: bg,
  clickables: [
    {
      cover: banner,
      width: 1,
      height: 0.5,
      pos: {x: -30, y: 14.6, z: 0},
      rotation: {y: Math.PI / 2}
    },
    {
      cover: doorCover,
      width: 0.5,
      height: 0.5,
      pos: {x: 0, y: 6, z: -23.1},
      rotation: {}
    },
    {
      cover: cloud,
      width: 1,
      height: 1,
      pos: {x: 5.3, y: 16.6, z: 15.6},
      rotation: {y: 0.3}
    }
  ]
})
