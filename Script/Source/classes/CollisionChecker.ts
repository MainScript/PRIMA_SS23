namespace Script {

  export class CollisionChecker {

    public checkCollision(a: Tile | CharacterSprite, b: Tile | CharacterSprite): BoundingBox {
      let rectA: BoundingBox = this.getRectFromObject(a);
      let rectB: BoundingBox = this.getRectFromObject(b);
      let intersection: BoundingBox = this.getIntersection(rectA, rectB);
      if (this.objectIsTile(a) && intersection) {
        if (intersection.y < a.definition.XYMapping(intersection.x)) {
          intersection = null;
        }
      } else if (this.objectIsTile(b) && intersection) {
        if (intersection.y < b.definition.XYMapping(intersection.x)) {
          intersection = null;
        }
      }
      return intersection;
    }
    
    private getRectFromObject(object: Tile | CharacterSprite): BoundingBox {
      return new BoundingBox(object.cmp.cmpTransform.mtxLocal.translation.x, object.cmp.cmpTransform.mtxLocal.translation.y, object.definition.width, object.definition.height, object.definition.origin);
    }

    private objectIsTile(object: Tile | CharacterSprite): object is Tile {
      return (object as Tile).definition.XYMapping !== undefined;
    }

    private getIntersection(a: BoundingBox, b: BoundingBox): BoundingBox {
      let x: number = Math.max(a.left, b.left);
      let right = Math.min(a.right, b.right);
      let width: number = Math.abs(right - x);
      let y: number = Math.max(a.bottom, b.bottom);
      let top = Math.min(a.top, b.top);
      let height: number = Math.abs(top - y);
      if (width > 0 && height > 0) {
        return new BoundingBox(x, y, width, height, FudgeCore.ORIGIN2D.BOTTOMLEFT);
      }
      return null;
    }
  }

}