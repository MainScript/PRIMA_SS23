namespace Script {
    export function getAllMeshesInNode(_node: FudgeCore.Node): FudgeCore.ComponentMesh[] {
        let meshes: FudgeCore.ComponentMesh[] = [];
        for (const child of _node.getChildren()) {
            if (child.getComponent(FudgeCore.ComponentMesh)) {
                meshes.push(child.getComponent(FudgeCore.ComponentMesh));
            }
            meshes = meshes.concat(getAllMeshesInNode(child));
        }
        return meshes;
    }
}
