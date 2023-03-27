namespace Script {
    import fudge = FudgeCore;

    export class Camera {
        cmp: fudge.ComponentCamera;
        constructor(x: number, y: number, z: number, viewport: fudge.Viewport) {
            this.cmp = viewport.getBranch().getComponent(fudge.ComponentCamera) satisfies fudge.ComponentCamera;
            this.cmp.mtxPivot.translate(new fudge.Vector3(x, y, z));
            this.cmp.mtxPivot.rotateY(180);
        }
    }
}