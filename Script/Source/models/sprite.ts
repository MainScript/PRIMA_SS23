namespace Script {
    export interface SpriteDefinition {
        name: string;
        width: number;
        height: number;
        origin: FudgeCore.ORIGIN2D;
    }

    export interface TileDefinition extends SpriteDefinition {
        slopeMapping: (x: number) => number;
    }

    export interface Sprite {
        cmp: FudgeCore.Node;
        definition: SpriteDefinition;
    }

    export interface Tile extends Sprite {
        definition: TileDefinition;
    }
}
