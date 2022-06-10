import { Graph } from './graph';
import { ENT_TYPE, Sim, TEntSets, _GR_EDGE_TYPE, _GR_ENT_NODE, OBJ_TYPE, _ALL_ENT_TYPES, _OBJ_ENT_TYPES } from './sim';

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
     * Delete a set of entities. Unused posis will also be deleted.
     * For positions, the connected entities will be deleted.
     * For collections, the contents of the collection will not be deleted.
     * @param ents A list of entity IDs.
     * @param invert If true, then the list of entities wil be inverted.
     * @returns The ID of the new entity.
     */
    public delEnts(ents: string[] = null, invert: boolean = false): void {
        if (ents === null) {
            // Delete all entities.
            this.graph.clearSnapshot();
        }
        const ent_sets: TEntSets = this._createEntSets(ents);
        if (invert) { this._invertEntSets(ent_sets); }
        // delete collctions and objects
        for (const coll of ent_sets.get(ENT_TYPE.COLL)) {
            this._delColl(coll);
        }
        for (const pgon of ent_sets.get(ENT_TYPE.PGON)) {
            this._delPgon(pgon);
        }
        for (const pline of ent_sets.get(ENT_TYPE.PLINE)) {
            this._delPline(pline);
        }
        for (const point of ent_sets.get(ENT_TYPE.POINT)) {
            this._delPoint(point);
        }
        // delete positions
        this._delPosis(Array.from(ent_sets.get(ENT_TYPE.POSI)));
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
    // =============================================================================================
    // PRIVATE METHODS 
    // =============================================================================================
    /**
     * 
     * @param ents 
     * @returns 
     */
    private _createEntSets(ents: string|string[]): TEntSets {
        const ent_sets: Map<ENT_TYPE, Set<string>> = new Map([
            [ENT_TYPE.POSI, new Set()],
            [ENT_TYPE.POINT, new Set()],
            [ENT_TYPE.PLINE, new Set()],
            [ENT_TYPE.PGON, new Set()],
            [ENT_TYPE.COLL, new Set()],
        ]);
        if (!Array.isArray(ents)) { ents = [ents]; }
        for (const ent of ents) {
            const ent_type = this.graph.getNodeProp(ent, 'ent_type');
            if (ent_type === ENT_TYPE.POSI) {
                ent_sets.get(ENT_TYPE.POSI).add(ent);
            } else if (ent_type === ENT_TYPE.POINT) {
                ent_sets.get(ENT_TYPE.POINT).add(ent);
            } else if (ent_type === ENT_TYPE.PLINE) {
                ent_sets.get(ENT_TYPE.PLINE).add(ent);
            } else if (ent_type === ENT_TYPE.PGON) {
                ent_sets.get(ENT_TYPE.PGON).add(ent);
            } else if (ent_type === ENT_TYPE.COLL) {
                ent_sets.get(ENT_TYPE.COLL).add(ent);
            } else {
                throw new Error('Entity type not supported: ' + ent_type);
            }
        }
        return ent_sets;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Invert ent sets
     * @param ent_sets
     */
     private _invertEntSets(ent_sets: TEntSets): void {
        // add object positions to the list of positions to 'keep'
        // when we invert, these positions will be excluded from deletion
        // TODO is this slow?
        for (const obj_type of _OBJ_ENT_TYPES) {
            for (const ent of ent_sets.get(obj_type)) {
                for (const posi of this.sim.getEnts(ENT_TYPE.POSI, ent)) {
                    ent_sets.get(ENT_TYPE.POSI).add(posi);
                }
            }
        }
        for (const ent_type of _ALL_ENT_TYPES) {
            const ents: string[] = this.sim.getEnts(ent_type);
            const inverted: Set<string> = new Set();
            const sub_set: Set<string> = new Set(ent_sets.get(ent_type));
            for (const ent of ents) {
                if (!sub_set.has(ent)) {
                    inverted.add(ent);
                }
            }
            ent_sets.set(ent_type, inverted);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the posis, vertices, and edges of a pline or wire.
     * The posis are in vertex order and may include duplicates.
     * @param ent Pline or wire
     * @returns 
     */
     private _getEdgeTree(ent: string):  Map<ENT_TYPE, string[]> {
        const ent_tree: Map<ENT_TYPE, string[]> = new Map([
            [ENT_TYPE.POSI, []],
            [ENT_TYPE.VERT, []],
            [ENT_TYPE.EDGE, []]
        ]);
        const edges: string[] = this.sim.getEnts(ENT_TYPE.EDGE, ent);
        ent_tree.set(ENT_TYPE.EDGE, edges);
        const verts: string[] = this.sim.getEnts(ENT_TYPE.VERT, ent);
        ent_tree.set(ENT_TYPE.VERT, verts);
        const posis: string[] = verts.map(vert => this.graph.successors(vert, _GR_EDGE_TYPE.ENTITY)[0]);
        ent_tree.set(ENT_TYPE.POSI, posis) ;
        return ent_tree;
    }
    // ---------------------------------------------------------------------------------------------
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
     * 
     * @param coll 
     * @returns 
     */
    private _delColl(coll: string): void {
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
     * 
     * @param pgon 
     */
    private _delPgon(pgon: string): void {
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
     * @param pline 
     */
    private _delPline(pline: string): void {
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
    private _delPoint(point: string): void {
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
     * then there are two more special cases for open wires
     *
     * 1) If the vert is at the start of an open wire, then delete the first edge
     * 2) If teh vert is at the end of an open wire, then delete the last edge
     *
     * Finally, we come to the standard case.
     * The next edge is deleted, and the prev edge gets rewired.
     * 
     * @param posis 
     */
    private _delPosis(posis: string[]): void {
        const points: string[] = [];
        const verts: Map<OBJ_TYPE, Map<string, Set<string>>> = new Map([ // TODO does thie need to be Set()?
            [OBJ_TYPE.PLINE, new Map()],
            [OBJ_TYPE.PGON, new Map()],
            [OBJ_TYPE.PGON_HOLE, new Map()],
        ]);
        // sort the posis into 4 differen types
        for (const posi of posis) {
            // del the posi
            this._delEntAndAttribs(ENT_TYPE.POSI, posi);
            // get predecessors, can be either verts ot points or nothing
            const preds: string[] = this.graph.predecessors(posi, _GR_EDGE_TYPE.ENTITY);
            for (const pred of preds) {
                const obj_type: OBJ_TYPE = this.graph.getNodeProp(pred, 'obj_type');
                if (obj_type === OBJ_TYPE.POINT) {
                    points.push(pred);
                } else {
                    const ent_type: ENT_TYPE = obj_type === OBJ_TYPE.PLINE ? ENT_TYPE.PLINE : ENT_TYPE.PGON;
                    const ent: string = this.sim.getEnts(ent_type, pred)[0]; // get ent from vertex
                    if (verts.get(obj_type).has(ent)) {
                        verts.get(obj_type).get(ent).add(pred);
                    } else {
                        verts.get(obj_type).set(ent, new Set([pred]));
                    }
                }
            }
        }
        // delete points
        for (const point of points) {
            this._delPoint(point);
        }
        // delete pline vertices
        for (const [pline, pline_verts] of verts.get(OBJ_TYPE.PLINE)) {
            this._delPlineVerts(pline, pline_verts);
        }
        // delete pgon vertices
        for (const [pgon, pgon_verts] of verts.get(OBJ_TYPE.PGON)) {
            this._delPgonVerts(pgon, pgon_verts);
        }
        // delete pgon hole vertices
        for (const [pgon, pgon_hole_verts] of verts.get(OBJ_TYPE.PGON_HOLE)) {
            // TODO
            // this.delPgonHoleVerts(pgon, pgon_verts);
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
        const obj_type: OBJ_TYPE = this.graph.getNodeProp(vert, 'obj_type');
        // pline
        if (obj_type === OBJ_TYPE.PLINE) {
            const pline: string = this.sim.getEnts(ENT_TYPE.PLINE, vert)[0];
            this._delPlineVerts(pline, new Set([vert]));
            return;
        }
        // pgon
        if (obj_type === OBJ_TYPE.PGON) {
            const pgon: string = this.sim.getEnts(ENT_TYPE.PGON, vert)[0];
            this._delPgonVerts(pgon, new Set([vert]));
            return;
        }
        // pgon hole
        if (obj_type === OBJ_TYPE.PGON_HOLE) {
            const pgon: string = this.sim.getEnts(ENT_TYPE.PGON, vert)[0];
            // TODO
            // this.delPgonHoleVerts(pgon, [vert]);
            return;
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
        const edge_tree: Map<ENT_TYPE, string[]> = this._getEdgeTree(pline);
        const closed: boolean = this.sim.isPlineClosed(pline);
        const num_verts: number = edge_tree.get(ENT_TYPE.VERT).length;
        // do we have to delete the whole pline?
        if (num_verts - del_verts.size < 2) {
            this._delPline(pline);
        }
        // check the object time stamp TODO
        // this.modeldata.getObjsCheckTs(EEntType.PGON, pgon);
        // delete the verts
        const old_verts: string[] = edge_tree.get(ENT_TYPE.VERT);
        for (const vert of del_verts) {
            // check, has it already been deleted
            if (!this.sim.entExists(vert)) { return; }
            // get the index of this vert
            const index_vert: number = old_verts.indexOf(vert); // TODO check if this will give error
             // update the edges and wires
            if (!closed && index_vert === 0) {
                // special case, open pline, delete start edge and vert
                this.__delVert__OpenPlineStart(pline, edge_tree);
            } else if (!closed && index_vert === num_verts - 1) {
                // special case, open pline, delete end edge and vert
                this.__delVert__OpenPlineEnd(pline, edge_tree);
            } else {
                // standard case, delete the prev edge and reqire the next edge
                this.__delVert__StandardCase(pline, vert);
            }
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Deletes multiple verts in a pline.
     * Checks time stamps.
     * @param pgon 
     * @param del_verts 
     */
    private _delPgonVerts(pgon: string, del_verts: Set<string>): void {
        // get the pwires, and total num verts in whole pgon
        const wires: string[] = this.sim.getEnts(ENT_TYPE.WIRE, pgon);
        const edges_tree: Map<ENT_TYPE, string[]> = this._getEdgeTree(wires[0]);
        const num_verts: number = edges_tree.get(ENT_TYPE.VERT).length;
        // do we have to delete the whole pgon?
        if (num_verts - del_verts.size < 3) {
            this._delPgon(pgon);
        }
        // check the object time stamp TODO
        // this.modeldata.getObjsCheckTs(EEntType.PGON, pgon);
        // delete the verts
        for (const vert of del_verts) {
            // check, has it already been deleted
            if (!this.sim.entExists(vert)) { return; }
            // standard case, delete the prev edge and reqire the next edge
            this.__delVert__StandardCase(wires[0], vert);
        }
        // for pgons, also update tris TODO
        // this.modeldata.geom.edit_pgon.triPgons(pgon);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Special case, delete the first edge
     * @param pline 
     * @param edge_tree 
     */
    private __delVert__OpenPlineStart(pline: string, edge_tree: Map<ENT_TYPE, string[]>) {
        const edges: string[] = edge_tree.get(ENT_TYPE.EDGE);
        const verts: string[] = edge_tree.get(ENT_TYPE.VERT);
        const posis: string[] = edge_tree.get(ENT_TYPE.POSI);
        // delete the connections
        this.graph.delEdge(pline, edges[0], _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(edges[0], verts[1], _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(verts[0], posis[0], _GR_EDGE_TYPE.ENTITY);
        // delete the entities
        this._delEntAndAttribs(ENT_TYPE.EDGE, edges[0]);
        this._delEntAndAttribs(ENT_TYPE.VERT, verts[0]);
        // posi already deleted
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Special case, delete the last edge
     * @param pline 
     * @param edge_tree 
     */
    private __delVert__OpenPlineEnd(pline: string, edge_tree: Map<ENT_TYPE, string[]>) {
        const edges: string[] = edge_tree.get(ENT_TYPE.EDGE);
        const verts: string[] = edge_tree.get(ENT_TYPE.VERT);
        const posis: string[] = edge_tree.get(ENT_TYPE.POSI);
        // delete the connections
        this.graph.delEdge(pline, edges[edges.length - 1], _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(edges[edges.length - 1], verts[verts.length - 2], _GR_EDGE_TYPE.ENTITY);
        this.graph.delEdge(verts[verts.length - 1], posis[posis.length - 1], _GR_EDGE_TYPE.ENTITY);
        // delete the entities
        this._delEntAndAttribs(ENT_TYPE.EDGE, edges[edges.length - 1]);
        this._delEntAndAttribs(ENT_TYPE.VERT, verts[verts.length - 1]);
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
        // vert is in the middle of a wire, we must have two edges
        const edges: string[] = this.sim.getEnts(ENT_TYPE.EDGE, del_vert);
        const prev_edge: string = edges[0]; // is_first ? edges[1] : edges[0];
        const next_edge: string = edges[1]; // is_first ? edges[0] : edges[1];
        // get the verts of the two edges
        const prev_edge_verts: string[] = this.sim.getEnts(ENT_TYPE.VERT, prev_edge);
        const next_edge_verts: string[] = this.sim.getEnts(ENT_TYPE.VERT, next_edge);
        const prev_vert: string = prev_edge_verts[0];
        const next_vert: string = next_edge_verts[1];
        // run some checks TODO
        if (prev_vert === del_vert) {throw new Error('Unexpected vertex ordering 1'); }
        if (next_vert === del_vert) { throw new Error('Unexpected vertex ordering 2'); }
        if (prev_edge_verts[1] !== next_edge_verts[0]) { throw new Error('Unexpected vertex ordering 3'); }
        if (prev_edge_verts[1] !== del_vert) { throw new Error('Unexpected vertex ordering 4'); }
        // remove link wire/pline to next_edge
        this.graph.delEdge(ent, next_edge, _GR_EDGE_TYPE.ENTITY);
        // remove link prev_edge to del_vert
        this.graph.delEdge(prev_edge, del_vert, _GR_EDGE_TYPE.ENTITY);
        // replace it with link prev_edge to next_vert
        this.graph.addEdge(prev_edge, next_vert, _GR_EDGE_TYPE.ENTITY);
        // remove link del_vert to posi
        const posi: string = this.sim.getEnts(ENT_TYPE.POSI, del_vert)[0]; 
        this.graph.delEdge(del_vert, posi, _GR_EDGE_TYPE.ENTITY);
        // delete next_edge and del_vert
        this._delEntAndAttribs(ENT_TYPE.EDGE, next_edge);
        this._delEntAndAttribs(ENT_TYPE.VERT, del_vert);
    }
}