import {mat4} from 'gl-matrix';
import {ProgramInfo} from '../../types/ProgramInfo';
import {Buffers} from '../../types/Buffers';

function setVertexAttribute(gl: WebGLRenderingContext, buffers: Buffers, programInfo: ProgramInfo): void {
    const numComponents: number = 2;
    const type: number = gl.FLOAT;
    const normalize: boolean = false;
    const stride: number = 0;
    const offset: number = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers): void {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const projectionMatrix: mat4 = mat4.create();
    const fieldOfView: number = (45 * Math.PI) / 180;
    const aspect: number = gl.canvas.width / gl.canvas.height;
    const zNear: number = 0.1;
    const zFar: number = 100.0;

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix: mat4 = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

    setVertexAttribute(gl, buffers, programInfo);
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    const offset: number = 0;
    const vertexCount: number = 4;

    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

export {drawScene};
