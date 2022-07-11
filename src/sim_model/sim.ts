import { Delete } from './sim_delete';
import { Graph, X2X } from './graph';
import { Edit } from './sim_edit';
import { Triangulate } from './sim_tri';
// =================================================================================================
// ENUMS
// =================================================================================================
/* Enum: entity types. */
export enum ENT_TYPE {
    POSI = 'ps',
    VERT = '_v',
    EDGE = '_e',
    WIRE = '_w',
    TRI = '_t',
    POINT = 'pt',
    PLINE = 'pl',
    PGON = 'pg',
    COLL = 'co',
    COLL_PRED = 'cp',
    COLL_SUCC = 'cs',
    MODEL = 'mo'
}
// -------------------------------------------------------------------------------------------------
/* Enum: vertex types */
export enum VERT_TYPE {
    PLINE,
    PGON,
    PGON_HOLE
}
// -------------------------------------------------------------------------------------------------
/* Enum: data types for attributes. */
export enum DATA_TYPE {
    NUM = 'number',
    STR =  'string',
    BOOL =  'boolean',
    LIST =  'list',
    DICT =  'dict'
}
// -------------------------------------------------------------------------------------------------
/* Enum: operators that can be used in a filter. */
export enum COMPARATOR {
    IS_EQUAL = '==',
    IS_NOT_EQUAL = '!=',
    IS_GREATER_OR_EQUAL = '>=',
    IS_LESS_OR_EQUAL = '<=',
    IS_GREATER = '>',
    IS_LESS = '<'
}
// =================================================================================================
// TYPES
// =================================================================================================
export type TAttribDataTypes = string | number | boolean | any[] | object;
export type Txyz = [number, number, number];
export type TEntSets = Map<ENT_TYPE, Set<string>>;
type TEntSeq = Map<ENT_TYPE, {idx: number, succ: _GR_EDGE_TYPE, pred: _GR_EDGE_TYPE}>;
// =================================================================================================
// GRAPH NAMES
// =================================================================================================
/* node names for meta ents */
export const _GR_ENT_NODE: Map<ENT_TYPE, string> = new Map([
    [ENT_TYPE.POSI, '_ents_posis'],
    [ENT_TYPE.VERT, '_ents_verts'],
    [ENT_TYPE.EDGE, '_ents_edges'],
    [ENT_TYPE.WIRE, '_ents_wires'],
    [ENT_TYPE.TRI, '_ents_tris'],
    [ENT_TYPE.POINT, '_ents_points'],
    [ENT_TYPE.PLINE, '_ents_plines'],
    [ENT_TYPE.PGON, '_ents_pgons'],
    [ENT_TYPE.COLL, '_ents_colls']
]);
// -------------------------------------------------------------------------------------------------
/* node names for meta attribs */
export const _GR_ATTRIB_NODE: Map<ENT_TYPE, string> = new Map([
    [ENT_TYPE.POSI, '_atts_posis'],
    [ENT_TYPE.VERT, '_atts_verts'],
    [ENT_TYPE.EDGE, '_atts_edges'],
    [ENT_TYPE.WIRE, '_atts_wires'],
    [ENT_TYPE.POINT, '_atts_points'],
    [ENT_TYPE.PLINE, '_atts_plines'],
    [ENT_TYPE.PGON, '_atts_pgons'],
    [ENT_TYPE.COLL, '_atts_colls']
]);
// -------------------------------------------------------------------------------------------------
/* node names for attributes, must macth _graphAttribNodeName() */
export const _GR_XYZ_NODE: string = '_att_psxyz';
// -------------------------------------------------------------------------------------------------
/* Enum: graph edge types. */
export enum _GR_EDGE_TYPE {
    ENTITY = 'entity',
    ATTRIB =  'attrib',
    META = 'meta',
    TRI = 'tri'
}
// =================================================================================================
// ENT SEQUENCES
// =================================================================================================
const _ENT_SEQ: TEntSeq = new Map([
    [ENT_TYPE.POSI,  {idx: 0, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.VERT,  {idx: 1, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.EDGE,  {idx: 2, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.WIRE,  {idx: 3, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.POINT, {idx: 4, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.PLINE, {idx: 4, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.PGON,  {idx: 4, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.COLL,  {idx: 6, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}]
]);
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_CO_PT_PO: TEntSeq = new Map([
    [ENT_TYPE.POSI,  {idx: 0, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
    [ENT_TYPE.POINT, {idx: 1, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
    [ENT_TYPE.COLL,  {idx: 6, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}]
]);
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_CO_PL_PO: TEntSeq = new Map([
    [ENT_TYPE.POSI,  {idx: 0, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.VERT,  {idx: 1, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.EDGE,  {idx: 2, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.PLINE, {idx: 3, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}], 
    [ENT_TYPE.COLL,  {idx: 6, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}]
]);
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_CO_PG_PO: TEntSeq = new Map([
     [ENT_TYPE.POSI, {idx: 0, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
     [ENT_TYPE.VERT, {idx: 1, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
     [ENT_TYPE.EDGE, {idx: 2, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
     [ENT_TYPE.WIRE, {idx: 3, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
     [ENT_TYPE.PGON, {idx: 4, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
     [ENT_TYPE.COLL, {idx: 6, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}]
]);
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_CO_PG_TRI_PO: TEntSeq = new Map([
    [ENT_TYPE.POSI, {idx: 0, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}],
    [ENT_TYPE.VERT, {idx: 1, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.TRI}],
    [ENT_TYPE.TRI,  {idx: 2, succ: _GR_EDGE_TYPE.TRI,    pred: _GR_EDGE_TYPE.TRI}],
    [ENT_TYPE.PGON, {idx: 3, succ: _GR_EDGE_TYPE.TRI,    pred: _GR_EDGE_TYPE.ENTITY}],
    [ENT_TYPE.COLL, {idx: 6, succ: _GR_EDGE_TYPE.ENTITY, pred: _GR_EDGE_TYPE.ENTITY}]
]);
// =================================================================================================
// ENT SETS
// =================================================================================================
/* ENT_TYPES FOR COLLECTIONS */
export const _COLL_ENT_TYPES: Set<ENT_TYPE> = new Set([
    ENT_TYPE.POINT, 
    ENT_TYPE.PLINE, 
    ENT_TYPE.PGON, 
    ENT_TYPE.COLL
]);
// -------------------------------------------------------------------------------------------------
/*  ENT_TYPES FOR OBJECTS */
export const _OBJ_ENT_TYPES: Set<ENT_TYPE> = new Set([
    ENT_TYPE.POINT, 
    ENT_TYPE.PLINE, 
    ENT_TYPE.PGON, 
]);
// -------------------------------------------------------------------------------------------------
/*  ENT_TYPES FOR TOPOLOGY */
export const _TOPO_ENT_TYPES: Set<ENT_TYPE> = new Set([
    ENT_TYPE.VERT, 
    ENT_TYPE.EDGE, 
    ENT_TYPE.WIRE
]);
// -------------------------------------------------------------------------------------------------
/* ENT_TYPES */
export const _ALL_ENT_TYPES: Set<ENT_TYPE> = new Set([
    ENT_TYPE.POSI,
    ENT_TYPE.VERT, 
    ENT_TYPE.EDGE, 
    ENT_TYPE.WIRE, 
    ENT_TYPE.POINT, 
    ENT_TYPE.PLINE, 
    ENT_TYPE.PGON, 
    ENT_TYPE.COLL
]);
// =================================================================================================
// CLASS
// =================================================================================================
/*
The nodes for entities are:

- ent nodes
  - e.g. '_p1', '_v123'

- ent_type nodes 
  - e.g. '_ents_posis', '_ents_verts'

The nodes for attribs are:

- _atts_ent_type nodes 
  - e.g.'_atts_pgons'

- _att_ent_type_name nodes 
  - e.g. '_att_pgarea'

- _att_val nodes 
  - e.g. '[1,2,3]'

The forward edges are as follows:

Edges of type 'entity':

- ent -> sub_ents 
  - e.g. _pg0 -> [_w0, _w1]
  - edge_type = 'entity'
  - many to many

Edges of type 'meta':

- ent_type -> ents
  - e.g. '_ents_pgons' -> '_pg0'
  - edge_type = 'meta'
  - one to many, no reverse edges

- ent_type_attribs -> _att_ent_type_name 
  - e.g. '_atts_pgons' -> '_att_pgarea'
  - edge_type = 'meta'
  - one to many, no reverse edges

Edges of type 'att':

- attrib_val -> att_ent_type_name 
  - e.g. '123' -> '_att_pgarea'
  - edge_type = 'attrib' 
  - many to one

Edges of with a type specific to the attribute:

- ent -> attrib_val 
  - '_pg0' -> '123'
  - edge_type = att_ent_type_name e.g. '_att_pgarea'
  - many to one

For each forward edge, there is an equivalent reverse edge, except for META edges.
*/
export class Sim {
    private graph: Graph;
    private model_attribs: Map<string, any>;
    private del: Delete;
    private edit: Edit;
    private tri: Triangulate;
    // ---------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR
     */
    constructor() {

        // graph
        this.graph = new Graph();
        this.del = new Delete(this.graph, this);
        this.edit = new Edit(this.graph, this);
        this.tri = new Triangulate(this.graph, this);

        // edge types
        this.graph.addEdgeType(_GR_EDGE_TYPE.ENTITY);
        this.graph.addEdgeType(_GR_EDGE_TYPE.ATTRIB);
        this.graph.addEdgeType(_GR_EDGE_TYPE.META, false);
        this.graph.addEdgeType(_GR_EDGE_TYPE.TRI);

        // create nodes for ents and attribs
        for (const ent_type of 
                [ENT_TYPE.POSI, ENT_TYPE.VERT, ENT_TYPE.EDGE, ENT_TYPE.WIRE, ENT_TYPE.TRI, 
                ENT_TYPE.POINT, ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) {
            this.graph.addNode(_GR_ENT_NODE.get(ent_type));
            this.graph.addNode(_GR_ATTRIB_NODE.get(ent_type));
        }

        // add xyz attrib
        this._graphAddAttrib(ENT_TYPE.POSI, 'xyz', DATA_TYPE.LIST);

        // add empty model attrbutes map
        this.model_attribs = new Map();
    }
    // =============================================================================================
    // CREATE NEW ENTITIES
    // =============================================================================================
    /**
     * Add a position to the model, specifying the XYZ coordinates.
     * @param xyz The XYZ coordinates, a list of three numbers.
     * @returns The ID of the new position.
     */
    public addPosi(xyz: Txyz = null): string {
        const posi: string = this._graphAddEnt(ENT_TYPE.POSI);
        if (xyz !== null) { this.setPosiCoords(posi, xyz); }
        return posi;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a point object to the model, specifying a single position.
     * @param posi A position ID.
     * @returns The ID of the new point.
     */
    public addPoint(posi: string): string {
        const point: string = this._graphAddEnt(ENT_TYPE.POINT);
        this.graph.addEdge(point, posi, _GR_EDGE_TYPE.ENTITY);
        return point;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a polyline object to the model, specifying a list of positions.
     * @param posis A list of position IDs.
     * @returns The ID of the new polyline.
     */
    public addPline(posis: string[]): string {
        if (posis.length < 2) {
            throw new Error('Too few positions for polyline.');
        }
        // pline
        const pline = this._graphAddEnt(ENT_TYPE.PLINE);
        const closed: boolean = posis[0] === posis[posis.length - 1];
        this._addEdgeSeq(posis, posis.length - 1, closed, VERT_TYPE.PLINE, pline);
        //  return
        return pline;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a polygon object to the model, specifying a list of positions.
     * @param posis A list of position IDs.
     * @returns The ID of the new polygon.
     */
    public addPgon(posis: string[]|string[][]): string {
        posis = Array.isArray(posis[0]) ? posis : [posis] as string[][];
        if (posis[0].length < 3) {
            throw new Error('Too few positions for polygon.');
        }
        // pgon and wire
        const pgon = this._graphAddEnt(ENT_TYPE.PGON);
        const wire = this._graphAddEnt(ENT_TYPE.WIRE);
        this.graph.addEdge(pgon, wire, _GR_EDGE_TYPE.ENTITY);
        // verts and edges
        this._addEdgeSeq(posis[0] as string[], posis[0].length, true, VERT_TYPE.PGON, wire);
        // make holes
        for (let i = 1; i < posis.length; i++) {
            this.addPgonHole(pgon, posis[i] as string[]);
        }
        // triangulate
        this.tri.triangulatePgon(pgon);
        // return
        return pgon;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Create a hole in a polygon.
     * @param pgon The polygon ID.
     * @param posis A list of position IDs for the hole.
     * @returns The ID of the hole wire.
     */
    public addPgonHole(pgon: string, posis: string[]): string {
        if (posis.length < 3) {
            throw new Error('Too few positions for polygon hole.');
        }
        // wire
        const wire = this._graphAddEnt(ENT_TYPE.WIRE);
        this.graph.addEdge(pgon, wire, _GR_EDGE_TYPE.ENTITY);
        // verts and edges
        this._addEdgeSeq(posis, posis.length, true, VERT_TYPE.PGON_HOLE, wire);
        // triangulate
        this.tri.triangulatePgon(pgon);
        //  return
        return wire;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a sequnce of edges. Use by addPgon(), addPgonHole(), addPline()
     * @param posis The list of posis.
     * @param num_edges The number of edges to add.
     * @param closed If true, and additional edge is added to close the loop.
     * @param vert_type The vertex type, see VERT_TYPE
     * @param parent The parent of the new edges. Wither a wire or a pline.
     */
    private _addEdgeSeq(posis: string[], num_edges: number, closed: boolean, 
            vert_type: VERT_TYPE, parent: string): void {
        const num_verts: number = closed ? num_edges : num_edges + 1;
        const edges: string[] = [];
        let v0: string, v1: string;
        // v0
        const v_start: string = this._graphAddEnt(ENT_TYPE.VERT);
        this.graph.setNodeProp(v_start, 'vert_type', vert_type);
        this.graph.addEdge(v_start, posis[0], _GR_EDGE_TYPE.ENTITY);
        v0 = v_start;
        for (let i = 1; i < num_verts; i++) {
            // v1
            v1 = this._graphAddEnt(ENT_TYPE.VERT);
            this.graph.setNodeProp(v1, 'vert_type', vert_type);
            this.graph.addEdge(v1, posis[i], _GR_EDGE_TYPE.ENTITY);
            // edge
            const edge: string = this._graphAddEnt(ENT_TYPE.EDGE);
            this.graph.addEdge(parent, edge, _GR_EDGE_TYPE.ENTITY);
            this.graph.addEdge(edge, v0, _GR_EDGE_TYPE.ENTITY);
            this.graph.addEdge(edge, v1, _GR_EDGE_TYPE.ENTITY);
            v0 = v1;
            edges.push(edge);
        }
        // last edge
        if (closed) {
            const last_edge: string = this._graphAddEnt(ENT_TYPE.EDGE);
            this.graph.addEdge(parent, last_edge, _GR_EDGE_TYPE.ENTITY);
            this.graph.addEdge(last_edge, v1, _GR_EDGE_TYPE.ENTITY);
            this.graph.addEdge(last_edge, v_start, _GR_EDGE_TYPE.ENTITY);
            // re-order the predecessors of the start vertex
            // the order should be [last_edge, first_edge]
            this.graph.setPredessors(v_start, [last_edge, edges[0]], _GR_EDGE_TYPE.ENTITY);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Triangulate a polygon.
     * @param pgon The polygon ID.
     */
    public triangulatePgon(pgon: string): void {
        this.tri.triangulatePgon(pgon);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Make a copy of an list of entities. For objects, the object positions are also copied. For 
     * collections, the contents of the collection is also copied. 
     * TODO Raise error for deleted ents ???
     * @param ents A list of IDs of entitities to be copied.
     * @param vec Optional vector specifying the transplation of the positions.
     * @returns A list of IDs of the copied entities.
     */
    public copyEnts(ents: string[], vec?: Txyz): string[] {
        // need to make sure that each posi is only copied once so that welds remain intact
        // the posis_map will stores old_posi -> new_posi
        const posis_map: Map<string, string> = new Map();
        // to transfer attribytes, an ents_map is needed
        // ents maps will sore old and new
        const ents_map: Map<ENT_TYPE, {old: string[], new: string[]}> = new Map([
            [ENT_TYPE.POSI, {old: [], new: []}],
            [ENT_TYPE.VERT, {old: [], new: []}],
            [ENT_TYPE.EDGE, {old: [], new: []}],
            [ENT_TYPE.WIRE, {old: [], new: []}],
            [ENT_TYPE.POINT, {old: [], new: []}],
            [ENT_TYPE.PLINE, {old: [], new: []}],
            [ENT_TYPE.PGON, {old: [], new: []}],
            [ENT_TYPE.COLL, {old: [], new: []}],
        ]);
        const copies: string[] = [];
        for (const old_ent of ents) {
            const ent_type: ENT_TYPE = this.graph.getNodeProp(old_ent, 'ent_type');
            if (ent_type === ENT_TYPE.POSI) {
                copies.push(this._copyPosi(posis_map, ents_map, old_ent, vec));
            } else if (ent_type === ENT_TYPE.POINT) {
                copies.push(this._copyPoint(posis_map, ents_map, old_ent, vec));
            } else if (ent_type === ENT_TYPE.PLINE) {
                copies.push(this._copyPline2(posis_map, ents_map, old_ent, vec));
            } else if (ent_type === ENT_TYPE.PGON) {
                copies.push(this._copyPgon2(posis_map, ents_map, old_ent, vec));
            } else if (ent_type === ENT_TYPE.COLL) {
                copies.push(this._copyColl(posis_map, ents_map, old_ent, vec));
            }
        }
        // copy the attributes
        this._copyTransferAttribs(ents_map);
        return copies;
    }
    private _copyPosi(posis_map: Map<string, string>, 
            ents_map: Map<ENT_TYPE,{old: string[], new: string[]}>, 
            old_posi: string, vec?: Txyz): string {
        if (posis_map.has(old_posi)) { return posis_map.get(old_posi); }
        let new_posi: string;
        let att_val_node: string;
        if (vec === undefined) {
            // create posi
            new_posi = this.addPosi();
            att_val_node = this.graph.successors(old_posi, _GR_XYZ_NODE)[0];
        } else {
            // create posi and move
            const xyz: Txyz = this.getPosiCoords(old_posi);
            new_posi = this.addPosi( [ xyz[0] + vec[0], xyz[1] + vec[1], xyz[2] + vec[2] ] );
            console.log("moving posi", xyz, vec, [ xyz[0] + vec[0], xyz[1] + vec[1], xyz[2] + vec[2] ])

            att_val_node = this.graph.successors(new_posi, _GR_XYZ_NODE)[0];
        }
        this.graph.addEdge(new_posi, att_val_node, _GR_XYZ_NODE);
        posis_map.set(old_posi, new_posi);
        ents_map.get(ENT_TYPE.POSI).old.push(old_posi);
        ents_map.get(ENT_TYPE.POSI).new.push(new_posi);
        return new_posi;
    }
    private _copyPoint(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_point: string, vec?: Txyz): string {
        const old_posi: string = this.getEntPosis(old_point) as string;
        const new_posi: string = this._copyPosi(posis_map, ents_map, old_posi, vec);
        const new_point: string = this.addPoint(new_posi);
        // this._copyAddEnts(ents_map.get(ENT_TYPE.POINT), [old_point], [new_point]);
        ents_map.get(ENT_TYPE.POINT).old.push(old_point);
        ents_map.get(ENT_TYPE.POINT).new.push(new_point);
        return new_point;
    }
    private _copyPline2(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_pline: string, vec?: Txyz): string {
        // create pline
        const new_pline: string = this._graphAddEnt(ENT_TYPE.PLINE);
        ents_map.get(ENT_TYPE.PLINE).old.push(old_pline);
        ents_map.get(ENT_TYPE.PLINE).new.push(new_pline);
        // edges, verts, posis
        this._copyEdgesVertsPosis(posis_map, ents_map, old_pline, new_pline, vec);
        return new_pline;
    }
    private _copyPgon2(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_pgon: string, vec?: Txyz): string {
        // create a verts map for triangulation: old_vert -> new_vert
        const verts_map: Map<string, string> = new Map(); 
        // create pgon
        const new_pgon: string = this._graphAddEnt(ENT_TYPE.PGON);
        ents_map.get(ENT_TYPE.PGON).old.push(old_pgon);
        ents_map.get(ENT_TYPE.PGON).new.push(new_pgon);
        // wires
        const old_wires: string[] = this.graph.successors(old_pgon, _GR_EDGE_TYPE.ENTITY);
        for (const old_wire of old_wires) {
            const new_wire: string = this._graphAddEnt(ENT_TYPE.PLINE);
            ents_map.get(ENT_TYPE.WIRE).old.push(old_wire);
            ents_map.get(ENT_TYPE.WIRE).new.push(new_wire);
            this.graph.addEdge(new_pgon, new_wire, _GR_EDGE_TYPE.ENTITY);
            // edges, verts, posis
            const wi_verts_map: Map<string, string> = 
                this._copyEdgesVertsPosis(posis_map, ents_map, old_wire, new_wire, vec);
            wi_verts_map.forEach( (new_vert, old_vert) => verts_map.set(old_vert, new_vert) );
        }
        // triangulate
        const old_tris: string[] = this.graph.successors(old_pgon, _GR_EDGE_TYPE.TRI);
        for (const old_tri of old_tris) {
            const new_tri: string = this._graphAddEnt(ENT_TYPE.TRI);
            this.graph.addEdge(new_pgon, new_tri, _GR_EDGE_TYPE.TRI);
            for (const old_vert of this.graph.successors(old_tri, _GR_EDGE_TYPE.TRI)) {
                this.graph.addEdge(new_tri, verts_map.get(old_vert), _GR_EDGE_TYPE.TRI);
            }
        }
        // return the new polygon
        return new_pgon;
    }
    private _copyEdgesVertsPosis(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_parent: string, new_parent: string, vec?: Txyz): Map<string, string> {
        // verts map: old_vert -> new_vert
        const verts_map: Map<string, string> = new Map();
        // loop
        for (const old_edge of this.graph.successors(old_parent, _GR_EDGE_TYPE.ENTITY)) {
            // 1 edge
            const new_edge: string = this._graphAddEnt(ENT_TYPE.EDGE);
            ents_map.get(ENT_TYPE.EDGE).old.push(old_edge);
            ents_map.get(ENT_TYPE.EDGE).new.push(new_edge);
            this.graph.addEdge(new_parent, new_edge, _GR_EDGE_TYPE.ENTITY);
            // 2 verts and 2 posis
            const old_verts2: string[] = this.graph.successors(old_edge, _GR_EDGE_TYPE.ENTITY);
            const new_verts2: string[] = [];
            for (const i of [0,1]) {
                if (verts_map.has(old_verts2[i])) {
                    new_verts2[i] = verts_map.get(old_verts2[i]);
                } else {
                    new_verts2[i] = this._graphAddEnt(ENT_TYPE.VERT);
                    ents_map.get(ENT_TYPE.VERT).old.push(old_verts2[i]);
                    ents_map.get(ENT_TYPE.VERT).new.push(new_verts2[i]);
                    const old_posi: string = this.graph.successors(old_verts2[i], _GR_EDGE_TYPE.ENTITY)[0];
                    const new_posi: string = this._copyPosi(posis_map, ents_map, old_posi, vec);
                    this.graph.addEdge(new_verts2[i], new_posi, _GR_EDGE_TYPE.ENTITY);
                    // set in verts map
                    verts_map.set(old_verts2[i], new_verts2[i]);
                }
                this.graph.addEdge(new_edge, new_verts2[i], _GR_EDGE_TYPE.ENTITY);
            }
        }
        // deal with first vert edge order
        // if this is a closed loop, the first two edges will be in wrong order
        const first_vert: string = verts_map.get(verts_map.keys[0]);
        const edges2: string[] = this.graph.predecessors(first_vert, _GR_EDGE_TYPE.ENTITY);
        if (edges2.length === 2) {
            this.graph.setPredessors(first_vert, [edges2[1], edges2[0]], _GR_EDGE_TYPE.ENTITY);
        }
        // return the verts map for pgon triangulation
        return verts_map;
    }
    /*
    private _copyPosis(posis_map: Map<string, string>, posis: string[], vec?: Txyz): string[] {
        return posis.map( posi => this._copyPosi(posis_map, posi, vec) );
    }
    private _copyPline(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_pline: string, vec?: Txyz): string {
        const old_posis: string[] = this.getEntPosis(old_pline) as string[];
        const new_posis: string[] = this._copyPosis(posis_map, old_posis, vec);
        const new_pline: string = this.addPline(new_posis);
        for (const sub_ent_type of [ENT_TYPE.PLINE,ENT_TYPE.EDGE,ENT_TYPE.VERT]) {
            const old_ents: string[] = this.getEnts(sub_ent_type, old_pline);
            const new_ents: string[] = this.getEnts(sub_ent_type, new_pline);
            this._copyAddEnts(ents_map.get(sub_ent_type), old_ents, new_ents);
        }
        return new_pline;
    }
    private _copyPgon(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_pgon: string, vec?: Txyz): string {
        const old_posis: string[][] = this.getEntPosis(old_pgon) as string[][];
        const new_posis: string[][] = [];
        for (let i = 0; i < old_posis.length; i++) {
            new_posis.push(this._copyPosis(posis_map, old_posis[i], vec));
        }
        // CONSIDER this requires pgon to be triangulated again
        // we could copy triangulation from previous pgon, might improve performance 
        const new_pgon: string = this.addPgon(new_posis);
        for (const sub_ent_type of [ENT_TYPE.PGON,ENT_TYPE.WIRE,ENT_TYPE.EDGE,ENT_TYPE.VERT]) {
            const old_ents: string[] = this.getEnts(sub_ent_type, old_pgon);
            const new_ents: string[] = this.getEnts(sub_ent_type, new_pgon);
            this._copyAddEnts(ents_map.get(sub_ent_type), old_ents, new_ents);
        }
        return new_pgon;
    }
    private _copyAddEnts(ents: {old: string[], new: string[]}, 
            old_ents: string[], new_ents: string[]): void {
        if (old_ents.length  !== new_ents.length) {
            throw new Error('Error copying ents: nunmber of sub-ents do not match');
        }
        old_ents.forEach( ent => ents.old.push(ent) );
        new_ents.forEach( ent => ents.new.push(ent) );
    }
    */
    private _copyColl(posis_map: Map<string, string>,
            ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>, 
            old_coll: string, vec?: Txyz): string {
        const new_coll: string = this.addColl();
        // this._copyAddEnts(ents_map.get(ENT_TYPE.COLL), [old_coll], [new_coll]);
        ents_map.get(ENT_TYPE.COLL).old.push(old_coll);
        ents_map.get(ENT_TYPE.COLL).new.push(new_coll);
        const coll_ents: string[] = [];
        for (const old_point of this.getEnts(ENT_TYPE.POINT, old_coll)) {
            coll_ents.push( this._copyPoint(posis_map, ents_map, old_point, vec) );
        }
        for (const old_pline of this.getEnts(ENT_TYPE.PLINE, old_coll)) {
            coll_ents.push( this._copyPline2(posis_map, ents_map, old_pline, vec) );
        }
        for (const old_pgon of this.getEnts(ENT_TYPE.PGON, old_coll)) {
            coll_ents.push( this._copyPgon2(posis_map, ents_map, old_pgon, vec) );
        }
        for (const old_coll_succ of this.getEnts(ENT_TYPE.COLL_SUCC, old_coll)) {
            coll_ents.push( this._copyColl(posis_map, ents_map, old_coll_succ) ); // recursive
        }
        coll_ents.forEach( ent => this.addCollEnt(new_coll, ent) );
        return new_coll;
    }
    private _copyTransferAttribs(ents_map: Map<ENT_TYPE, {old: string[], new: string[]}>) {
        for (const [ent_type, ents] of ents_map.entries()) {
            if (ents.old.length !== ents.new.length) {
                throw new Error('Error transferring attributes: Number of entities does not match.');
            }
            for (const att_name of this.getAttribs(ent_type)) {
                if (att_name === 'xyz') { continue; }
                const att: string = this._graphAttribNodeName(ent_type, att_name);
                for (let i = 0; i < ents.old.length; i++) {
                    const att_val_node: string = this.graph.successors(ents.old[i], att)[0];
                    if (att_val_node !== undefined) {
                        this.graph.addEdge(ents.new[i], att_val_node, att);
                    }
                }
            }
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Make a clone of an list of entities and delete the originals. For objects, the positions are
     * also cloned. 
     * @param ents A list of IDs of entitities to be cloned.
     * @returns A list of IDs of the cloned entities.
     */
     public cloneEnts(ents: string[]): string[] {
        const clones: string[] = this.copyEnts(ents);
        this.delEnts(ents);
        return clones;
    }
    // =============================================================================================
    // COLLECTIONS 
    // =============================================================================================
     /**
     * Add a new empty collection to the model.
     * @returns The ID of the collection.
     */
    public addColl(): string {
        return this._graphAddEnt(ENT_TYPE.COLL);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an entity to an existing collection in the model.
     * Collections can contain points, polylines, polygons, and other collections.
     * Collections cannot contain positions, vertices, edges or wires.
     * TODO Raise error for deleted ents ???
     * @param coll The ID of the collection to which the entity will be added.
     * @param ent The ID of the entity to be added to the collection.
     */
    public addCollEnt(coll: string, ent: string): void {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        if (!_COLL_ENT_TYPES.has(ent_type)) {
            throw new Error('Invalid entitiy for collections.');
        }
        this.graph.addEdge(coll, ent, _GR_EDGE_TYPE.ENTITY);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Remove an entity from an existing collection in the model.
     * Collections can contain points, polylines, polygons, and other collections.
     * If the entity is not in the collection, no error is thrown.
     * TODO Test
     * @param coll The ID of the collection from which the entity will be removed.
     * @param ent The ID of the entity to be removed from the collection.
     */
    public remCollEnt(coll: string, ent: string): void {
        this.graph.delEdge(coll, ent, _GR_EDGE_TYPE.ENTITY);
    }
    // =============================================================================================
    // ENTITY ATTRIBUTES
    // =============================================================================================
    /**
     * Create a new attribute in the model, specifying the entity type, the attribute name, and
     * the data type. Note that for each entity type, the attribute name must be a unique name.
     * @param ent_type The entity type for the attribute. (See ENT_TYPE)
     * @param att_name The name of the attribute to create. 
     * @param att_data_type The data type for the attribute values. (See DATA_TYPE)
     */
    public addAttrib(ent_type: ENT_TYPE, att_name: string, att_data_type: DATA_TYPE): void {
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        if (!this.graph.hasNode(att)) {
            this._graphAddAttrib(ent_type, att_name, att_data_type);
        } else if ( this.graph.getNodeProp(att, 'data_type') !== att_data_type) {
            throw new Error('Attribute already exists with different data type');
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Returns true if an attribute exists with the specified entity type and name.
     * @param ent_type The entity type for getting attributes. (See ENT_TYPE)
     * @param att_name The name of the attribute. 
     * @returns True is the attribute exists, false otherwise.
     */
    public hasAttrib(ent_type: ENT_TYPE, att_name: string): boolean { 
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        return this.graph.hasNode(att);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a list of attribute names in the model, specifying the entity type.
     * @param ent_type  The entity type for getting attributes. (See ENT_TYPE)
     * @returns A list of attrib names.
     */
    public getAttribs(ent_type: ENT_TYPE): string[]  {
        return this.graph.successors(_GR_ATTRIB_NODE.get(ent_type), _GR_EDGE_TYPE.META)
            .map( att => this.graph.getNodeProp(att, 'name') );
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set the value of an attribute, specifying the entity in the model, the attribute name and the
     * attribute value. Note that an attribute with the specified name must already exist in the
     * model. If the attribute does not exist, an exception will be thrown. In addition, the
     * attribute value and the data type for the attribute must match.
     * TODO Raise error for deleted ents ???
     * @param ent The ID of the entity.
     * @param att_name The name of the attribute.
     * @param att_value The attribute value to set.
     */
    public setAttribVal(ent: string, att_name: string, att_value: TAttribDataTypes): void {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        if (ent_type !== this.graph.getNodeProp(att, 'ent_type')) {
            throw new Error('Entity and attribute have different types.');
        }
        const data_type: DATA_TYPE = this._check_type(att_value);
        if (data_type !== this.graph.getNodeProp(att, 'data_type')) {
            throw new Error('Attribute value "' + att_value + '" has the wrong data type. ' + 
            'The data type is a "' + data_type + '". ' + 
            'The data type should be a "' + this.graph.getNodeProp(att, 'data_type') + '".' );
        }
        // get the name of the attribute value node
        const att_val_node: string = this._graphAttribValNodeName(att_value);
        // make sure that no node with the name already exists
        if (!this.graph.hasNode(att_val_node)) {
            // add the attrib value node
            this.graph.addNode(att_val_node);
            this.graph.setNodeProp(att_val_node, 'value', att_value);
        }
        // add an edge from the att_val_node to the attrib: att_val -> att
        this.graph.addEdge(att_val_node, att, _GR_EDGE_TYPE.ATTRIB);
        // add and edge from the ent to the att_val_node
        this.graph.delEdge(ent, null, att);
        // ent -> att_val, ent <- att_val
        this.graph.addEdge(ent, att_val_node, att); 
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get an attribute value from an entity in the model, specifying the attribute name.
     * If the entity has no value for that attribute, then `undefined` is returned.
     * TODO Raise error for deleted ents ???
     * @param ent  The ID of the entity for which to get the attribute value.
     * @param att_name  The name of the attribute.
     * @returns The attribute value or `undefined` if no value.
     */
    public getAttribVal(ent: string, att_name: string): TAttribDataTypes {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        const att_vals: string[] = this.graph.successors(ent, att);
        if (att_vals.length === 0) {
            return undefined;
        }
        return this.graph.getNodeProp(att_vals[0], 'value');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Delete an attribute value from an entity in the model, specifying the attribute name.
     * TODO Raise error for deleted ents ???
     * @param ent  The ID of the entity for which to get the attribute value.
     * @param att_name The name of the attribute to delete.
     */
     public delAttribVal(ent: string, att_name: string): void {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        const att_vals: string[] = this.graph.successors(ent, att);
        if (att_vals.length === 0) {
            return;
        }
        this.graph.delEdge(ent, att_vals[0], att);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a list of all the attribute values for the specified attribute.
     * @param ent_type The entity type for getting attributes. (See ENT_TYPE)
     * @param att_name The name of the attribute.
     * @returns A list of all attribute values.
     */
    public getAttribVals(ent_type: ENT_TYPE, att_name: string): TAttribDataTypes[] {
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        const att_vals: string[] = this.graph.predecessors(att, _GR_EDGE_TYPE.ATTRIB);
        const values: TAttribDataTypes[] = [];
        for (const att_val of att_vals) {
            values.push(this.graph.getNodeProp(att_val, 'value'));
        }
        return values;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get an attribute datatype, specifying the attribute entity type and attribute name.
     * @param ent_type The entity type for getting attributes. (See ENT_TYPE)
     * @param att_name The name of the attribute.
     * @returns The attribute value or null if no value.
     */
    public getAttribDatatype(ent_type: ENT_TYPE, att_name: string): string {
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        return this.graph.getNodeProp(att, 'data_type');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Rename an attribute.
     * TODO test
     * @param ent_type The entity type for the attribute.
     * @param att_name The existing name of the attribute.
     * @param new_name The new name of the attribute.
     */
     public renameAttrib(ent_type: ENT_TYPE, att_name: string, new_name: string): void {
        const old_att: string = this._graphAttribNodeName(ent_type, att_name);
        const att_data_type: DATA_TYPE = this.graph.getNodeProp(old_att, 'data_type');
        const new_att: string = this._graphAddAttrib(ent_type, new_name, att_data_type);
        for (const pred of this.graph.predecessors(old_att, _GR_EDGE_TYPE.ATTRIB)) {
            this.graph.delEdge(pred, old_att, _GR_EDGE_TYPE.ATTRIB);
            this.graph.addEdge(pred, new_att, _GR_EDGE_TYPE.ATTRIB);
        }
    }
    // =============================================================================================
    // MODEL ATTRIBUTES
    // =============================================================================================
    /**
     * Returns true if a model attribute exists with the specified name.
     * @param att_name  The name of the attribute. 
     * @returns True is the attribute exists, false otherwise.
     */
    public hasModelAttrib(att_name: string): boolean {
        return this.model_attribs.has(att_name);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set an attribute value from the model, specifying a name and value. Model attributes are top
     * level attributes that apply to the whole model. As such, they are not attached to any
     * specific entities.
     * @param att_name The name of the attribute.
     * @param att_value The attribute value to set.
     */
    public setModelAttribVal(att_name: string, att_value: any): void {
        this.model_attribs.set(att_name, att_value);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get an attribute value from the model, specifying a name. Model attributes are top level
     * attributes that apply to the whole model. As such, they are not attached to any specific
     * entities.
     * @param att_name The name of the attribute.
     * @returns The attribute value or null if no value.
     */
    public getModelAttribVal(att_name: string): any {
        return this.model_attribs.get(att_name);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Delete an attribute value from the model.
     * TODO test
     * @param att_name The name of the attribute.
     */
    public delModelAttribVal(att_name: string): void {
        this.model_attribs.delete(att_name);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a list of attribute names from the model. Model attributes are top level attributes that
     * apply to the whole model. As such, they are not attached to any specific entities.
     * @returns 
     */
    public getModelAttribs(): string[] {
        return Array.from(this.model_attribs.keys());
    }
    // =============================================================================================
    // ENTITIES
    // =============================================================================================
    /**
     * Get the number of entities of the specified entity type.  
     * @param ent_type The type of entity to search for in the model.
     * @returns A number of entities of the specified type in the model.
     */
    public numEnts(ent_type: ENT_TYPE): number {
        return this.graph.degreeOut(
            _GR_ENT_NODE.get(ent_type), 
            _GR_EDGE_TYPE.META
        )
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get entities of a specific type. A list of entity IDs is returned. If source_ents is null,
     * then all entities of the specified type in the model are returned. If there are no entities
     * of that type in the model, then an empty list is returned. If source_ents contains a list of
     * entities, then entities will be extracted from the source ents. For example, if ent_type is
     * 'posis' and 'source_ents' is a polyline and a polygon, then a list containing the positions
     * used in the polyline and polygon are returned. Similarly, if ent_type is 'pgons' and
     * 'source_ents' is a list of positions, then a list of polygons is returned, of polygons that
     * make use of the specified positions.
     * TODO Raise error for deleted ents ???
     * @param target_ent_type The type of entity to get from the model.
     * @param source_ents null, or a single entity ID or a list of entity IDs from which to get the
     * target entities.
     * @returns A list of entity IDs (no duplicates).
     */
    public getEnts(target_ent_type: ENT_TYPE, source_ents: string|string[] = null): string[] {
        // get all ents
        if (source_ents === null) {
            return this.graph.successors(
                _GR_ENT_NODE.get(target_ent_type), 
                _GR_EDGE_TYPE.META
            );
        }
        // get ents from one ent
        if (!Array.isArray(source_ents)) {
            return this._nav(target_ent_type, source_ents);
        }
        // get ents from a list of ents
        const ents_set: Set<string> = new Set();
        for (const source_ent of source_ents) {
            for (const target_ent of this._nav(target_ent_type, source_ent)) {
                ents_set.add(target_ent);
            }
        }
        return Array.from(ents_set);
    }
    private _getEntSeq(target_ent_type: ENT_TYPE, source_ent_type: ENT_TYPE): TEntSeq {
        if (target_ent_type === ENT_TYPE.TRI || source_ent_type === ENT_TYPE.TRI) {
            return _ENT_SEQ_CO_PG_TRI_PO;
        } else if (target_ent_type === ENT_TYPE.POINT || source_ent_type === ENT_TYPE.POINT) {
            return _ENT_SEQ_CO_PT_PO;
        } else if (target_ent_type === ENT_TYPE.PLINE || source_ent_type === ENT_TYPE.PLINE) {
            return _ENT_SEQ_CO_PL_PO;
        } else if (target_ent_type === ENT_TYPE.PGON || source_ent_type === ENT_TYPE.PGON) {
            return _ENT_SEQ_CO_PG_PO;
        }
        return _ENT_SEQ
    }
    private _nav(target_ent_type: ENT_TYPE, source_ent: string): string[] {
        if (target_ent_type === ENT_TYPE.COLL_SUCC || target_ent_type === ENT_TYPE.COLL_PRED) {
            return this._navColls(target_ent_type, source_ent);
        }
        const source_ent_type: ENT_TYPE = this.graph.getNodeProp(source_ent, 'ent_type');
        // zero step navigation
        if (source_ent_type === target_ent_type) {
            return [source_ent];
        }
        // get navigation distance, positive = down, ngative = up
        const ent_seq: TEntSeq = this._getEntSeq(target_ent_type, source_ent_type);
        const dist: number = ent_seq.get(source_ent_type).idx - ent_seq.get(target_ent_type).idx;
        if (isNaN(dist)) { throw new Error('Error getting ents: dist is NaN'); }
        // single step navigation
        if (dist === 1 || dist === -1) {
            const nav_ents: string[] = this._nav1(ent_seq, target_ent_type, source_ent, dist);
            console.log(">>single> result nav1", nav_ents)
            if (nav_ents.length > 0) {
                const nav_ent_type: ENT_TYPE = this.graph.getNodeProp(nav_ents[0], 'ent_type');
                if (nav_ent_type === target_ent_type) {
                    return nav_ents;
                }
            }
            return [];
        }
        // multi step navigation
        let ents: string[] = [source_ent];
        const result_set: Set<string> = new Set();
        let ents_set: Set<string>;
        while (ents.length > 0) {
            // ents_set.clear(); // avoid garbage collection
            ents_set = new Set();
            for (const ent of ents) {
                const nav_ents: string[] = this._nav1(ent_seq, target_ent_type, ent, dist);
                for (const nav_ent of nav_ents) {
                    const nav_ent_type: ENT_TYPE = this.graph.getNodeProp(nav_ent, 'ent_type');
                    if (nav_ent_type === target_ent_type) {
                        result_set.add(nav_ent);
                        if (target_ent_type === ENT_TYPE.COLL) {
                            ents_set.add(nav_ent);
                        }
                    } else if (ent_seq.has(nav_ent_type)) {
                        if (dist > 0 && ent_seq.get(nav_ent_type).idx > ent_seq.get(target_ent_type).idx) {
                            ents_set.add(nav_ent);
                        } else if (dist < 0 && ent_seq.get(nav_ent_type).idx < ent_seq.get(target_ent_type).idx) {
                            ents_set.add(nav_ent); 
                        }
                    }
                }
            }
            ents = Array.from(ents_set);
        }
        return Array.from(result_set)
    }
    private _nav1(ent_seq:TEntSeq, target_ent_type: ENT_TYPE, source_ent: string, dist: number): string[] {
        const source_ent_type: ENT_TYPE = this.graph.getNodeProp(source_ent, 'ent_type') as ENT_TYPE;
        return dist > 0 ?
            this.graph.successors(source_ent, ent_seq.get(source_ent_type).succ):
            this.graph.predecessors(source_ent, ent_seq.get(source_ent_type).pred);
    }
    private _navColls(target_ent_type: ENT_TYPE, source_ent: string): string[] {
        const source_ent_type: ENT_TYPE = this.graph.getNodeProp(source_ent, 'ent_type');
        if (source_ent_type !== ENT_TYPE.COLL) {
            throw new Error('Source entity must be a collection.');
        }
        let ents: string[] = [source_ent];
        const result_set: Set<string> = new Set();
        let colls_set: Set<string>;
        while (ents.length > 0) {
            // colls_set.clear(); // avoid garbage collection
            colls_set = new Set();
            for (const ent of ents) {
                const nav_ents: string[] = target_ent_type === ENT_TYPE.COLL_SUCC ? 
                    this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY) : 
                    this.graph.predecessors(ent, _GR_EDGE_TYPE.ENTITY);
                for (const nav_ent of nav_ents) {
                    const nav_ent_type: ENT_TYPE = this.graph.getNodeProp(nav_ent, 'ent_type');
                    if (nav_ent_type === ENT_TYPE.COLL) {
                        result_set.add(nav_ent);
                        colls_set.add(nav_ent);
                    }
                }
            }
            ents = Array.from(colls_set);
        }
        return Array.from(result_set)
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * 
     * @param ents 
     * @returns 
     */
    public getEntSets(ents: string|string[]): TEntSets {
        const ent_sets: Map<ENT_TYPE, Set<string>> = new Map([
            [ENT_TYPE.POSI, new Set()],
            [ENT_TYPE.POINT, new Set()],
            [ENT_TYPE.PLINE, new Set()],
            [ENT_TYPE.PGON, new Set()],
            [ENT_TYPE.COLL, new Set()]
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
                for (const obj_type of _OBJ_ENT_TYPES) {
                    for (const obj of this.getEnts(obj_type, ent)) {
                        ent_sets.get(obj_type).add(obj);
                    }
                }
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
    public invertEntSets(ent_sets: TEntSets): void {
        // object posis
        for (const obj_type of _OBJ_ENT_TYPES) {
            for (const obj of ent_sets.get(obj_type)) {
                for (const posi of this.getEnts(ENT_TYPE.POSI, obj)) {
                    ent_sets.get(ENT_TYPE.POSI).add(posi);
                }
            }
        }
        // invert
        for (const ent_type of ent_sets.keys()) {
            const ents: string[] = this.getEnts(ent_type);
            const inverted: Set<string> = new Set();
            const keep_set: Set<string> = ent_sets.get(ent_type);
            for (const ent of ents) {
                if (!keep_set.has(ent)) {
                    inverted.add(ent);
                }
            }
            ent_sets.set(ent_type, inverted);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get sub ents of os a set of entites. The sub ents will include all the ents that are under
     * the input ents, in the entity hierarchy. For example, if a polygon is passed in, then the
     * sub ents will include the positions, vertices, edges, wires of that polygon. If a collection 
     * if passed in, then the sub ents will inlude any points, polylines, polygons, and child 
     * collections, as well as all thier respective sub entities. The lists of entities that are 
     * returned will not have any duplicates. (They are sets.)
     * TODO Raise error for deleted ents ???
     * @param ents A list of entity IDs from which to get sub-entities.
     * @returns Entity sets.
     */
     public getSubEnts(ents: string|string[]): TEntSets {
        const ent_sets: Map<ENT_TYPE, Set<string>> = new Map([
            [ENT_TYPE.POSI, new Set()],
            [ENT_TYPE.VERT, new Set()],
            [ENT_TYPE.EDGE, new Set()],
            [ENT_TYPE.WIRE, new Set()],
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
                this._getPointSubEnts(ent, ent_sets);
            } else if (ent_type === ENT_TYPE.PLINE) {
                this._getPlineSubEnts(ent, ent_sets);
            } else if (ent_type === ENT_TYPE.PGON) {
                this._getPgonSubEnts(ent, ent_sets);
            } else if (ent_type === ENT_TYPE.COLL) {
                ent_sets.get(ENT_TYPE.COLL).add(ent);
                for (const point of this.getEnts(ENT_TYPE.POINT, ent)) {
                    this._getPointSubEnts(point, ent_sets);
                }
                for (const pline of this.getEnts(ENT_TYPE.PLINE, ent)) {
                    this._getPlineSubEnts(pline, ent_sets);
                }
                for (const pgon of this.getEnts(ENT_TYPE.PGON, ent)) {
                    this._getPgonSubEnts(pgon, ent_sets);
                }
                for (const child_coll of this.getEnts(ENT_TYPE.COLL, ent)) {
                    ent_sets.get(ENT_TYPE.COLL).add(child_coll);
                }
            } else {
                throw new Error('Entity type not supported: ' + ent_type);
            }
        }
        return ent_sets;
    }
    private _getPointSubEnts(point: string, ent_sets: Map<ENT_TYPE, Set<string>>): void {
        ent_sets.get(ENT_TYPE.POINT).add(point);
        ent_sets.get(ENT_TYPE.POSI).add(this.getEnts(ENT_TYPE.POSI, point)[0]);
    }
    private _getPlineSubEnts(pline: string, ent_sets: Map<ENT_TYPE, Set<string>>): void {
        ent_sets.get(ENT_TYPE.PLINE).add(pline);
        this.getEnts(ENT_TYPE.EDGE, pline).map(edge => ent_sets.get(ENT_TYPE.EDGE).add(edge));
        for (const vert of this.getEnts(ENT_TYPE.VERT, pline)) {
            ent_sets.get(ENT_TYPE.VERT).add(vert);
            ent_sets.get(ENT_TYPE.POSI).add(this.getEnts(ENT_TYPE.POSI, vert)[0]);
        }
    }
    private _getPgonSubEnts(pgon: string, ent_sets: Map<ENT_TYPE, Set<string>>): void {
        ent_sets.get(ENT_TYPE.PGON).add(pgon);
        const wires = this.getEnts(ENT_TYPE.WIRE, pgon);
        for (const wire of wires) {
            ent_sets.get(ENT_TYPE.WIRE).add(wire);
            this.getEnts(ENT_TYPE.EDGE, wire).map(edge => ent_sets.get(ENT_TYPE.EDGE).add(edge));
            for (const vert of this.getEnts(ENT_TYPE.VERT, wire)) {
                ent_sets.get(ENT_TYPE.VERT).add(vert);
                ent_sets.get(ENT_TYPE.POSI).add(this.getEnts(ENT_TYPE.POSI, vert)[0]);
            }
        }
    }
    // ---------------------------------------------------------------------------------------------
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
        const ent_sets: TEntSets = this.getEntSets(ents);
        if (invert) { this.invertEntSets(ent_sets); }
        // delete collctions and objects
        for (const coll of ent_sets.get(ENT_TYPE.COLL)) {
            this.del.delColl(coll);
        }
        for (const pgon of ent_sets.get(ENT_TYPE.PGON)) {
            this.del.delPgon(pgon);
        }
        for (const pline of ent_sets.get(ENT_TYPE.PLINE)) {
            this.del.delPline(pline);
        }
        for (const point of ent_sets.get(ENT_TYPE.POINT)) {
            this.del.delPoint(point);
        }
        // delete positions
        this.del.delPosis(Array.from(ent_sets.get(ENT_TYPE.POSI)));
    }
    // =============================================================================================
    // POSITIONS
    // =============================================================================================
    /**
     * Get a position ID or list the position IDs for an entity. If the entity is a point, vertex,
     * or position, then a single position is returned. If the entity is a polyline, a list of
     * positions will be returned. For a closed polyline, the first and last positions will be the
     * same. If the entity is a polygon, a nested list of positions is returned. If the entity is a
     * collection, ... not mplemented
     * TODO Raise error for deleted ents ???
     * @param ent An entity ID from which to get the position.
     * @returns A list of position IDs. 
     */
     public getEntPosis(ent: string): string|string[]|string[][] {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        if ( ent_type === ENT_TYPE.POSI ) {
            return ent;
        } else if ( ent_type === ENT_TYPE.VERT) {
            return this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY)[0];
        } else if ( ent_type === ENT_TYPE.EDGE ) {
            const verts: string[] = this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY);
            return verts.map(vert => this.graph.successors(vert, _GR_EDGE_TYPE.ENTITY)[0]);
        } else if ( ent_type === ENT_TYPE.WIRE) {
            const edges: string[] = this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY)
            return this._getEdgeSeqPosis(edges, false);
        } else if ( ent_type === ENT_TYPE.POINT ) {
            return this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY)[0];
        } else if ( ent_type === ENT_TYPE.PLINE ) {
            const edges: string[] = this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY)
            return this._getEdgeSeqPosis(edges, true);
        } else if ( ent_type === ENT_TYPE.PGON ) {
            const posis: string[][] = [];
            for (const wire of this.graph.successors(ent, _GR_EDGE_TYPE.ENTITY)) {
                const edges: string[] = this.graph.successors(wire, _GR_EDGE_TYPE.ENTITY);
                posis.push(this._getEdgeSeqPosis(edges, false));
            }
            return posis;
        } else if ( ent_type === ENT_TYPE.COLL ) {
            throw new Error('Not implemented'); // TODO
        }
    }
    private _getEdgeSeqPosis(edges: string[], add_last: boolean): string[] {
        const verts: string[] = edges.map( 
            edge => this.graph.successors(edge, _GR_EDGE_TYPE.ENTITY)[0]);
        const posis: string[] = verts.map( 
            vert => this.graph.successors(vert, _GR_EDGE_TYPE.ENTITY)[0]);
        if (add_last) {
            const last_vert: string = this.graph.successors(edges[edges.length - 1], _GR_EDGE_TYPE.ENTITY)[1];
            const last_posi: string = this.graph.successors(last_vert, _GR_EDGE_TYPE.ENTITY)[0];
            posis.push(last_posi);
        }
        return posis;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the XYZ coordinates of a position.
     * TODO Raise error for deleted ents ???
     * @param posi A position ID.
     * @returns The XYZ coordinates.
     */
    public getPosiCoords(posi: string): Txyz { 
        const att_val: string = this.graph.successors(posi, _GR_XYZ_NODE)[0];
        return this.graph.getNodeProp(att_val, 'value');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the XYZ coordinates of a vertex.
     * TODO Raise error for deleted ents ???
     * @param vert A position ID.
     * @returns The XYZ coordinates.
     */
     public getVertCoords(vert: string): Txyz { 
        const posi: string = this.graph.successors(vert, _GR_EDGE_TYPE.ENTITY)[0];
        return this.getPosiCoords(posi);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set the XYZ coordinates of a position.
     * For positions, the connected entities will be deleted.
     * For collections, the contents of the collection will not be deleted.
     * TODO test
     * TODO Raise error for deleted ents ???
     * @param posi The ID of the position.
     * @param xyz A list of three numbers, the XYZ coordinates.
     */
    public setPosiCoords(posi: string, xyz: Txyz): string {
        // get the name of the attribute value node
        const att_val_node: string = this._graphAttribValNodeName(xyz);
        // make sure that no node with the name already exists
        if (!this.graph.hasNode(att_val_node)) {
            // add the attrib value node
            this.graph.addNode(att_val_node);
            this.graph.setNodeProp(att_val_node, 'value', xyz);
        }
        // add an edge from the att_val_node to the attrib; att_val -> att
        this.graph.addEdge(att_val_node, _GR_XYZ_NODE, _GR_EDGE_TYPE.ATTRIB);
        // add and edge from the ent to the att_val_node: ent -> att_val, ent <- att_val
        this.graph.delEdge(posi, null, _GR_XYZ_NODE);
        this.graph.addEdge(posi, att_val_node, _GR_XYZ_NODE); 
        // return att_val_node
        return att_val_node;
    }
    // =============================================================================================
    // QUERY
    // =============================================================================================
    /**
     * Return true if teh entity exists in teh current snapshot.
     * @param ent An entity ID.
     * @returns True if it exists, false otherwise.
     */
     public entExists(ent: string): boolean { 
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        return this.graph.hasEdge(_GR_ENT_NODE.get(ent_type), ent, _GR_EDGE_TYPE.META);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Return the entity type of an entity in the model
     * TODO Raise error for deleted ents ???
     * @param ent An entity ID.
     * @returns The entity type (see ENT_TYPE).
     */
    public entType(ent: string): ENT_TYPE { 
        return this.graph.getNodeProp(ent, 'ent_type');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Return the object entity type of a vertex in the model. 
     * Object types can be for a polyline, a polygn border, or a polygon hole.
     * TODO Raise error for deleted ents ???
     * @param ent An vertex ID.
     * @returns The object entity type of the vertex (see OBJ_TYPE).
     */
    public vertObjType(ent: string): VERT_TYPE { 
        return this.graph.getNodeProp(ent, 'vert_type');
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Find entities in the model that satisy the query condition.
     * @param ent_type The entity type for getting attributes. (See ENT_TYPE)
     * @param att_name The name of the attribute. 
     * @param comparator The operator to use to compare values ('==', '!=', '<', '<=', '>', '>='). 
     * (See COMPARATOR)
     * @param att_val The value of the attribute. 
     * @returns A list of entities.
     */
    public query(ent_type: ENT_TYPE, att_name: string, comparator: COMPARATOR, att_val: TAttribDataTypes) {
        //if attrib does not exist, throw error
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        if (!this.graph.hasNode(att)) {
            throw new Error("The attribute does not exist: '" + att_name + "'.");
        }
        // val === null
        if (comparator === COMPARATOR.IS_EQUAL && att_val === null) {
            const set_with_val: Set<string> = new Set(this.graph.getNodesWithOutEdge(att));
            const set_all: Set<string> = new Set(
                this.graph.successors(_GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META));
            return Array.from(set_all).filter(item => !set_with_val.has(item));
        }
        // val !== null
        if (comparator === COMPARATOR.IS_NOT_EQUAL && att_val === null) {
            return this.graph.getNodesWithOutEdge(att);
        }
        // val === att_val
        if (comparator === COMPARATOR.IS_EQUAL) {
            const att_val_node: string = this._graphAttribValNodeName(att_val);
            if (!this.graph.hasNode(att_val_node)) {
                return [];
            }
            return this.graph.predecessors(att_val_node, att);
        }
        // val !== att_val
        if (comparator === '!=') {
            const att_val_node: string = this._graphAttribValNodeName(att_val)
            if (!this.graph.hasNode(att_val_node)) {
                return this.graph.successors(_GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META);
            }
            const ents_equal: string[] = this.graph.predecessors(att_val_node, att);
            if (ents_equal.length === 0) {
                return this.graph.successors(_GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META);
            }
            const set_equal: Set<string> = new Set(ents_equal)
            const set_all: Set<string> = new Set(
                this.graph.successors(_GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META));
            return Array.from(set_all).filter(item => !set_equal.has(item));
        }
        // other cases, data_type must be a number
        const data_type: DATA_TYPE = this.graph.getNodeProp(att, 'data_type');
        if (data_type !== DATA_TYPE.NUM) {
            throw new Error("The '" + comparator +
                "' comparator cannot be used with attributes of type '" + data_type + "'.");
        }
        const result: string[] = [];
        // val < att_val
        if (comparator === COMPARATOR.IS_LESS) {
            for (const ent of this.graph.successors(
                _GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') < att_val) {
                    result.push(ent)
                }
            }
        }
        // val <= att_val
        else if (comparator === COMPARATOR.IS_LESS_OR_EQUAL) {
            for (const ent of this.graph.successors(
                _GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') <= att_val) {
                    result.push(ent);
                }
            }
        }
        // val > att_val
        else if (comparator === COMPARATOR.IS_GREATER) {
            for (const ent of this.graph.successors(
                _GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') > att_val) {
                    result.push(ent);
                }
            }
        }
        // val >= att_val
        else if (comparator === COMPARATOR.IS_GREATER_OR_EQUAL) {
            for (const ent of this.graph.successors(
                _GR_ENT_NODE.get(ent_type), _GR_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') >= att_val) {
                    result.push(ent);
                }
            }
        }
        // return list of entities
        // TODO handle queries sub-entities in lists and dicts
        return result;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Check if a polyline is open or closed.
     * TODO Raise error for deleted ents ???
     * @param pline A polyline ID.
     * @returns True if closed, false if open.
     */
     public isPlineClosed(pline: string): boolean { 
        const edges: string[] = this.graph.successors(pline, _GR_EDGE_TYPE.ENTITY);
        const start_posi: string = this.graph.successors(
            this.graph.successors(edges[0], _GR_EDGE_TYPE.ENTITY)[0], _GR_EDGE_TYPE.ENTITY)[0];
        const end_posi: string = this.graph.successors(
            this.graph.successors(edges[edges.length - 1], _GR_EDGE_TYPE.ENTITY)[1], _GR_EDGE_TYPE.ENTITY)[0];
        return start_posi === end_posi;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the next edge
     * TODO Raise error for deleted ents ???
     * TODO test
     * @param edge An edge ID.
     * @returns The next edge, or null.
     */
    public getNextEdge(edge: string): string { 
        const verts: string[] = this.graph.successors(edge, _GR_EDGE_TYPE.ENTITY);
        const edges: string[] = this.graph.predecessors(verts[1], _GR_EDGE_TYPE.ENTITY);
        if (edges.length === 1) { return null; }
        return edges[1];
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the next edge
     * TODO Raise error for deleted ents ???
     * TODO test
     * @param edge An edge ID.
     * @returns The previous edge, or null.
     */
     public getPrevEdge(edge: string): string { 
        const verts: string[] = this.graph.successors(edge, _GR_EDGE_TYPE.ENTITY);
        const edges: string[] = this.graph.predecessors(verts[0], _GR_EDGE_TYPE.ENTITY);
        if (edges.length === 1) { return null; }
        return edges[0];
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Given a set of edges, get the perimeter entities.
     * TODO Test
     * TODO this can be moved to the functions library
     * @param ent_type
     * @param edges
     */
    public perimeter(ent_type: ENT_TYPE, edges: string[]): string[] {
        const edge_posis_map: Map<string, string[]> = new Map();
        const edge_to_posi_pairs_map: Map<string, [string, string]> = new Map();
        for (const edge of edges) {
            const posi_pair: [string, string] = this.getEnts(ENT_TYPE.POSI, edge) as [string, string];
            if (!edge_posis_map.has(posi_pair[0])) {
                edge_posis_map.set(posi_pair[0], []);
            }
            edge_posis_map.get(posi_pair[0]).push(posi_pair[1]);
            edge_to_posi_pairs_map.set(edge, posi_pair);
        }
        const perimeter_ents: Set<string> = new Set();
        for (const edge of edges) {
            const posi_pair: [string, string] = edge_to_posi_pairs_map.get(edge);
            if (!edge_posis_map.has(posi_pair[1]) || edge_posis_map.get(posi_pair[1]).indexOf(posi_pair[0]) === -1) {
                const found_ents: string[] = this.getEnts(ent_type, edge);
                found_ents.forEach( found_ent => perimeter_ents.add(found_ent) );
            }
        }
        return Array.from(perimeter_ents);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Given a set of vertices, get the welded neighbour entities.
     * TODO test
     * TODO this can be moved to the functions library
     * @param ent_type
     * @param verts
     */
    public vertNeighbors(ent_type: ENT_TYPE, verts: string[]): string[] {
        const neighbour_ents: Set<string> = new Set();
        for (const vert of verts) {
            const posi: string = this.getEntPosis(vert) as string;
            const found_verts: string[] = this.getEnts(ENT_TYPE.VERT, posi);
            for (const found_vert of found_verts) {
                if (verts.indexOf(found_vert) === -1) {
                    const found_ents: string[] = this.getEnts(ent_type, found_vert);
                    found_ents.forEach( found_ent => neighbour_ents.add(found_ent) );
                }
            }
        }
        return Array.from(neighbour_ents);
    }
    // =============================================================================================
    // SNAPSHOTS 
    // =============================================================================================
    /**
     * Get the active snapshot.
     * @returns The ID of teh currently active snapshot.
     */
     public getActiveSnapshot(): number { 
        return this.graph.getActiveSnapshot();
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set the active snapshot.
     * @returns The ID of the currently active snapshot.
     */
     public setActiveSnapshot(ssid: number): void { 
        return this.graph.setActiveSnapshot(ssid);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Start a new snapshot of the edges .
     * If `ssid` is null, the the new snapshot will be empty.
     * @param ssid: A snapshot ID to intialise the new snapshot.
     * @returns An integer, the ssid of the new snapshot.
     */
     public newSnapshot(ssid: number = null): number { 
        return this.graph.newSnapshot(ssid);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Copy a set of edges from another snapshot into the current active snapshot.
     * @param edge_type The type of edges to copy.
     * @param ssid The snapshot ID to copy from.
     * @param x2x The relationship between nodes, for clash detection.
     */
    public snapshotCopyEdges(edge_type: string, ssid: number, x2x: X2X = X2X.M2M): void {
        this.graph.snapshotCopyEdges(edge_type, ssid, x2x);
    }
    // =============================================================================================
    // PRIVATE GRAPH METHODS
    // =============================================================================================
    /**
     * Create the name for an attrib node.
     * It will be something like this: '_att_pgons_area'.
     * @param ent_type 
     * @param att_name 
     * @returns 
     */
     private _graphAttribNodeName(ent_type: ENT_TYPE, att_name: string): string {
        return '_att_' + ent_type + att_name;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Create the name for an attrib value node.
     * For example [1,2,3] will become  '1,2,3'.
     * @param att_val 
     * @returns 
     */
     private _graphAttribValNodeName(att_val: TAttribDataTypes): string {
        return '$' + typeof(att_val) === 'object' ? JSON.stringify(att_val) : att_val.toString();
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an entity node to the graph. 
     * The entity can be a posi, vert, edge, wire, point, pline, pgon, coll.
     * The entity node will have a name.
     * The entity_type node wil be connected to the entity node.
     * @param ent_type 
     * @returns 
     */
     private _graphAddEnt(ent_type: ENT_TYPE): string {
        const ent_type_node: string = _GR_ENT_NODE.get(ent_type);
        // create the node name, from prefix and then next count number
        const ent_i: number = this.graph.degreeOut(ent_type_node, _GR_EDGE_TYPE.META);
        const ent: string = ent_type + ent_i;
        // add a node with name `ent`
        this.graph.addNode(ent);
        this.graph.setNodeProp(ent, 'ent_type', ent_type); 
        // create an edge from the `ent_type` to the new ent
        this.graph.addEdge(ent_type_node, ent, _GR_EDGE_TYPE.META);
        // return the name of the new entity node
        return ent;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an attribute node to the graph.
     * Create the node name, from the entity type and attribute name.
     * @param ent_type 
     * @param att_name 
     * @param data_type 
     * @returns 
     */
     private _graphAddAttrib(ent_type: ENT_TYPE, att_name: string, data_type: DATA_TYPE): string {
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        // add the node to the graph
        // the new node has 4 properties
        this.graph.addNode(att);
        this.graph.setNodeProp(att, 'ent_type', ent_type); // the `entity_type` for this attribute, `posi`, `vert`, etc
        this.graph.setNodeProp(att, 'name', att_name); // the name of the attribute
        this.graph.setNodeProp(att, 'data_type', data_type); // the data type of this attribute
        // create an edge from the node `ent_type_attribs` (e.g. posis_attribs) to the new attrib node
        // the edge type is `meta`
        this.graph.addEdge(_GR_ATTRIB_NODE.get(ent_type), att, _GR_EDGE_TYPE.META);
        // create a new edge type for this attrib
        this.graph.addEdgeType(att); // many to one
        // return the name of the new attrib node
        return att;
    }
    // =============================================================================================
    // UTILITY 
    // =============================================================================================
    /**
     * Given a value, return a DATA_TYPE string.
     * @param value 
     * @returns 
     */
     private _check_type(value: any): DATA_TYPE {
        const val_type = typeof(value);
        if (val_type === 'number') {
            return DATA_TYPE.NUM;
        }
        if (val_type === 'string') {
            return DATA_TYPE.STR;
        }
        if (val_type === 'boolean') {
            return DATA_TYPE.BOOL;
        }
        if (Array.isArray(value)) {
            return DATA_TYPE.LIST;
        }
        if (val_type === 'object') {
            return DATA_TYPE.DICT;
        }
        throw new Error('Data type is not recognised:' + value + ' ' + typeof(value));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Creates a human-readable string representation of the graph, for debugging.
     * @returns A string representation of the graph.
     */
    public toString(): string {
        return this.graph.toString();
    }
    // ---------------------------------------------------------------------------------------------
}
// =================================================================================================
// END SIM CLASS
// =================================================================================================