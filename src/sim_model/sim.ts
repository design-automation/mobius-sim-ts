import { Graph, X2X } from './graph';
// -------------------------------------------------------------------------------------------------
// An Enum that defines a set of constants for different entity types. 
// These types are used when adding an attribute to the model.
export enum ENT_TYPE {
    POSIS = 'posis',
    VERTS = 'verts',
    EDGES = 'edges',
    WIRES = 'wires',
    POINTS = 'points',
    PLINES = 'plines',
    PGONS = 'pgons',
    COLLS = 'colls',
    MODEL = 'model'
}
// -------------------------------------------------------------------------------------------------
// An Enum that defines a set of constants for possible data types for attributes. 
// These types are used when adding an attrbute to the model.
export enum DATA_TYPE {
    NUM = 'number',
    STR =  'string',
    BOOL =  'boolean',
    LIST =  'list',
    DICT =  'dict'
}
// -------------------------------------------------------------------------------------------------
// The types of operators that can be used in a filter.
export enum COMPARATOR {
    IS_EQUAL = '==',
    IS_NOT_EQUAL = '!=',
    IS_GREATER_OR_EQUAL = '>=',
    IS_LESS_OR_EQUAL = '<=',
    IS_GREATER = '>',
    IS_LESS = '<'
}
// -------------------------------------------------------------------------------------------------
export type TAttribDataTypes = string | number | boolean | any[] | object;
export type Txyz = [number, number, number];
// -------------------------------------------------------------------------------------------------
enum _GRAPH_EDGE_TYPE {
    ENTITY = 'entity',
    ATTRIB =  'attrib',
    META = 'meta'
}
// -------------------------------------------------------------------------------------------------
// 
const _GRAPH_ENTS_NODE: {[index: string]: string}  = {};
    _GRAPH_ENTS_NODE[ENT_TYPE.POSIS] = '_ents_posis';
    _GRAPH_ENTS_NODE[ENT_TYPE.VERTS] = '_ents_verts';
    _GRAPH_ENTS_NODE[ENT_TYPE.EDGES] = '_ents_edges';
    _GRAPH_ENTS_NODE[ENT_TYPE.WIRES] = '_ents_wires';
    _GRAPH_ENTS_NODE[ENT_TYPE.POINTS] = '_ents_points';
    _GRAPH_ENTS_NODE[ENT_TYPE.PLINES] = '_ents_plines';
    _GRAPH_ENTS_NODE[ENT_TYPE.PGONS] = '_ents_pgons';
    _GRAPH_ENTS_NODE[ENT_TYPE.COLLS] = '_ents_colls';
// -------------------------------------------------------------------------------------------------
// node in the graph that links to all attribs
const _GRAPH_ATTRIBS_NODE: {[index: string]: string} = {};
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.POSIS] = '_atts_posis';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.VERTS] = '_atts_verts';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.EDGES] = '_atts_edges';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.WIRES] = '_atts_wires';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.POINTS] = '_atts_points';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.PLINES] = '_atts_plines';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.PGONS] = '_atts_pgons';
    _GRAPH_ATTRIBS_NODE[ENT_TYPE.COLLS] = '_atts_colls';
// -------------------------------------------------------------------------------------------------
// ENT PREFIX
const _ENT_PREFIX: {[index: string]: string} = {};
    _ENT_PREFIX[ENT_TYPE.POSIS] =  'ps';
    _ENT_PREFIX[ENT_TYPE.VERTS] =  '_v';
    _ENT_PREFIX[ENT_TYPE.EDGES] =  '_e';
    _ENT_PREFIX[ENT_TYPE.WIRES] =  '_w';
    _ENT_PREFIX[ENT_TYPE.POINTS] = 'pt';
    _ENT_PREFIX[ENT_TYPE.PLINES] = 'pl';
    _ENT_PREFIX[ENT_TYPE.PGONS] =  'pg';
    _ENT_PREFIX[ENT_TYPE.COLLS] =  'co';
// -------------------------------------------------------------------------------------------------
// ENT_TYPES FOR COLLECTIONS
const _COLL_ENT_TYPES: string[] = [
    ENT_TYPE.POINTS, 
    ENT_TYPE.PLINES, 
    ENT_TYPE.PGONS, 
    ENT_TYPE.COLLS
]
// -------------------------------------------------------------------------------------------------
// ENT SEQUENCES FOR QUERES
const _ENT_SEQ: {[index: string]: number} = {};
    _ENT_SEQ[ENT_TYPE.POSIS] = 0;
    _ENT_SEQ[ENT_TYPE.VERTS] = 1;
    _ENT_SEQ[ENT_TYPE.EDGES] = 2;
    _ENT_SEQ[ENT_TYPE.WIRES] = 3;
    _ENT_SEQ[ENT_TYPE.POINTS] = 4;
    _ENT_SEQ[ENT_TYPE.PLINES] = 4;
    _ENT_SEQ[ENT_TYPE.PGONS] = 4;
    _ENT_SEQ[ENT_TYPE.COLLS] = 6;
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_COLL_POINT_POSI: {[index: string]: number}  = {};
    _ENT_SEQ_COLL_POINT_POSI[ENT_TYPE.POSIS] = 0;
    _ENT_SEQ_COLL_POINT_POSI[ENT_TYPE.VERTS] = 1;
    _ENT_SEQ_COLL_POINT_POSI[ENT_TYPE.POINTS] = 2;
    _ENT_SEQ_COLL_POINT_POSI[ENT_TYPE.COLLS] = 6;
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_COLL_PLINE_POSI: {[index: string]: number}  = {};
    _ENT_SEQ_COLL_PLINE_POSI[ENT_TYPE.POSIS] = 0;
    _ENT_SEQ_COLL_PLINE_POSI[ENT_TYPE.VERTS] = 1;
    _ENT_SEQ_COLL_PLINE_POSI[ENT_TYPE.EDGES] = 2;
    _ENT_SEQ_COLL_PLINE_POSI[ENT_TYPE.WIRES] = 3;
    _ENT_SEQ_COLL_PLINE_POSI[ENT_TYPE.PLINES] = 4;
    _ENT_SEQ_COLL_PLINE_POSI[ENT_TYPE.COLLS] = 6;
// -------------------------------------------------------------------------------------------------
const _ENT_SEQ_COLL_PGON_POSI: {[index: string]: number}  = {};
    _ENT_SEQ_COLL_PGON_POSI[ENT_TYPE.POSIS] = 0;
    _ENT_SEQ_COLL_PGON_POSI[ENT_TYPE.VERTS] = 1;
    _ENT_SEQ_COLL_PGON_POSI[ENT_TYPE.EDGES] = 2;
    _ENT_SEQ_COLL_PGON_POSI[ENT_TYPE.WIRES] = 3;
    _ENT_SEQ_COLL_PGON_POSI[ENT_TYPE.PGONS] = 4;
    _ENT_SEQ_COLL_PGON_POSI[ENT_TYPE.COLLS] = 6;
// -------------------------------------------------------------------------------------------------
// Sim class
export class Sim {
    private graph: Graph;
    private model_attribs: Map<string, any>;
    // ---------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR
     */
    constructor() {
        // graph
        this.graph = new Graph();
        this.graph.addEdgeType(_GRAPH_EDGE_TYPE.ENTITY, X2X.M2M); // many to many
        this.graph.addEdgeType(_GRAPH_EDGE_TYPE.ATTRIB, X2X.M2O); // many to one
        this.graph.addEdgeType(_GRAPH_EDGE_TYPE.META, X2X.O2M); // one to many
        // create nodes for ents and attribs
        for (const ent_type of 
                [ENT_TYPE.POSIS, ENT_TYPE.VERTS, ENT_TYPE.EDGES, ENT_TYPE.WIRES, 
                ENT_TYPE.POINTS, ENT_TYPE.PLINES, ENT_TYPE.PGONS, ENT_TYPE.COLLS]) {
            this.graph.addNode(_GRAPH_ENTS_NODE[ent_type]);
            this.graph.addNode(_GRAPH_ATTRIBS_NODE[ent_type]);
        }
        // add xyz attrib
        this._graphAddAttrib(ENT_TYPE.POSIS, 'xyz', DATA_TYPE.LIST);
        // add empty model attrbutes map
        this.model_attribs = new Map();
    }
    // =============================================================================================
    // METHODS
    // =============================================================================================
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
        if (val_type === 'object') { // TODO check this
            return DATA_TYPE.DICT;
        }
        throw new Error('Data type is not recognised:' + value + ' ' + typeof(value));
    }
    // =============================================================================================
    // PRIVATE GRAPH METHODS
    // =============================================================================================
    // 
    // The nodes for entities are:
    
    // - ent nodes
    //   - e.g. 'ps01', '_v123'

    // - ent_type nodes 
    //   - e.g. 'posis', 'verts'

    // The nodes for attribs are:

    // - _atts_ent_type nodes 
    //   - e.g.'_atts_pgons'

    // - _att_ent_type_name nodes 
    //   - e.g. '_att_pgons_area'

    // - _att_val nodes 
    //   - e.g. '[1,2,3]'

    // The forward edges are as follows:
    
    // Edges of type 'entity':

    // - ent -> sub_ents 
    //   - e.g. pg0 -> [w0, w1]
    //   - edge_type = 'entity'
    //   - many to many

    // Edges of type 'meta':

    // - ent_type -> ents
    //   - e.g. pgons -> pg0
    //   - edge_type = 'meta'
    //   - one to many

    // - ent_type_attribs -> att_ent_type_name 
    //   - e.g. pgons_attribs -> att_pgons_area) 
    //   - edge_type = 'meta'
    //   - one to many

    // Edges of type 'att':

    // - attrib_val -> att_ent_type_name 
    //   - e.g. val_123 -> att_pgons_area
    //   - edge_type = 'attrib' 
    //   - many to one

    // Edges of with a type specific to the attribute:

    // - ent -> attrib_val 
    //   - pg0 -> val_123
    //   - edge_type = att_ent_type_name e.g. '_att_pgons_area'
    //   - many to one

    // For each forward edge, there is an equivalent reverse edge.

    // 
    // ---------------------------------------------------------------------------------------------
    /**
     * Create the name for an attrib node.
     * It will be something like this: '_att_pgons_area'.
     * @param ent_type 
     * @param att_name 
     * @returns 
     */
     private _graphAttribNodeName(ent_type: ENT_TYPE, att_name: string): string {
        return '_att_' + ent_type + '_' + att_name;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Create the name for an attrib value node.
     * For example [1,2,3] will become  '1,2,3'.
     * @param att_val 
     * @returns 
     */
     private _graphAttribValNodeName(att_val: TAttribDataTypes): string {
        return typeof(att_val) === 'object' ? JSON.stringify(att_val) : att_val.toString();
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
        const ent_type_node: string = _GRAPH_ENTS_NODE[ent_type];
        // create the node name, from prefix and then next count number
        const ent_i: number = this.graph.degreeOut(ent_type_node, _GRAPH_EDGE_TYPE.META);
        const ent: string = _ENT_PREFIX[ent_type] + ent_i;
        // add a node with name `n`
        this.graph.addNode(ent);
        this.graph.setNodeProp(ent, 'ent_type', ent_type); // the type of entity, `posi`, `vert`, etc
        // create an edge from the node `ent_type` to the new node
        // the new edge is given the attribute `meta`
        // this edge is so that later the node can be found
        this.graph.addEdge(ent_type_node, ent, _GRAPH_EDGE_TYPE.META);
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
        this.graph.addEdge(_GRAPH_ATTRIBS_NODE[ent_type], att, _GRAPH_EDGE_TYPE.META);
        // create a new edge type for this attrib
        this.graph.addEdgeType(att, X2X.M2O); // many to one
        // return the name of the new attrib node
        return att;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an attribute value node to the graph.
     * @param att The attribute node name.
     * @param att_val The value of the attribute.
     * @returns 
     */
     private _graphAddAttribVal(att: string, att_val: TAttribDataTypes) {
        // get the name of the attribute value node
        const att_val_node: string|number = this._graphAttribValNodeName(att_val);
        // make sure that no node with the name already exists
        if (!this.graph.hasNode(att_val_node)) {
            // add the attrib value node
            // the new node has 1 property
            this.graph.addNode(att_val_node);
            this.graph.setNodeProp(att_val_node, 'value', att_val);
            // add an edge from the attrib value to the attrib
            this.graph.addEdge(att_val_node, att, _GRAPH_EDGE_TYPE.ATTRIB); // att_val -> att
        }
        // return the name of the attrib value node
        return att_val_node;
    }
    // =============================================================================================
    // ADD METHODS FOR ENTITIES
    // =============================================================================================
    /**
     * Add a position to the model, specifying the XYZ coordinates.
     * @param xyz The XYZ coordinates, a list of three numbers.
     * @returns The ID of the new position.
     */
    public addPosi(xyz: Txyz): string {
        const posi: string = this._graphAddEnt(ENT_TYPE.POSIS);
        this.setAttribVal(posi, "xyz", xyz);
        return posi;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a point object to the model, specifying a single position.
     * @param posi A position ID.
     * @returns The ID of the new point.
     */
    public addPoint(posi: string): string {
        const vert: string = this._graphAddEnt(ENT_TYPE.VERTS);
        const point: string = this._graphAddEnt(ENT_TYPE.POINTS);
        this.graph.addEdge(vert, posi, _GRAPH_EDGE_TYPE.ENTITY);
        this.graph.addEdge(point, vert, _GRAPH_EDGE_TYPE.ENTITY);
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
        const closed: boolean = posis[0] === posis[posis.length - 1];
        // vertices
        const num_verts: number = closed ? posis.length - 1 : posis.length;
        const verts: string[] = [];
        for(let i = 0; i < num_verts; i++) {
            const posi: string = posis[i];
            const vert: string = this._graphAddEnt(ENT_TYPE.VERTS);
            this.graph.addEdge(vert, posi, _GRAPH_EDGE_TYPE.ENTITY);
            verts.push(vert);
        }
        // edges
        const edges: string[] = [];
        for (let i = 0; i < verts.length - 1; i++) {
            const edge: string = this._graphAddEnt(ENT_TYPE.EDGES);
            this.graph.addEdge(edge, verts[i], _GRAPH_EDGE_TYPE.ENTITY);
            this.graph.addEdge(edge, verts[i+1], _GRAPH_EDGE_TYPE.ENTITY);
            edges.push(edge);
        }
        if (closed) {
            const edge: string = this._graphAddEnt(ENT_TYPE.EDGES);
            this.graph.addEdge(edge, verts[verts.length - 1], _GRAPH_EDGE_TYPE.ENTITY);
            this.graph.addEdge(edge, verts[0], _GRAPH_EDGE_TYPE.ENTITY);
            edges.push(edge);
        }
        // wire
        const wire: string = this._graphAddEnt(ENT_TYPE.WIRES);
        for (let i = 0; i < edges.length; i++) {
            this.graph.addEdge(wire, edges[i], _GRAPH_EDGE_TYPE.ENTITY);
        }
        // pline
        const pline: string = this._graphAddEnt(ENT_TYPE.PLINES);
        this.graph.addEdge(pline, wire, _GRAPH_EDGE_TYPE.ENTITY);
        //  return
        return pline;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a polygon object to the model, specifying a list of positions.
     * @param posis A list of position IDs.
     * @returns The ID of the new polygon.
     */
    public addPgon(posis: string[]): string {
        if (posis.length < 3) {
            throw new Error('Too few positions for polygon.');
        }
        // vertices
        const verts: string[] = [];
        for (const posi of posis) {
            const vert: string = this._graphAddEnt(ENT_TYPE.VERTS);
            this.graph.addEdge(vert, posi, _GRAPH_EDGE_TYPE.ENTITY);
            verts.push(vert);
        }
        verts.push(verts[0]);
        // edges
        const edges = [];
        for (let i = 0; i < verts.length - 1; i++) {
            const v0 = verts[i];
            const v1 = verts[i+1];
            const edge = this._graphAddEnt(ENT_TYPE.EDGES);
            this.graph.addEdge(edge, v0, _GRAPH_EDGE_TYPE.ENTITY);
            this.graph.addEdge(edge, v1, _GRAPH_EDGE_TYPE.ENTITY);
            edges.push(edge);
        }
        // wire
        const wire = this._graphAddEnt(ENT_TYPE.WIRES);
        for (let i = 0; i < edges.length; i++) {
            this.graph.addEdge(wire, edges[i], _GRAPH_EDGE_TYPE.ENTITY);
        }
        // pline
        const pgon = this._graphAddEnt(ENT_TYPE.PGONS);
        this.graph.addEdge(pgon, wire, _GRAPH_EDGE_TYPE.ENTITY);
        //  return
        return pgon;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add a new empty collection to the model.
     * @returns The ID of the collection.
     */
    public addColl(): string {
        return this._graphAddEnt(ENT_TYPE.COLLS);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an entity to an existing collection in the model.
     * Collections can contain points, polylines, polygons, and other collections.
     * Collections cannot contain positions, vertices, edges or wires.
     * @param coll The ID of the collection to which the entity will be added.
     * @param ent The ID of the entity to be added to the collection.
     */
    public addCollEnt(coll: string, ent: string): void {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        if (!_COLL_ENT_TYPES.includes(ent_type)) {
            throw new Error('Invalid entitiy for collections.');
        }
        this.graph.addEdge(coll, ent, _GRAPH_EDGE_TYPE.ENTITY);
    }
    // =============================================================================================
    // ATTRIBUTE METHODS
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
        return this.graph.successors(_GRAPH_ATTRIBS_NODE[ent_type], _GRAPH_EDGE_TYPE.META)
            .map( att => this.graph.getNodeProp(att, 'name') );
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set the value of an attribute, specifying the entity in the model, the attribute name and the
     * attribute value. Note that an attribute with the specified name must already exist in the
     * model. If the attribute does not exist, an exception will be thrown. In addition, the
     * attribute value and the data type for the attribute must match.
     * @param ent The ID of the entity.
     * @param att_name The name of the attribute.
     * @param att_value The attribute value to set.
     */
    public setAttribVal(ent: string, att_name: string, att_value: TAttribDataTypes): void {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        // TODO check what happens when teh same value is assigned to different things
        // e.g. 123 is assied to both a posi and a pgon
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        if (ent_type !== this.graph.getNodeProp(att, 'ent_type')) {
            throw new Error('Entity and attribute have different types.');
        }
        const data_type: DATA_TYPE = this._check_type(att_value);
        if (this.graph.getNodeProp(att, 'data_type') !== data_type) {
            throw new Error('Attribute value "' + att_value + '" has the wrong data type. ' + 
            'The data type is a "' + data_type + '". ' + 
            'The data type should be a "' + this.graph.getNodeProp(att, 'data_type') + '".' );
        }
        const att_val: string = this._graphAddAttribVal(att, att_value);
        this.graph.addEdge(ent, att_val, att); // ent -> att_val;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get an attribute value from an entity in the model, specifying the attribute name.
     * @param ent  The ID of the entity for which to get the attribute value.
     * @param att_name  The name of the attribute.
     * @returns The attribute value or null if no value.
     */
    public getAttribVal(ent: string, att_name: string): TAttribDataTypes {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        const att: string = this._graphAttribNodeName(ent_type, att_name);
        const att_vals: string[] = this.graph.successors(ent, att);
        if (att_vals.length === 0) {
            return null;
        }
        return this.graph.getNodeProp(att_vals[0], 'value');
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
        const att_vals: string[] = this.graph.predecessors(att, _GRAPH_EDGE_TYPE.ATTRIB);
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
     * Get a list of attribute names from the model. Model attributes are top level attributes that
     * apply to the whole model. As such, they are not attached to any specific entities.
     * @returns 
     */
    public getModelAttribs(): string[] {
        return Array.from(this.model_attribs.keys());
    }
    // =============================================================================================
    // GET METHODS FOR ENTITIES
    // =============================================================================================
    /**
     * Get a seuqence order, based on teh target and ccource ent types.
     * @param target_ent_type 
     * @param source_ent_type 
     * @returns 
     */
     private _getEntSeq(target_ent_type: ENT_TYPE, source_ent_type: ENT_TYPE): any {
        if (target_ent_type === ENT_TYPE.POINTS || source_ent_type === ENT_TYPE.POINTS) {
            return _ENT_SEQ_COLL_POINT_POSI;
        } else if (target_ent_type === ENT_TYPE.PLINES || source_ent_type === ENT_TYPE.PLINES) {
            return _ENT_SEQ_COLL_PLINE_POSI;
        } else if (target_ent_type === ENT_TYPE.PGONS || source_ent_type === ENT_TYPE.PGONS) {
            return _ENT_SEQ_COLL_PGON_POSI;
        }
        return _ENT_SEQ
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Navigate up and down the entity hierarchy.
     * @param target_ent_type 
     * @param source_ent 
     * @returns 
     */
    // TODO more tests needed
    private _nav(target_ent_type: ENT_TYPE, source_ent: string): string[] {
        const source_ent_type: ENT_TYPE = this.graph.getNodeProp(source_ent, 'ent_type');
        const ent_seq: any = this._getEntSeq(target_ent_type, source_ent_type);
        if (source_ent_type === target_ent_type) {
            if (source_ent_type === ENT_TYPE.COLLS) {
                return []; // TODO nav colls of colls
            }
            return [source_ent];
        }
        const dist: number = ent_seq[source_ent_type] - ent_seq[target_ent_type]
        if (dist === 1) {
            return this.graph.successors(source_ent, _GRAPH_EDGE_TYPE.ENTITY);
        }
        if (dist === -1) {
            return this.graph.predecessors(source_ent, _GRAPH_EDGE_TYPE.ENTITY);
        }
        let ents: string[] = [source_ent];
        const target_ents_set: Set<string> = new Set();
        while (ents.length > 0) {
            const ent_set: Set<string> = new Set();
            for (const ent of ents) {
                const target_ents: string[] = dist > 0 ? 
                    this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY) : 
                    this.graph.predecessors(ent, _GRAPH_EDGE_TYPE.ENTITY);
                for (const target_ent of target_ents) {
                    const this_ent_type: ENT_TYPE = this.graph.getNodeProp(target_ent, 'ent_type');
                    if (this_ent_type === target_ent_type) {
                        target_ents_set.add(target_ent);
                    } else if (this_ent_type in ent_seq) {
                        if (dist > 0 && ent_seq[this_ent_type] > ent_seq[target_ent_type]) {
                            ent_set.add(target_ent);
                        } else if (dist < 0 && ent_seq[this_ent_type] < ent_seq[target_ent_type]) {
                            ent_set.add(target_ent); 
                        }
                    }
                }
            }
            ents = Array.from(ent_set);
        }
        return Array.from(target_ents_set)
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the number of entities of the specified entity type.  
     * @param ent_type The type of entity to search for in the model.
     * @returns A number of entities of the specified type in the model.
     */
    public numEnts(ent_type: ENT_TYPE): number {
        return this.graph.degreeOut(
            _GRAPH_ENTS_NODE[ent_type], 
            _GRAPH_EDGE_TYPE.META
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
     * @param target_ent_type The type of entity to get from the model.
     * @param source_ents null, or a single entity ID or a list of entity IDs from which to get the
     * target entities.
     * @returns A list of entity IDs (no duplicates).
     */
    public getEnts(target_ent_type: ENT_TYPE, source_ents: string|string[] = null): string[] {
        if (source_ents === null) {
            return this.graph.successors(
                _GRAPH_ENTS_NODE[target_ent_type], 
                _GRAPH_EDGE_TYPE.META
            );
        }
        // not a list
        if (!Array.isArray(source_ents)) {
            return this._nav(target_ent_type, source_ents);
        }
        // a list with one zero or one item
        if (source_ents.length === 0) {
            return this.graph.successors(
                _GRAPH_ENTS_NODE[target_ent_type], 
                _GRAPH_EDGE_TYPE.META
            );
        } else if (source_ents.length === 1) {
            return this._nav(target_ent_type, source_ents[0]);
        }
        // a list with multiple items
        const ents_set: Set<string> = new Set();
        for (const source_ent of source_ents) {
            for (const target_ent of this._nav(target_ent_type, source_ent)) {
                ents_set.add(target_ent);
            }
        }
        return Array.from(ents_set);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a position ID or list the position IDs for an entity. If the entity is a point, vertex,
     * or position, then a single position is returned. If the entity is a polyline, a list of
     * positions will be returned. For a closed polyline, the first and last positions will be the
     * same. If the entity is a polygon, a nested list of positions is returned. If the entity is a
     * collection, ... not mplemented
     * @param ent An entity ID from which to get the position.
     * @returns A list of position IDs. 
     */
    public getEntPosis(ent: string): string|string[]|string[][] {
        const ent_type: ENT_TYPE = this.graph.getNodeProp(ent, 'ent_type');
        if ( ent_type === ENT_TYPE.POSIS ) {
            return ent;
        } else if ( ent_type === ENT_TYPE.VERTS) {
            return this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY)[0];
        } else if ( ent_type === ENT_TYPE.EDGES ) {
            const verts: string[] = this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY);
            return verts.map(vert => this.graph.successors(vert, _GRAPH_EDGE_TYPE.ENTITY)[0]);
        } else if ( ent_type === ENT_TYPE.WIRES) {
            const edges: string[] = this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY)
            const verts: string[] = edges.map(
                edge => this.graph.successors(edge, _GRAPH_EDGE_TYPE.ENTITY)[0]);
            const posis: string[] = verts.map(
                vert => this.graph.successors(vert, _GRAPH_EDGE_TYPE.ENTITY)[0]);
            const last_vert: string = this.graph.successors(edges[edges.length - 1], _GRAPH_EDGE_TYPE.ENTITY)[1];
            const last_posi: string = this.graph.successors(last_vert, _GRAPH_EDGE_TYPE.ENTITY)[0];
            posis.push(last_posi);
            return posis;
        } else if ( ent_type === ENT_TYPE.POINTS ) {
            const vert: string = this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY)[0];
            return this.graph.successors(vert, _GRAPH_EDGE_TYPE.ENTITY)[0];
        } else if ( ent_type === ENT_TYPE.PLINES ) {
            const wire: string = this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY)[0]
            const edges: string[] = this.graph.successors(wire, _GRAPH_EDGE_TYPE.ENTITY)
            const verts: string[] = edges.map( 
                edge => this.graph.successors(edge, _GRAPH_EDGE_TYPE.ENTITY)[0]);
            const wire_posis: string[] = verts.map( 
                vert => this.graph.successors(vert, _GRAPH_EDGE_TYPE.ENTITY)[0]);
            const last_vert: string = this.graph.successors(edges[edges.length - 1], _GRAPH_EDGE_TYPE.ENTITY)[1];
            const last_posi: string = this.graph.successors(last_vert, _GRAPH_EDGE_TYPE.ENTITY)[0];
            wire_posis.push(last_posi);
            return wire_posis;
        } else if ( ent_type === ENT_TYPE.PGONS ) {
            const posis: string[][] = [];
            for (const wire of this.graph.successors(ent, _GRAPH_EDGE_TYPE.ENTITY)) {
                const edges: string[] = this.graph.successors(wire, _GRAPH_EDGE_TYPE.ENTITY);
                const verts: string[] = edges.map( 
                    edge => this.graph.successors(edge, _GRAPH_EDGE_TYPE.ENTITY)[0]);
                const wire_posis: string[] = verts.map( 
                    vert => this.graph.successors(vert, _GRAPH_EDGE_TYPE.ENTITY)[0]);
                posis.push(wire_posis);
            }
            return posis;
        } else if ( ent_type === ENT_TYPE.COLLS ) {
            throw new Error('Not implemented'); // TODO
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the XYZ coordinates of an entity. If the entity is a point, vertex, or position, then a
     * single coord is returned. If the entity is a polyline, a list of coords will be returned.
     * For a closed polyline, the first and last coords will be the same. If the entity is a
     * polygon, a nested list of coords is returned. If the entity is a collection, ... not
     * mplemented.
     * @param ent A position ID.
     * @returns The XYZ coordinates.
     */
    public getEntCoords(ent: string): Txyz|Txyz[]|Txyz[][] { 
        const xyz_att: string = this._graphAttribNodeName(ENT_TYPE.POSIS, 'xyz');
        const posis: string|string[]|string[][] = this.getEntPosis(ent);
        if (!Array.isArray(posis)) {
            const att_val: string = this.graph.successors(posis, xyz_att)[0];
            return this.graph.getNodeProp(att_val, 'value');
        }
        if (posis.length === 0) { return []; }
        if (!Array.isArray(posis[0])) {
            const coords: Txyz[] = [];
            for (const posi of posis as string[]) {
                const att_vals = this.graph.successors(posi, xyz_att)[0];
                coords.push( this.graph.getNodeProp(att_vals, 'value') );
            }
            return coords;
        }
        const coords_arr: Txyz[][] = [];
        for (const wire_posis of posis as string[][]) {
            const coords: Txyz[] = [];
            for (const posi of wire_posis) {
                const att_vals = this.graph.successors(posi, xyz_att)[0];
                coords.push(this.graph.getNodeProp(att_vals, 'value'));
            }
            coords_arr.push(coords);
        }
        return coords_arr;
    }
    // =============================================================================================
    // QUERY
    // =============================================================================================
    /**
     * Check if a polyline is open or closed.
     * @param pline A polyline ID.
     * @returns True if closed, false if open.
     */
    public isPlineClosed(pline: string): boolean { 
        const edges: string[] = this.graph.successors(
            this.graph.successors(pline, _GRAPH_EDGE_TYPE.ENTITY)[0], _GRAPH_EDGE_TYPE.ENTITY);
        const start: string = this.graph.successors(
            this.graph.successors(edges[0], _GRAPH_EDGE_TYPE.ENTITY)[0], _GRAPH_EDGE_TYPE.ENTITY)[0];
        const end: string = this.graph.successors(
            this.graph.successors(edges[edges.length - 1], _GRAPH_EDGE_TYPE.ENTITY)[1], _GRAPH_EDGE_TYPE.ENTITY)[0];
        return start === end;
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
                this.graph.successors(_GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META));
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
                return this.graph.successors(_GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META);
            }
            const ents_equal: string[] = this.graph.predecessors(att_val_node, att);
            if (ents_equal.length === 0) {
                return this.graph.successors(_GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META);
            }
            const set_equal: Set<string> = new Set(ents_equal)
            const set_all: Set<string> = new Set(
                this.graph.successors(_GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META));
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
                _GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') < att_val) {
                    result.push(ent)
                }
            }
        }
        // val <= att_val
        else if (comparator === COMPARATOR.IS_LESS_OR_EQUAL) {
            for (const ent of this.graph.successors(
                _GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') <= att_val) {
                    result.push(ent);
                }
            }
        }
        // val > att_val
        else if (comparator === COMPARATOR.IS_GREATER) {
            for (const ent of this.graph.successors(
                _GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META)) {
                const val = this.graph.successors(ent, att)[0];
                if (val !== undefined && this.graph.getNodeProp(val, 'value') > att_val) {
                    result.push(ent);
                }
            }
        }
        // val >= att_val
        else if (comparator === COMPARATOR.IS_GREATER_OR_EQUAL) {
            for (const ent of this.graph.successors(
                _GRAPH_ENTS_NODE[ent_type], _GRAPH_EDGE_TYPE.META)) {
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
}
// =================================================================================================
// END SIM CLASS
// =================================================================================================