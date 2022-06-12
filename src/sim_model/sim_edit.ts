import { Graph } from './graph';
import { Sim, ENT_TYPE, _GR_EDGE_TYPE, _GR_ENT_NODE, VERT_TYPE, TEntSets } from './sim';
// =================================================================================================
// CLASS
// =================================================================================================
export class Edit {
    private graph: Graph;
    private sim: Sim;
    // ---------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR
     */
    constructor(graph: Graph, sim: Sim) {
         this.graph = graph;
         this.sim = sim;
    }
    // =============================================================================================
    // ENTITIES
    // =============================================================================================
    /**
     * 
     * @param ent 
     */
     public reverse(ent: string): void {
        // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
        throw new Error('Not implemented');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param ent 
     * @param offset 
     */
    public shift(ent: string, offset: number): void {
        // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
        throw new Error('Not implemented');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Replace all positions in an entity with a new set of positions.
     * @param ent 
     * @param new_posis
     */
     public replacePosis(ent: string, new_posis: string[]): void {
        // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
        throw new Error('Not implemented');
    }
    // =============================================================================================
    // POLYLINES
    // =============================================================================================
    /**
     * 
     * @param pline 
     */
    public openPline(pline: string): void {
        throw new Error('Not implemented');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param pline 
     */
    public closePline(pline: string): void {
        throw new Error('Not implemented');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param pline 
     * @param posi 
     * @param to_end 
     */
    public addPlineVert(pline: string, posi: string, to_end: boolean): void {
        throw new Error('Not implemented');
    }
    // =============================================================================================
    // VERTICES
    // =============================================================================================
    /**
     * 
     * @param edge 
     * @param posi 
     */
    public insertVert(edge: string, posi: string): void {
        // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
        throw new Error('Not implemented');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param verts 
     */
    public mergeVertPosis(verts: string[]): string {
        // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
        throw new Error('Not implemented');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param verts 
     */
    public cloneVertPosis(verts: string[]): string[] {
        // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
        throw new Error('Not implemented');
    }
}
// =================================================================================================
// END SIM EDIT CLASS
// =================================================================================================
    // // ---------------------------------------------------------------------------------------------
    // /**
    //  * 
    //  * @param edge 
    //  * @param posi 
    //  */
    //  public replaceVertPosi(vert: string, posi: string): void {
    //     // see src\mobius-sim\libs\geo-info\geom\GIGeomEditTopo.ts
    //     throw new Error('Not implemented');
    // }

