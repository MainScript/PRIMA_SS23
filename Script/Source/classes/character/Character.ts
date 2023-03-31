namespace Script {
    export class Character {
        private _acceleration: FudgeCore.Vector2 = FudgeCore.Vector2.ZERO();
        private _cmp: FudgeCore.Node;
        private _definition: CharacterDefinition;
        private _position: FudgeCore.Vector3;
        private _velocity: FudgeCore.Vector2 = FudgeCore.Vector2.ZERO();
        private _viewport: FudgeCore.Viewport;
        constructor(_definition: CharacterDefinition, viewport: FudgeCore.Viewport) {
            this._definition = _definition;
            this._cmp = viewport.getBranch().getChildrenByName(_definition.name)[0];
            this._position = this._cmp.cmpTransform.mtxLocal.translation;
            this._viewport = viewport;
        }

        public get position(): FudgeCore.Vector3 {
            return this._position;
        }

        public set acceleration(_acceleration: FudgeCore.Vector2) {
            this._acceleration = _acceleration;
        }

        public get acceleration(): FudgeCore.Vector2 {
            return this._acceleration;
        }

        public applyGravity(_intersection?: BoundingBox): void {
            if (!_intersection) {
                this._acceleration.y = GRAVITY;
            }
        }

        public get velocity(): FudgeCore.Vector2 {
            return this._velocity;
        }

        public updateVelocity(_intersection?: BoundingBox): void {
            this._velocity.add(this._acceleration);
            if (_intersection && this._position.y + this.velocity.y < _intersection.top) {
                this._velocity.y = 0;
            }
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

        public updatePosition(_intersection?: BoundingBox): void {
            this._position.add(this._velocity.toVector3());
            if (_intersection && this._position.y < _intersection.top) {
                this._position.y = _intersection.top;
            }
            this._cmp.mtxLocal.translation = this._position;
        }

        public applyForce(_force: FudgeCore.Vector2): void {
            this._acceleration.add(_force);
        }

        public applyImpulse(_impulse: FudgeCore.Vector2): void {
            this._velocity.add(_impulse);
        }

        public checkCollision(_char: Character): BoundingBox {
            _char.applyGravity();
            _char.updateVelocity();
            _char.updatePosition();
            const collisionChecker = new CollisionChecker();
            const tilesToCollideWith: Tile[] = getAllMeshesInNode(
                this._viewport.getBranch().getChildrenByName('Terrain')[0]
            )
                .filter((component) => collidables.map((def) => def.name).includes(component.mesh.name))
                .map((component) => {
                    return {
                        translation: component.mtxWorld.translation,
                        definition: collidables.find((def) => def.name === component.mesh.name),
                    };
                });

            return tilesToCollideWith
                .map((tile) => {
                    return collisionChecker.checkCollision(
                        {
                            translation: _char.position,
                            definition: _char._definition,
                        },
                        tile
                    );
                })
                .filter((intersection) => intersection !== null)
                .sort((a, b) => {
                    return this.compareDistances(a.position, b.position);
                })[0];
        }

        private compareDistances(a: FudgeCore.Vector2, b: FudgeCore.Vector2): 1 | -1 {
            const distanceA = (this._position.x - a.x) ** 2 + (this._position.y - a.y) ** 2;
            const distanceB = (this._position.x - b.x) ** 2 + (this._position.y - b.y) ** 2;
            return distanceA > distanceB ? 1 : -1;
        }
    }
}
