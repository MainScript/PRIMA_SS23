namespace Script {
    import fudge = FudgeCore;

    export class Camera {
        cmp: fudge.ComponentCamera;
        constructor(x: number, y: number, z: number, viewport: fudge.Viewport) {
            this.cmp = viewport.getBranch().getComponent(fudge.ComponentCamera) satisfies fudge.ComponentCamera;
            this.cmp.mtxPivot.translate(new fudge.Vector3(x, y, z));
            this.cmp.mtxPivot.rotateY(180);
        }

        public get position(): fudge.Vector3 {
            return this.cmp.mtxPivot.translation;
        }

        public set position(_position: fudge.Vector3) {
            this.cmp.mtxPivot.translation = _position;
        }

        public follow(target: Character): void {
            const vector: fudge.Vector3 = new fudge.Vector3(target.position.x, target.position.y + 1, this.position.z);
            this.position = vector;
        }
    }
}
