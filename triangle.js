var vertexShaderText = 
`precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;
varying vec3 fragColor;

void main()
{
   fragColor = vertColor;
   gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
}`

// mWorld will help us to rotate the cube in 3d space 
// mView is the camera position 

var fragmentShaderText = 
`precision mediump float;

varying vec3 fragColor;
void main()
{
   gl_FragColor = vec4(fragColor, 1.0);
}`



let countColor = [0, 0, 0]
let timeLeft = 0;
let chosenColor = []
let animate
let colors = ["green", "green", "red", "red", "yellow", "yellow"]
let prevId = -1
let correctCount = 0
let correctCanvas = []
let correctColor = [0.6, 0.9, 0.4]
let wrongColor = [0.6, 0.9, 0.4]
let elem = document.getElementById('timer');
let timerId
function countdown() {
    elem.innerHTML = timeLeft + ' s';
    timeLeft++;
}
let firstClick = 0
// let wrongColor = [1.0, 0.5, 0.5]
// function loop(gl, worldMatrix, identityMatrix, angle, triangleIndices, matWorldUniformLocation) {
//     angle = performance.now() / 500 / 6 * 2 * Math.PI
//     glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
//     // glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
//     // glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
//     // glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
//     gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
    
//     gl.clearColor(0.75, 0.85, 0.8, 1.0)
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
//     gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_SHORT, 0)
    
    
//     animate = requestAnimationFrame(loop(gl, worldMatrix, identityMatrix, angle, triangleIndices))

// }


var initDemo = function(id, click, rotate, bgC) {
    if(firstClick == 0){
        timerId = setInterval(countdown, 1000);
        firstClick++
    }
    var canvas = document.getElementById(id)
    var gl = canvas.getContext('webgl')

    if(!gl){
        console.log('WebGL not supported')
        gl = canvas.getContext('experimental-webgl')
        alert('Your browser does not support WebGL')
    }
    
    gl.clearColor(bgC[0], bgC[1], bgC[2], 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)


    // 
    // Create Shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader)
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR Compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
        return;
    }
    gl.compileShader(fragmentShader)
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR Compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
        return;
    }

    var program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('ERROR linking program!', gl.getProgramInfoLog(program))
        return;
    }
    gl.validateProgram(program)

    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.log('ERROR validating program!', gl.getProgramInfoLog(program))
        return;
    }

    //
    // Create buffer
    //
    function generateColor() {
        if(chosenColor[id]){
            return
        }

        let x = Math.floor(Math.random() * colors.length)
        chosenColor[id] = colors[x]
        colors.splice(x, 1)
    }
    generateColor()
    function generateColorCode(color, i){
        let code = []
        if(color == "green"){
            code = [0.5, 1.0, 0.0]
        }else if(color == "red"){
            code = [1.0, 0.0, 0.15]
        }else if(color == "yellow"){
            code = [0.9, 1.0, 0.1]
        }
        return code[i]
    }
    var triangleVertices = 
    [
        // Top (red)
        -1.0, 1.0, -1.0,   0.5, 0.0, 0.15,
        -1.0, 1.0, 1.0,    0.5, 0.0, 0.15,
        1.0, 1.0, 1.0,     0.5, 0.0, 0.15,
        1.0, 1.0, -1.0,    0.5, 0.0, 0.15,

        // Right (green)
        -1.0, 1.0, 1.0,    0.5, 0.0, 0.15,
        -1.0, -1.0, 1.0,   0.5, 0.0, 0.15,
        -1.0, -1.0, -1.0,  0.5, 0.0, 0.15,
        -1.0, 1.0, -1.0,   0.5, 0.0, 0.15,

        // Left (blue)
        1.0, 1.0, 1.0,    0.5, 0.0, 0.15,
        1.0, -1.0, 1.0,   0.5, 0.0, 0.15,
        1.0, -1.0, -1.0,  0.5, 0.0, 0.15,
        1.0, 1.0, -1.0,   0.5, 0.0, 0.15,

        // Back (black)
        1.0, 1.0, 1.0,    generateColorCode(chosenColor[id], 0), generateColorCode(chosenColor[id], 1), generateColorCode(chosenColor[id], 2),
        1.0, -1.0, 1.0,    generateColorCode(chosenColor[id], 0), generateColorCode(chosenColor[id], 1), generateColorCode(chosenColor[id], 2),
        -1.0, -1.0, 1.0,    generateColorCode(chosenColor[id], 0), generateColorCode(chosenColor[id], 1), generateColorCode(chosenColor[id], 2),
        -1.0, 1.0, 1.0,    generateColorCode(chosenColor[id], 0), generateColorCode(chosenColor[id], 1), generateColorCode(chosenColor[id], 2),

        // Front (gray)
        1.0, 1.0, -1.0,    0.5, 0.0, 0.15,
        1.0, -1.0, -1.0,    0.5, 0.0, 0.15,
        -1.0, -1.0, -1.0,    0.5, 0.0, 0.15,
        -1.0, 1.0, -1.0,    0.5, 0.0, 0.15,

        // Bottom (lightblue)
        -1.0, -1.0, -1.0,   0.5, 0.0, 0.15,
        -1.0, -1.0, 1.0,    0.5, 0.0, 0.15,
        1.0, -1.0, 1.0,     0.5, 0.0, 0.15,
        1.0, -1.0, -1.0,    0.5, 0.0, 0.15,
    ]
    

    var triangleIndices =
    [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Right
        5, 4, 6,
        6, 4, 7,

        // Left
        8, 9, 10,
        8, 10, 11,

        // Back
        13, 12, 14,
        15, 14, 12,

        // Front
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];

    // we are creating the buffer
    // var triangleVertex1BufferObject = gl.createBuffer()
    // we are binding the buffer with the graphics card after creating it
    //array_buffer contains some variables
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertex1BufferObject)

    // javascript stores the vertices in 64 bit type, so we pass the 32 bit type by using float32array
    //we are sending information from CPU memory to GPU memory once and we are not going to change, thus static_draw
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)


    var triangleVertex1BufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertex1BufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)


    var triangleIndexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBufferObject)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), gl.STATIC_DRAW)

    var positionAttriLocation = gl.getAttribLocation(program, 'vertPosition')
    var colorAttriLocation = gl.getAttribLocation(program, 'vertColor')
    gl.vertexAttribPointer(
        positionAttriLocation,
        3, //no. of elements per attribute
        gl.FLOAT, 
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, //size of an individual
        0 //offset from the beginning of a single vertic to this attribute
    )

    gl.vertexAttribPointer(
        colorAttriLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(positionAttriLocation)
    gl.enableVertexAttribArray(colorAttriLocation)

    gl.useProgram(program)

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView')
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProjection')


    var worldMatrix = new Float32Array(16)
    var viewMatrix = new Float32Array(16)
    var projMatrix = new Float32Array(16)
    glMatrix.mat4.identity(worldMatrix)
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0,], [0, 1, 0])
    var toRadian = function (angle) {
        return angle * Math.PI/180;
    }
    glMatrix.mat4.perspective(projMatrix, toRadian(45), canvas.width/canvas.height, 0.1, 1000.0)

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix)
    

    
    // var xRotationMatrix = new Float32Array(16);
	// var yRotationMatrix = new Float32Array(16);
    var identityMatrix = new Float32Array(16)
    glMatrix.mat4.identity(identityMatrix)
    var angle = 0

    function loop() {
        // angle = performance.now() / 500 / 6 * 2 * Math.PI
        angle = performance.now() / 500
        // glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        // glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        // glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, rotate, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
        gl.clearColor(bgC[0], bgC[1], bgC[2], 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_SHORT, 0)
        
        animate = requestAnimationFrame(loop)
    }
    
    gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_SHORT, 0)
    
    // animate = requestAnimationFrame(loop)
    if(click){
        animate = requestAnimationFrame(loop)
    
        setTimeout(() => {
            cancelAnimationFrame(animate)
        }, 2650)
    }


}


function lol(id){
    if(prevId == -1){
        prevId = id
        initDemo(id, true, 1, wrongColor)
        console.log(id, chosenColor[id])
    }
    else if(prevId != -1){
        initDemo(id, true, 1, wrongColor)
        console.log(id, prevId, chosenColor[prevId], chosenColor[id])
        setTimeout(() => {
            if(chosenColor[prevId] != chosenColor[id]){
                initDemo(id, true, -1, wrongColor)
                initDemo(prevId, true, -1, wrongColor)
            }
            if(chosenColor[prevId] == chosenColor[id]){
                correctCount++

                let canvas1 = document.getElementById(id)
                let canvas2 = document.getElementById(prevId)
                canvas1.style.opacity = 0
                canvas2.style.opacity = 0
    
                if(correctCount == 3){
                    clearInterval(timerId)
                    alert("You've won the game! You took " + timeLeft + " seconds to complete the game.")
                    window.location.reload()
                }
            }
            console.log(id, prevId)
            prevId = -1
        }, 2000)
    }
}







initDemo('glCanvas1', false, 1, wrongColor)
initDemo('glCanvas2', false, 1, wrongColor)
initDemo('glCanvas3', false, 1, wrongColor)
initDemo('glCanvas4', false, 1, wrongColor)
initDemo('glCanvas5', false, 1, wrongColor)
initDemo('glCanvas6', false, 1, wrongColor)