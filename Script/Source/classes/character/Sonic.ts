namespace Script {
    export class Sonic {
        private _character: Character;
        private _collision: BoundingBox;
        constructor(viewport: FudgeCore.Viewport) {
            this._character = new Character(defSonic, viewport);
        }

        public get character(): Character {
            return this._character;
        }

        public update(_timeDeltaSeconds: number): void {
            const _clone = Object.assign(Object.create(Object.getPrototypeOf(this.character)), this.character);
            _clone.reset();
            this._collision = _clone.checkCollision(_clone, _timeDeltaSeconds);
            this._character.applyGravity(_timeDeltaSeconds, this._collision);
            this._character.updateVelocity(_timeDeltaSeconds, this._collision);
            this._character.updatePosition(this._collision);
        }

        public jump(_timeDeltaSeconds: number): void {
            if (this._collision) {
                this._character.applyImpulse(new FudgeCore.Vector2(0, defSonic.jumpImpulse * _timeDeltaSeconds));
            }
        }

        public move(_direction: Direction, _timeDeltaSeconds: number): void {
            this._character.applyForce(
                new FudgeCore.Vector2(_direction * defSonic.moveAcceleration * _timeDeltaSeconds, 0)
            );
        }

        public stop(): void {
            this._character.applyForce(new FudgeCore.Vector2(-this._character.velocity.x / defSonic.framesToStop, 0));
        }
    }
}
