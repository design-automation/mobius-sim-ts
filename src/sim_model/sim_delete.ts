import { Graph } from './graph';
import { Sim, ENT_TYPE, _GR_EDGE_TYPE, _GR_ENT_NODE, VERT_TYPE, TEntSets } from './sim';
// =================================================================================================
// CLASS
// =================================================================================================
export class Delete {
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
    // PUBLIC METHODS 
    // =============================================================================================
    /**
     * 
     * @param coll 
     * @returns 
     */
    public delColl(coll: string): void {
        if (!this.sim.entExists(coll)) { return; }
        const succs: string[] = this.graph.successors(coll, _GR_EDGE_TYPE.ENTITY);
        // remove content (dont del it)
        for (const succ of succs) {
            this.graph.delEdge(coll, succ, _GR_EDGE_TYPE.ENTITY);
        }
        // del coll
        this._delEntAndAttribs(ENT_TYPE.COLL, coll);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param pgon 
     */
    public delPgon(pgon: string): void {
        this._remObjFromColls(pgon);
        // get object topo sub ents
        const sub_ents: TEntSets = this.sim.getSubEnts(pgon);
        // del object and topo
        for (const sub_ent_type of [ENT_TYPE.PGON,ENT_TYPE.WIRE,ENT_TYPE.EDGE,ENT_TYPE.VERT]) {
            for (const sub_ent of sub_ents.get(sub_ent_type)) {
                this._delEntAndAttribs(sub_ent_type, sub_ent);
            }
        }
        // delte the link from vert to posis
        for (const vert of sub_ents.get(ENT_TYPE.VERT)) {
            this.graph.delEdge(vert, null, _GR_EDGE_TYPE.ENTITY);
        }
        // del posis
        this.delUnusedPosis(Array.from(sub_ents.get(ENT_TYPE.POSI)));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param pgon 
     * @param wire 
     */
    public delPgonHole(pgon: string, wire: string): void {
        // get object topo sub ents
        const sub_ents: TEntSets = this.sim.getSubEnts(wire);
        // del object and topo
        for (const sub_ent_type of [ENT_TYPE.PGON,ENT_TYPE.WIRE,ENT_TYPE.EDGE,ENT_TYPE.VERT]) {
            for (const sub_ent of sub_ents.get(sub_ent_type)) {
                this._delEntAndAttribs(sub_ent_type, sub_ent);
            }
        }
        // delete the link from the pgon to the wire
        this.graph.delEdge(pgon, wire, _GR_EDGE_TYPE.ENTITY);
        // delte the link from vert to posis
        for (const vert of sub_ents.get(ENT_TYPE.VERT)) {
            this.graph.delEdge(vert, null, _GR_EDGE_TYPE.ENTITY);
        }
        // del posis
        this.delUnusedPosis(Array.from(sub_ents.get(ENT_TYPE.POSI)));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param pline 
     */
    public delPline(pline: string): void {
        this._remObjFromColls(pline);
        // get object topo sub ents
        const sub_ents: TEntSets = this.sim.getSubEnts(pline);
        // del object and topo
        for (const sub_ent_type of [ENT_TYPE.PLINE,ENT_TYPE.EDGE,ENT_TYPE.VERT]) {
            for (const sub_ent of sub_ents.get(sub_ent_type)) {
                this._delEntAndAttribs(sub_ent_type, sub_ent);
            }
        }
        // delte the link from vert to posis
        for (const vert of sub_ents.get(ENT_TYPE.VERT)) {
            this.graph.delEdge(vert, null, _GR_EDGE_TYPE.ENTITY);
        }
        // del posis
        this.delUnusedPosis(Array.from(sub_ents.get(ENT_TYPE.POSI)));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param point 
     */
    public delPoint(point: string): void {
        this._remObjFromColls(point);
        const posi: string = this.sim.getEntPosis(point) as string;
        // del object
        this._delEntAndAttribs(ENT_TYPE.POINT, point);
        // delte the link point to posis
        this.graph.delEdge(point, posi, _GR_EDGE_TYPE.ENTITY);
        // del posis
        this.delUnusedPosis([posi]);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Del unused posis, i.e posis that are not linked to any vertices.
     * @param posis
     */
     public delUnusedPosis(posis: string[]): void {
        for (const posi of posis) {
            if ( this.graph.predecessors(posi, _GR_EDGE_TYPE.ENTITY).length === 0) { 
                this._delEntAndAttribs(ENT_TYPE.POSI, posi);
            }
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Deleting a posi can result in deleting the associated vert.
     *
     * In the general case, the two edges adjacent to the deleted vert will be merged.
     * This means that the next edge will be deleted.
     * The end vert of the previous edge will connect to the end posi of the next edge.
     *
     * The first special case is if the vert is for a point. In that case, just delete the point.
     *
     * Then there are two special cases for whicj we delete the whole object
     *
     * 1) If the wire is open and has only 1 edge, then delete the wire
     * 2) if the wire is closed pgon and has only 3 edges, then:
     *    a) If the wire is the boundary of the pgon, then delete the whole pgon
     *    b) If the wire is a hole in the pgon, then delete the hole
     *
     * Assuming the special cases above do not apply,
     * then there is one more special cases for open wires
     *
     * 1) If the vert is at the start or end of an open wire, then delete the first or last edge
     *
     * Finally, we come to the standard case.
     * The next edge is deleted, and the prev edge gets rewired.
     * 
     * @param posis 
     */
    public delPosis(posis: string[]): void {
        const verts: Map<VERT_TYPE, Map<string, Set<string>>> = new Map([ // TODO does thie need to be Set()?
            [VERT_TYPE.PLINE, new Map()],
            [VERT_TYPE.PGON, new Map()],
            [VERT_TYPE.PGON_HOLE, new Map()],
        ]);
        // sort the posis into 4 differen types
        for (const posi of posis) {
            // del the posi
            this._delEntAndAttribs(ENT_TYPE.POSI, posi);
            // get predecessors, can be either points or verts or []
            const preds: string[] = this.graph.predecessors(posi, _GR_EDGE_TYPE.ENTITY);
            for (const pred of preds) {
                if (this.graph.getNodeProp(pred, 'ent_type') === ENT_TYPE.POINT) {
                    this.delPoint(pred);
                } else {
                    const vert_type: VERT_TYPE = this.graph.getNodeProp(pred, 'vert_type');
                    const ent_type: ENT_TYPE = vert_type === VERT_TYPE.PLINE ? ENT_TYPE.PLINE : ENT_TYPE.PGON;
                    const ent: string = this.sim.getEnts(ent_type, pred)[0]; // get ent from vertex
                    if (verts.get(vert_type).has(ent)) {
                        verts.get(vert_type).get(ent).add(pred);
                    } else {
                        verts.get(vert_type).set(ent, new Set([pred]));
                    }
                }
            }
        }
        // delete pline vertices
        for (const [pline, del_verts] of verts.get(VERT_TYPE.PLINE)) {
            this._delPlineVerts(pline, del_verts);
        }
        // delete pgon vertices
        for (const [pgon, del_verts] of verts.get(VERT_TYPE.PGON)) {
            this._delPgonVerts(pgon, VERT_TYPE.PGON, del_verts);
        }
        // delete pgon hole vertices
        for (const [pgon, del_verts] of verts.get(VERT_TYPE.PGON_HOLE)) {
            this._delPgonVerts(pgon, VERT_TYPE.PGON_HOLE, del_verts);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Deletes a vert. TODO
     * Not sure if this is till needed...
     *
     * Call by GIGeomEditTopo.replaceVertPosi()
     *
     * Checks time stamps.
     * @param vert
     */
     private _delVert(vert: string): void {
        const vert_type: VERT_TYPE = this.graph.getNodeProp(vert, 'vert_type');
        // pline
        if (vert_type === VERT_TYPE.PLINE) {
            const pline: string = this.sim.getEnts(ENT_TYPE.PLINE, vert)[0];
            this._delPlineVerts(pline, new Set([vert]));
            return;
        }
        // pgon
        if (vert_type === VERT_TYPE.PGON || vert_type === VERT_TYPE.PGON_HOLE) {
            const wire: string = this.sim.getEnts(ENT_TYPE.WIRE, vert)[0];
            this._delPgonVerts(wire, vert_type, new Set([vert]));
            return;
        }
    }
    // =============================================================================================
    // PRIVATE METHODS 
    // =============================================================================================
    /**
     * 
     * @param ent_type 
     * @param ent 
     * @returns 
     */
         private _delEntAndAttribs(ent_type: ENT_TYPE, ent: string): void {
            // del the entity
            this.graph.delEdge(_GR_ENT_NODE.get(ent_type), ent, _GR_EDGE_TYPE.META);
            // del all the attrib values that this entity has
            for (const att_name of this.sim.getAttribs(ent_type)) {
                this.sim.delAttribVal(ent, att_name);
            }
        }
        // ---------------------------------------------------------------------------------------------
    /**
     * Called by delPgon(), delPline(), _delPoint()
     * @param ent 
     */
     private _remObjFromColls(ent: string): void {
        // remove obj from colls
        const colls: string[] = this.graph.predecessors(ent, _GR_EDGE_TYPE.ENTITY);
        for (const coll of colls) {
            this.graph.delEdge(coll, ent, _GR_EDGE_TYPE.ENTITY);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Deletes multiple verts in a pline.
     * Checks time stamps.
     * @param pline 
     * @param del_verts 
     * @returns 
     */
    private _delPlineVerts(pline: string, del_verts: Set<string>): void {
        // get the posis, edges, and wires, and other info
        const edges: string[] = this.sim.getEnts(ENT_TYPE.EDGE, pline);
        const closed: boolean = this.sim.isPlineClosed(pline);
        const num_verts: number =  closed ? edges.length : edges.length + 1;
        // do we have to delete the whole pline?
        if (num_verts - del_verts.size < 2) {
            this.delPline(pline);
        }
        // check the object time stamp TODO
        // this.modeldata.getObjsCheckTs(EEntType.PLINE, pline);
        // delete the verts
        for (const del_vert of del_verts) {
            // check, has it already been deleted
            if (!this.sim.entExists(del_vert)) { continue; }
             // look for special cases
            if (!closed) {
                // get the index of this vert
                const verts: string[] = this.sim.getEnts(ENT_TYPE.VERT, pline);
                const del_idx: number = verts.indexOf(del_vert); 
                if (del_idx === 0 || del_idx === verts.length - 1) {
                    // special case, open pline, delete edge and vert
                    this.__delVert__OpenPline(pline, del_vert);
                    continue;
                }
            }
            // standard case, delete next edge and vert
            this.__delVert__StandardCase(pline, del_vert);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Deletes multiple verts in a pline.
     * Checks time stamps.
     * @param pgon A polygon ID.
     * @param vert_type The type of vertices to delete: PGON or PGON_HOLE (see VERT_TYPE).
     * @param del_verts A set of vertex IDs to deleted.
     */
    private _delPgonVerts(pgon: string, vert_type: VERT_TYPE, del_verts: Set<string>): void {
        const wire: string = this.sim.getEnts(ENT_TYPE.WIRE, del_verts[0])[0];
        const edges: string[] = this.sim.getEnts(ENT_TYPE.EDGE, wire);
        const num_verts: number = edges.length;
        // do we have to delete the whole pgon or hole?
        if (num_verts - del_verts.size < 3) {
            if (vert_type === VERT_TYPE.PGON) {
                this.delPgon(pgon);
            } else if (vert_type === VERT_TYPE.PGON_HOLE) {
                this.delPgonHole(pgon, wire);
            }
        }
        // check the object time stamp TODO
        // this.modeldata.getObjsCheckTs(EEntType.PGON, pgon);
        // delete the verts
        for (const del_vert of del_verts) {
            // check, has it already been deleted
            if (!this.sim.entExists(del_vert)) { return; }
            // standard case, delete the next edge and del_vert
            this.__delVert__StandardCase(wire, del_vert);
        }
        // triangulate
        this.sim.triangulatePgon(pgon);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Special case, delete the first or last edge
     * @param pline 
     */
    private __delVert__OpenPline(pline: string, del_vert: string) {
        const del_edge: string = this.sim.getEnts(ENT_TYPE.EDGE, del_vert)[0];
        const posi1: string = this.sim.getEnts(ENT_TYPE.POSI, del_vert)[0];
        // delete the topo links
        this.graph.delEdge(pline, del_edge, _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(del_edge, null, _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(del_vert, posi1, _GR_EDGE_TYPE.ENTITY);
        // delete the entities
        this._delEntAndAttribs(ENT_TYPE.EDGE, del_edge);
        this._delEntAndAttribs(ENT_TYPE.VERT, del_vert);
        // posi already deleted
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Final case, delete the vert and next edge.
     * For pgons, this does not update the tris
     * @param ent 
     * @param del_vert 
     */
    private __delVert__StandardCase(ent: string, del_vert: string) {
        const [prev_edge, del_edge]: [string, string] = this.sim.getEnts(ENT_TYPE.EDGE, del_vert) as [string, string];
        const posi: string = this.sim.getEnts(ENT_TYPE.POSI, del_vert)[0]; 
        // get the verts of the two edges
        const [prev_vert, _]: [string, string] = this.sim.getEnts(ENT_TYPE.VERT, prev_edge) as [string, string];
        const [__, next_vert]: [string, string] = this.sim.getEnts(ENT_TYPE.VERT, del_edge) as [string, string];
        // run some checks
        if (prev_vert === del_vert) {throw new Error('Unexpected vertex ordering 1'); }
        if (next_vert === del_vert) {throw new Error('Unexpected vertex ordering 2'); }
        // remove link wire/pline to edge1
        this.graph.delEdge(ent, del_edge, _GR_EDGE_TYPE.ENTITY);
        // remove link edge1 to both verts (next_vert and del_vert)
        this.graph.delEdge(del_edge, null, _GR_EDGE_TYPE.ENTITY);
        // replace with link prev_vert to next_vert
        this.graph.addEdge(prev_edge, next_vert, _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(prev_edge, del_vert, _GR_EDGE_TYPE.ENTITY);
        const edges: string[] = this.graph.predecessors(next_vert, _GR_EDGE_TYPE.ENTITY).reverse();
        this.graph.setPredessors(next_vert, edges, _GR_EDGE_TYPE.ENTITY);
        // remove link del_vert to posi
        this.graph.delEdge(del_vert, posi, _GR_EDGE_TYPE.ENTITY);
        // delete edge1 and del_vert
        this._delEntAndAttribs(ENT_TYPE.EDGE, del_edge);
        this._delEntAndAttribs(ENT_TYPE.VERT, del_vert);
    }
}
// =================================================================================================
// END SIM DELETE CLASS
// =================================================================================================