namespace Script {
    export class Character {
        private _acceleration: FudgeCore.Vector2 = FudgeCore.Vector2.ZERO();
        private _cmp: FudgeCore.Node;
        private _definition: CharacterDefinition;
        private _position: FudgeCore.Vector3;
        private _velocity: FudgeCore.Vector2 = FudgeCore.Vector2.ZERO();
        private _viewport: FudgeCore.Viewport;
        private _intersection: BoundingBox = null;
        constructor(_definition: CharacterDefinition, viewport: FudgeCore.Viewport) {
            this._definition = _definition;
            this._cmp = viewport.getBranch().getChildrenByName(_definition.name)[0];
            this._position = this._cmp.cmpTransform.mtxLocal.translation;
            this._viewport = viewport;
        }

        public set acceleration(_acceleration: FudgeCore.Vector2) {
            this._acceleration = _acceleration;
        }

        public get acceleration(): FudgeCore.Vector2 {
            return this._acceleration;
        }

        public get collision(): boolean {
            return this._intersection !== null;
        }

        public applyGravity(): void {
            if (this._intersection) {
                this._acceleration.y = 0;
                return;
            }
            this._acceleration.y = GRAVITY;
        }

        public get velocity(): FudgeCore.Vector2 {
            return this._velocity;
        }

        public updateVelocity(): void {
            if (this._intersection) {
                this._velocity.y = Math.max(this._velocity.y, 0);
            }
            this._velocity.add(this._acceleration);
            this._acceleration = FudgeCore.Vector2.ZERO();

            if (this._velocity.x > this._definition.terminalVelocity.x) {
                this._velocity.x = this._definition.terminalVelocity.x;
            } else if (this._velocity.x < -this._definition.terminalVelocity.x) {
                this._velocity.x = -this._definition.terminalVelocity.x;
            }

            if (this._velocity.y > this._definition.terminalVelocity.y) {
                this._velocity.y = this._definition.terminalVelocity.y;
            } else if (this._velocity.y < -this._definition.terminalVelocity.y) {
                this._velocity.y = -this._definition.terminalVelocity.y;
            }
        }

        public updatePosition(): void {
            this._position.add(this._velocity.toVector3());
            if (this._intersection) {
                this._position.y += this._intersection.height;
            }
            this._cmp.mtxLocal.translation = this._position;
        }

        public applyForce(_force: FudgeCore.Vector2): void {
            this._acceleration.add(_force);
        }

        public applyImpulse(_impulse: FudgeCore.Vector2): void {
            this._velocity.add(_impulse);
        }

        public checkCollision(): void {
            const collisionChecker = new CollisionChecker();
            collidables.map((def): Tile[] => {
                return this._viewport.getBranch().getChildrenByName("Terrain")[0].getChildrenByName(def.name).map((node) => ({cmp: node, definition: def}));
            }).reduce((a, b) => a.concat(b), []).map((floor) => {
                return collisionChecker.checkCollision({cmp: this._cmp, definition: this._definition}, floor);
            }).filter((intersection) => {
                return intersection !== null;
            }).some((intersection) => {
                this._intersection = intersection;
                return true;
                });
        }
    }
}