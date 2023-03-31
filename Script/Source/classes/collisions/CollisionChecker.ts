namespace Script {
    export class CollisionChecker {
        public checkCollision(object1: CharacterSprite, object2: CharacterSprite | Tile) {
            const rect2 = this.getRectangle(
                object2.translation.toVector2(),
                new FudgeCore.Vector2(object2.definition.width, object2.definition.height),
                object2.definition.origin
            );
            const _t = rect2.isInside(object1.translation.toVector2());
            if (_t) {
                const intersection = rect2.getIntersection(
                    new BoundingBox(
                        object1.translation.toVector2(),
                        new FudgeCore.Vector2(object1.definition.width, object1.definition.height),
                        object1.definition.origin
                    )
                );
                if (!intersection) return null;
                let _returnHeight = intersection.height;
                if (this.objectIsTile(object2)) {
                    _returnHeight = this.mapXToAbsoluteYUsingSlope(object1.translation.x, object2);
                }
                if (object1.translation.y > rect2.bottom + _returnHeight) {
                    return null;
                }
                return this.getRectangle(
                    new FudgeCore.Vector2(object1.translation.x, rect2.bottom),
                    new FudgeCore.Vector2(intersection.width, _returnHeight),
                    FudgeCore.ORIGIN2D.BOTTOMCENTER
                );
            }
            return null;
        }

        private getRectangle(
            _translation: FudgeCore.Vector2,
            _scale: FudgeCore.Vector2,
            _origin: FudgeCore.ORIGIN2D
        ): BoundingBox {
            return new BoundingBox(_translation, _scale, _origin);
        }

        private mapXToAbsoluteYUsingSlope(_absoluteX: number, _tile: Tile): number {
            const tileRect = this.getRectangle(
                _tile.translation.toVector2(),
                new FudgeCore.Vector2(_tile.definition.width, _tile.definition.height),
                _tile.definition.origin
            );
            const y = _tile.definition.slopeMapping(this.getRelativeX(_absoluteX, tileRect));
            return y * _tile.definition.height;
        }

        private getRelativeX(_absoluteX: number, _tileRect: BoundingBox): number {
            return (_absoluteX - _tileRect.left) / _tileRect.width;
        }

        private objectIsTile(object: Tile | CharacterSprite): object is Tile {
            return (object as Tile).definition.slopeMapping !== undefined;
        }
    }
}