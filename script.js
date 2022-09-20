import * as THREE from './node_modules/three/build/three.module.js'
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js'

const canvas = document.getElementById('canvas')

const width = window.innerWidth
const height = window.innerHeight

canvas.setAttribute('width', width)
canvas.setAttribute('height', height)

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setClearColor(0xD9D2E9)

const scene = new THREE.Scene()



const light = new THREE.AmbientLight()
light.position.set(0, 0, 900)
scene.add(light)
const camera = new THREE.PerspectiveCamera(1, width / height, 1, 500000)
camera.position.z = 1000

const loader = new OBJLoader()

let airHotBallon = new THREE.Object3D()
loader.load('./obj/hot_air_balloon.obj',
    function (object) {
        object.children[0].material = new THREE.MeshNormalMaterial()
        object.scale.set(0.005, 0.005, 0.005)
        scene.add(object)
        airHotBallon = object
    }
)


// let clouds = new THREE.Object3D()
// loader.load('./obj/cloud.obj',
//     function(object) {
//         object.children[0].position.x = 0
//         object.children[0].position.y = 0
//         object.children[0].position.z = 0
//         scene.add(object.children[0])
//     }
// )


const createSphere = (x, y, z) => {
    const sphereGeometry = new THREE.SphereGeometry(1.3, 15, 10)
    const sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff} ) 
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphereMesh.position.set(x, y, z)
    return (sphereMesh)
}


const createCloud = () => {
    let cloudSize = Math.random() * 7
    let cloudGroup = new THREE.Group()

    for (let i = 0; i < Math.floor(cloudSize) + 2; i++) {
        cloudGroup.add(createSphere(Math.random()* 2, Math.random() * 2, Math.random() * 2))
    }
    return cloudGroup
}

const clouds = new THREE.Group()
for (let i = -60; i < 60; i+=3) {
    let cloud = createCloud()
    cloud.position.set(Math.random() * i , Math.random() * 30 - 10,Math.random() * -300)
    clouds.add(cloud)

}

scene.add(clouds)

let moveBalloon = 'up'

const animate = () => {

    if (moveBalloon === 'up') {
        airHotBallon.position.y += 0.01
        airHotBallon.position.y > -3? moveBalloon = 'down': ''
    } else {
        airHotBallon.position.y -= 0.01
        airHotBallon.position.y < -6? moveBalloon = 'up': ''
    }

    clouds.position.z += 1
    clouds.position.x += 0.001
    airHotBallon.rotation.x = 0.3
    airHotBallon.rotation.y = 0.3
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()



