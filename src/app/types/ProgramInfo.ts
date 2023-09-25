export type ProgramInfo = {
    program: WebGLProgram | null,
    attribLocations: { vertexPosition: number },
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null,
        modelViewMatrix: WebGLUniformLocation | null
    }
};
