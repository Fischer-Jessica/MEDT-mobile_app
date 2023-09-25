import {initBuffers} from './init-buffers';
import {drawScene} from './draw-scene';
import {ProgramInfo} from '../../types/ProgramInfo';
import {Buffers} from '../../types/Buffers';

function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader: WebGLShader | null = gl.createShader(type);

    if (shader === null) {
        alert("An error occurred creating the shader");
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    const shaderProgram: WebGLProgram | null = gl.createProgram();
    const vertexShader: WebGLProgram | null = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader: WebGLProgram | null = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (shaderProgram === null || vertexShader === null || fragmentShader === null) {
        alert("An error occurred creating the shader program");
        return null;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }

    return shaderProgram;
}

function main(): void {
    const canvas: HTMLCanvasElement | null = document.querySelector("#glcanvas")!;
    const gl: WebGLRenderingContext | null = canvas.getContext("webgl");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const vsSource: string = `
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    const fsSource: string = `
        void main() {
          gl_FragColor = vec4(0.0, 0.75, 0.75, 1.0);
        }
    `;

    const shaderProgram: WebGLProgram | null = initShaderProgram(gl, vsSource, fsSource);

    if (shaderProgram === null) {
        alert("Unable to initialize the shader program");
        return;
    }

    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        }
    };

    const buffers: Buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);
}

export {main};
