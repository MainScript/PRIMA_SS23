namespace Script {
    export class CollisionChecker {
        public checkCollision(a: CharacterSprite, b: Tile | CharacterSprite): BoundingBox {
            const rectA: BoundingBox = this.getRectFromObject(a);
            const rectB: BoundingBox = this.getRectFromObject(b);
            let intersection: BoundingBox = this.getIntersection(rectA, rectB);
            if (this.objectIsTile(b) && intersection) {
                const relativePosition: FudgeCore.Vector2 = this.getRelativePosition(rectA, rectB);
                const mappedY = this.mapYToX(b, rectB, relativePosition.x);
                intersection.y = rectB.bottom;
                intersection.height = mappedY;
                if (relativePosition.x < 0 || relativePosition.x > 1) {
                    intersection = null;
                }
                if (rectA.y > this.mapYToX(b, rectB, relativePosition.x)) {
                    intersection = null;
                }
            }
            return intersection;
        }

        private getRectFromObject(object: Tile | CharacterSprite): BoundingBox {
            return new BoundingBox(
                object.cmp.cmpTransform.mtxLocal.translation.x,
                object.cmp.cmpTransform.mtxLocal.translation.y,
                object.definition.width,
                object.definition.height,
                object.definition.origin
            );
        }

        private objectIsTile(object: Tile | CharacterSprite): object is Tile {
            return (object as Tile).definition.slopeMapping !== undefined;
        }

        private getIntersection(a: BoundingBox, b: BoundingBox): BoundingBox {
            if (a.right < b.left || a.left > b.right || a.top < b.bottom || a.bottom > b.top) {
                return null;
            }
            const x: number = Math.max(a.left, b.left);
            const right = Math.min(a.right, b.right);
            const width: number = Math.abs(right - x);
            const y: number = Math.max(a.bottom, b.bottom);
            const top = Math.min(a.top, b.top);
            const height: number = Math.abs(top - y);
            if (width > 0 && height > 0) {
                return new BoundingBox(x, y, width, height, FudgeCore.ORIGIN2D.BOTTOMLEFT);
            }
            return null;
        }

        private getRelativePosition(a: BoundingBox, b: BoundingBox): FudgeCore.Vector2 {
            const relativePosition: FudgeCore.Vector2 = new FudgeCore.Vector2(
                (a.x - b.left) / b.width,
                (a.y - b.bottom) / b.height
            );
            return relativePosition;
        }

        private mapYToX(target: Tile, targetRect: BoundingBox, x: number): number {
            return (target.definition.slopeMapping(x) / targetRect.height) * targetRect.top;
        }
    }
}
