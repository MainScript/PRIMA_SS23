namespace Script {
    import fudge = FudgeCore;
    export class Character {
        cmp: fudge.Node;
        velocity: fudge.Vector3 = fudge.Vector3.ZERO();
        acceleration: fudge.Vector3 = fudge.Vector3.ZERO();
        terminalVelocity: fudge.Vector3;
        constructor(name: string, x: number, y: number, z: number, viewport: fudge.Viewport, terminalVelocity: fudge.Vector3) {
            this.cmp = viewport.getBranch().getChildrenByName(name)[0];
            this.cmp.cmpTransform.mtxLocal.translate(new fudge.Vector3(x, y, z));
            this.terminalVelocity = terminalVelocity;
        }

        public applyGravity(g: number): void {
            this.acceleration.y = g;
        }

        private updateVelocity(): void {
            this.velocity.add(this.acceleration);
            if (this.velocity.x > this.terminalVelocity.x) {
                this.velocity.x = this.terminalVelocity.x;
            }
            if (this.velocity.x < -this.terminalVelocity.x) {
                this.velocity.x = -this.terminalVelocity.x;
            }
            if (this.velocity.y > this.terminalVelocity.y) {
                this.velocity.y = this.terminalVelocity.y;
            }
            if (this.velocity.y < -this.terminalVelocity.y) {
                this.velocity.y = -this.terminalVelocity.y;
            }
        }

        // TODO: update position
    }
}