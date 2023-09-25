function initPositionBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const positionBuffer: WebGLBuffer | null = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions: number[] = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initBuffers(gl: WebGLRenderingContext): { position: WebGLBuffer | null } {
    const positionBuffer: WebGLBuffer | null = initPositionBuffer(gl);

    return {
        position: positionBuffer,
    };
}

export {initBuffers};
