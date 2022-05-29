import { cloneDeep } from 'lodash';
// types
type TGraphEdges = Map<string, string[]>;
type TGraphFREdges = Map<number, TGraphEdges>;
type TGraphEdgeTypes = Map<string, TGraphFREdges>;
type TGraphSnapshots = Map<number, TGraphEdgeTypes>;
type TAttribDataTypes = string | number | boolean | any[] | object;
// Graph class
export class Graph {
    // The graph is created using a Map of nodes and nested Maps of edges.
    // 
    // For each edge type, there are two dicts, forward and reverse.
    // These edges dicts vary based on the edge type.
    // 
    // M2M forward: key = start node, value = [end nodes]
    // M2M reverse: key = start node, value = [end nodes]
    // 
    // M2O forward: key = start node, value = single end node
    // M2O reverse: key = start node, value = [end nodes]
    // 
    // O2M forward: key = start node, value = [end nodes]
    // O2M reverse: key = start node, value = single end node
    // 
    // O2O forward: key = start node, value = single end node
    // O2O reverse: key = start node, value = single end node
    //
    static O2O: string = 'o2o'; // one to one
    static M2M: string = 'm2m'; // many to many
    static M2O: string = 'm2o'; // many to one
    static O2M: string = 'o2m'; // one to many
    static FWD: number = 0;
    static REV: number = 1;
    private _nodes: Map<string, Map<string, TAttribDataTypes>>;
    private _edge_types: Map<string, string>;
    private _edges: TGraphSnapshots;
    private _curr_ssid: number;
    /**
     * CONSTRUCTOR
     */
    constructor() {
        // nodes
        this._nodes = new Map(); // key is node name, value is Map of properties
        // edge_types, key is edge_type, value is x2x (M2M, M2O, O2M, O2O)
        this._edge_types = new Map();
        // edges, nested dictionaries four levels deep
        // first level is the snapshot Map, key is the ssid, value is an Map
        // second level for each ssid, key is the edge_type, value is an Map
        // third level for each edge type, key is FWD or REV, value is Map
        // fourth level, for each edge_type, key is a start node, value is a list of end nodes
        this._edges = new Map();
        // init snapshot 0
        this._edges[0] = new Map();
        this._curr_ssid = 0
    }
    // ==============================================================================================
    // METHODS
    // ==============================================================================================
    /**
     * Add a node to the graph. Throws an error if the node already exists.
     * @param node: The name of the node, a string.
     * @param props: node properties, a dictionary of key-value pairs.
     */
    public addNode(node: string, props:Map<string, TAttribDataTypes> ) {
        if (this._nodes.has(node)) {
            throw new Error('Node already exists.');
        }
        this._nodes.set(node, props);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get the properties of a node in the graph. Throws an error is the node does not exist.
     * @param node: The name of the node, a string. 
     * @returns: A dictionary of node properties.
     */
    public getNodeProps(node: string) {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        return this._nodes.get(node);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an outgoing edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A list of node names.
     */
    public getNodesWithOutEdge(edge_type: string, ssid: number = null) {
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get the nodes
        return this._edges.get(ssid).get(edge_type).get(Graph.FWD).keys()
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an incoming edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A list of node names.
     */
    public getNodesWithInEdge(edge_type: string, ssid: number = null) {
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get the nodes
        return this._edges.get(ssid).get(edge_type).get(Graph.REV).keys()
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Return true if the node node exists in the graph.
     * @param node: The name of the node, a string.
     * @returns : True if the node exists, false otherwise.
     */
    public hasNode(node: string) {
        return node in this._nodes;
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Add an edge to the graph, from node 0 to node 1.
     * @param node0: The name of the start node.
     * @param node1: The name of the end node.
     * @param edge_type: The edge type.
     */
    public addEdge(node0: string, node1: string, edge_type: string) {
        if (!this._nodes.has(node0) && this._nodes.has(node1)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // add edge from n0 to n1
        if (this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD).has(node0)) {
            this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD)[node0].push( node1 );
        } else {
            this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD)[node0] = [node1];
        }
        // add rev edge from n1 to n0
        if (this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV).has(node1)) {
            this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV)[node1].push( node0 );
        } else {
            this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV)[node1] = [node0];
        }
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Return true if an edge from n0 to n1 exists in the graph.
     * @param node0: The name of the start node.
     * @param node1: The name of the end node.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: True if the edge exists, false otherwise.
     */
    public hasEdge(node0: string, node1: string, edge_type: string, ssid: number = null) {
        if (!this._nodes.has(node0) && this._nodes.has(node1)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // check if edge exists 
        if (!this._edges.get(ssid).get(edge_type).get(Graph.FWD).has(node0)) {
            return false;
        }
        return node1 in this._edges.get(ssid).get(edge_type).get(Graph.FWD)[node0];
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Add an edge type to the graph.
     * @param edge_type: The edge type.
     * @param x2x: One of 'm2m', 'm2o', 'o2m', 'o2o'.
     */
    public addEdgeType(edge_type: string, x2x: string) {
        if (this._edge_types.has(edge_type)) {
            throw new Error('Edge type already exists.')
        }
        this._edge_types[edge_type] = x2x;
        this._edges[this._curr_ssid][edge_type] = new Map();
        this._edges.get(this._curr_ssid).get(edge_type).set(Graph.FWD, new Map());
        this._edges.get(this._curr_ssid).get(edge_type).set(Graph.REV, new Map());
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Return true if the edge type exists in the graph.
     * @param edge_type: The edge type.
     * @returns: True if the edge type exists, false otherwise.
     */
    public hasEdgeType(edge_type: string) {
        return edge_type in this._edge_types;
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get one successor of a node in the graph.
     * The node 'n' is linked to a successor by a forward edge of type 'edge_type'.
     * If there are no successors, then null is returned.
     * If the edge type ends in 'm' (i.e. 'm2m' or 'o2m'), then an error is thrown.
     * @param node: The name of the node from which to find successors.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A single node name.
     */
    public successor(node: string, edge_type: string, ssid: number = null) {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get the edge x2x
        const x2x = this._edge_types[edge_type];
        if (x2x === Graph.M2M || x2x === Graph.O2M) {
            throw new Error('Edge type has multiple successors.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get successor
        if (!this._edges.get(ssid).get(edge_type).get(Graph.FWD).has(node)) {
            return null
        }
        if (this._edges.get(ssid).get(edge_type).get(Graph.FWD).get(node).length === 0) {
            return null;
        }
        return this._edges.get(ssid).get(edge_type).get(Graph.FWD).get(node)[0];
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get multiple successors of a node in the graph.
     * The node 'n' is linked to each successor by a forward edge of type 'edge_type'.
     * If there are no successors, then an empty list is returned.
     * If the edge type ends in 'o' (i.e. 'm2o' or 'o2o'), then an error is thrown.
     * @param node: The name of the node from which to find successors.
     * @param edge_type: The edge type.
     * @param ssid; Snapshot ID.
     * @returns: A list of nodes names.
     */
    public successors(node: string, edge_type: string, ssid: number = null) {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get the edge x2x
        const x2x = this._edge_types[edge_type];
        if (x2x === Graph.M2O || x2x === Graph.O2O) {
            throw new Error('Edge type has one successor.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get successors
        if (!this._edges.get(ssid).get(edge_type).get(Graph.FWD).has(node)) {
            return [];
        }
        return this._edges.get(ssid).get(edge_type).get(Graph.FWD).get(node);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get one predecessors of a node in the graph.
     * The node 'n' is linked to a predecessor by a reverse edge of type 'edge_type'.
     * If there are no predecessors, then null returned.
     * If the edge type starts with 'm' (i.e. 'm2m' or 'm2o'), then an error is thrown.
     * @param node: The name of the node from which to find predecessors.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A single node name.
     */    
    public predecessor(node: string, edge_type: string, ssid: number = null) {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get the edge x2x
        const x2x = this._edge_types[edge_type];
        if (x2x === Graph.M2M || x2x === Graph.M2O) {
            throw new Error('Edge type has multiple predecessors.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get the predecessor
        if (!this._edges.get(ssid).get(edge_type).get(Graph.REV).has(node)) {
            return null;
        }
        if (this._edges.get(ssid).get(edge_type).get(Graph.REV).get(node).length === 0) {
            return null;
        }
        return this._edges.get(ssid).get(edge_type).get(Graph.REV).get(node)[0];
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get multiple predecessors of a node in the graph.
     * The node 'n' is linked to each predecessor by a reverse edge of type 'edge_type'.
     * If there are no predecessors, then an empty list is returned.
     * If the edge type starts with 'o' (i.e. 'o2o' or 'o2m'), then an error is thrown.
     * @param node: The name of the node from which to find predecessors.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A list of nodes names, or a single node name.
     */
    public predecessors(node: string, edge_type: string, ssid: number = null) {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get the edge x2x
        const x2x = this._edge_types[edge_type];
        if (x2x  === Graph.O2M || x2x === Graph.O2O) {
            throw new Error('Edge type has one predecessor.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get predecessors
        if (!this._edges.get(ssid).get(edge_type).get(Graph.REV).has(node)) {
            return [];
        }
        return this._edges.get(ssid).get(edge_type).get(Graph.REV).get(node);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Count the the number of incoming edges.
     * The 'in degree' is the number of reverse edges of type 'ent_type' linked to node 'n'.
     * @param node: The name of the node for which to count incoming edges.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: An integer, the number of incoming edges.
     */
    public degree_in(node: string, edge_type: string, ssid: number = null) {
        if (!this._nodes .has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // calc reverse degree
        if (!this._edges.get(ssid).get(edge_type).get(Graph.REV).has(node)) {
            return 0;
        }
        return this._edges.get(ssid).get(edge_type).get(Graph.REV).get(node).length;
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Count the the number of outgoing edges.
     * The 'out degree' is the number of forward edges of type 'ent_type' linked to node 'n'.
     * @param node: The name of the node for which to count outgoing edges.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: An integer, the number of outgoing edges.
     */
    public degree_out(node: string, edge_type: string, ssid: number = null) {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // calc forward degree
        if (!this._edges.get(ssid).get(edge_type).get(Graph.FWD).has(node)) {
            return 0;
        }
        return this._edges.get(ssid).get(edge_type).get(Graph.FWD).get(node).length;
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Count the the total number of incoming and outgoing edges.
     * @param node: The name of the node for which to count edges.
     * @param edge_type: The edge type.
     * @returns: An integer, the number of edges.
     */
    public degree(node: string, edge_type: string) {
        return this.degree_in(node, edge_type) + this.degree_out(node, edge_type);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Takes a snapshot of the current set of edges in the graph.
     * @returns An integer, the ssid of the current snapshot.
     */
    public snapshot() {
        const prev_ssid = this._curr_ssid;
        this._curr_ssid += 1;
        this._edges.set(this._curr_ssid, cloneDeep(this._edges.get(prev_ssid)));
        return prev_ssid;
    }
}
// ==================================================================================================
// END GRAPH CLASS
// ==================================================================================================
