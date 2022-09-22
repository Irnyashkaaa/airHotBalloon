import * as THREE from './node_modules/three/build/three.module.js'
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'

const canvas = document.getElementById('canvas')

const width = window.innerWidth
const height = window.innerHeight

canvas.setAttribute('width', width)
canvas.setAttribute('height', height)

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setClearColor(0xD9D2E9)

const scene = new THREE.Scene()



const light = new THREE.DirectionalLight()
light.position.set(0, 0, 100000)
scene.add(light)
const camera = new THREE.PerspectiveCamera(1, width / height, 1, 500000)
camera.position.z = 1000

const loader = new OBJLoader()

let airHotBallon = new THREE.Object3D()
loader.load('./obj/hot_air_balloon.obj',
    function (object) {
        object.children[0].material = new THREE.MeshNormalMaterial()
        object.scale.set(0.005, 0.005, 0.005)
        object.position.z = 5
        scene.add(object)
        airHotBallon = object
    }
)

const controls = new OrbitControls(camera, renderer.domElement)

let clouds_1 = new THREE.Group()
let clouds_2 = new THREE.Group()
let clouds_3 = new THREE.Group()
let clouds_4 = new THREE.Group()


let cloud_colors = [0xB4A7D6, 0xCFE2F3, 0xD5A6BD, 0xD9EAD3, 0xffffff]
const addCloudsPosition  = (object, cloudsGroupNumber) => {
    for (let i = 0; i <= 10; i += 2) {
        let currentCloud = object.clone()
        let scale = Math.random() * 0.016
        currentCloud.scale.set(scale, scale, scale)
        const color = Math.ceil(Math.random() * 4)
        currentCloud.children[0].material.color.setHex(cloud_colors[color])



        currentCloud.position.set(i * 10 - 90, Math.random() * i * 2 - 10, Math.random() * 10 - 30)
        cloudsGroupNumber.add(currentCloud)
    }
}
loader.load('./obj/cloud_1.obj',
    function (object) {
       addCloudsPosition(object, clouds_1)
    }
)

loader.load('./obj/cloud_2.obj',
    function(object) {
       addCloudsPosition(object, clouds_2)
    }
)

loader.load('./obj/cloud_3.obj', 
    function(object) {
        addCloudsPosition(object, clouds_3)
    }
)

loader.load('./obj/cloud_4.obj', 
    function(object) {
        addCloudsPosition(object, clouds_4)
    }
)


let clouds = new THREE.Group()
clouds.add(clouds_1, clouds_2, clouds_3, clouds_4)
scene.add(clouds)
let moveBalloon = 'up'

const animate = () => {

    clouds_1.position.x += 0.03
    clouds_2.position.x += 0.01
    clouds_3.position.x += 0.04
    clouds_4.position.x += 0.032

    controls.update()
    if (moveBalloon === 'up') {
        airHotBallon.position.y += 0.01
        airHotBallon.position.y > -3 ? moveBalloon = 'down' : ''
    } else {
        airHotBallon.position.y -= 0.01
        airHotBallon.position.y < -6 ? moveBalloon = 'up' : ''
    }

    clouds.children.map(cloudArray => {
        cloudArray.children.map(cloud => {
            if (cloud.position.x <= -90) {
                cloud.position.x = 0 
            }
        })
    })

    clouds_4.position.x > 90? clouds_4.position.x = -40: ''
    clouds_3.position.x > 90? clouds_3.position.x = -40: ''
    clouds_2.position.x > 90? clouds_2.position.x = -40: ''
    clouds_1.position.x > 90? clouds_1.position.x = -40: '' 
    airHotBallon.rotation.x = 0.3
    airHotBallon.rotation.y = 0.3
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()



