import { cloneDeep } from 'lodash';
// types
type TGraphEdges = Map<string, string[]>;
type TGraphFREdges = Map<number, TGraphEdges>;
type TGraphEdgeTypes = Map<string, TGraphFREdges>;
type TGraphSnapshots = Map<number, TGraphEdgeTypes>;
// Graph class
export class Graph {
    // The graph is created using a Map of nodes and nested Maps of edges.
    // 
    // For each edge type, both forward and reverse are stored.
    //
    private static FWD: number = 0;
    private static REV: number = 1;
    private static STATIC: number = 0;
    private static DYNAMIC: number = 1;
    private _nodes: Map<string, object>;
    private _edge_types: Map<string, number>;
    private _edges: TGraphSnapshots;
    private _curr_ssid: number;
    /**
     * CONSTRUCTOR
     */
    constructor() {
        // nodes
        this._nodes = new Map(); // key is node name, value is Map of properties
        // edge_types, key is edge_type, value is the snapshot id
        this._edge_types = new Map();
        // edges, nested dictionaries four levels deep
        // first level is the snapshot Map, key is the ssid, value is an Map
        // second level for each ssid, key is the edge_type, value is an Map
        // third level for each edge type, key is FWD or REV, value is Map
        // fourth level, for each edge_type, key is a start node, value is a list of end nodes
        this._edges = new Map();
        // init snapshot 0
        this._edges.set(0, new Map());
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
    public addNode(node: string, props: object = null): void {
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
    public getNodeProps(node: string): object {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        const props = this._nodes.get(node);
        if (props === null) { return {}; }
        return props;
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an outgoing edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A list of node names.
     */
    public getNodesWithOutEdge(edge_type: string, ssid: number = null): string[] {
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get the nodes
        const edges_fwd = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD);
        return Array.from(edges_fwd.keys());
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an incoming edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID.
     * @returns: A list of node names.
     */
    public getNodesWithInEdge(edge_type: string, ssid: number = null): string[] {
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get the nodes
        const edges_rev = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV);
        return Array.from(edges_rev.keys());
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Return true if the node node exists in the graph.
     * @param node: The name of the node, a string.
     * @returns : True if the node exists, false otherwise.
     */
    public hasNode(node: string): boolean {
        return this._nodes.has(node);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Add an edge to the graph, from node 0 to node 1.
     * @param node0: The name of the start node.
     * @param node1: The name of the end node.
     * @param edge_type: The edge type.
     */
    public addEdge(node0: string, node1: string, edge_type: string): void {
        if (!this._nodes.has(node0) && this._nodes.has(node1)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        if (node0 === node1) {
            throw new Error('Nodes cannot be the same.')
        }
        const edges = this._edges.get(this._curr_ssid).get(edge_type);
        // add edge from n0 to n1
        if (edges.get(Graph.FWD).has(node0)) {
            edges.get(Graph.FWD).get(node0).push( node1 );
        } else {
            edges.get(Graph.FWD).set(node0, [node1]);
        }
        // add rev edge from n1 to n0
        if (edges.get(Graph.REV).has(node1)) {
            edges.get(Graph.REV).get(node1).push( node0 );
        } else {
            edges.get(Graph.REV).set(node1, [node0]);
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
    public hasEdge(node0: string, node1: string, edge_type: string, ssid: number = null): boolean {
        if (!this._nodes.has(node0) || !this._nodes.has(node1)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // check if edge exists 
        const edges_fwd = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD);
        if (!edges_fwd.has(node0)) {
            return false;
        }
        return edges_fwd.get(node0).includes(node1);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Add an edge type to the graph.
     * @param edge_type: The edge type.
     */
    public addEdgeType(edge_type: string): void {
        if (this._edge_types.has(edge_type)) {
            throw new Error('Edge type already exists.')
        }
        this._edge_types.set(edge_type, this._curr_ssid);
        this._edges.get(this._curr_ssid).set(edge_type, new Map());
        this._edges.get(this._curr_ssid).get(edge_type).set(Graph.FWD, new Map());
        this._edges.get(this._curr_ssid).get(edge_type).set(Graph.REV, new Map());
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Return true if the edge type exists in the graph.
     * @param edge_type: The edge type.
     * @returns: True if the edge type exists, false otherwise.
     */
    public hasEdgeType(edge_type: string): boolean {
        return this._edge_types.has(edge_type);
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
    public successors(node: string, edge_type: string, ssid: number = null): string[] {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get successors
        const edges_fwd = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD);
        if (!edges_fwd.has(node)) {
            return [];
        }
        return edges_fwd.get(node);
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
    public predecessors(node: string, edge_type: string, ssid: number = null): string[] {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // get predecessors
        const edges_rev = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV);
        if (!edges_rev.has(node)) {
            return [];
        }
        return edges_rev.get(node);
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
    public degreeIn(node: string, edge_type: string, ssid: number = null): number {
        if (!this._nodes .has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // calc reverse degree
        const edges_rev = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV);
        if (!edges_rev.has(node)) {
            return 0;
        }
        return edges_rev.get(node).length;
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
    public degreeOut(node: string, edge_type: string, ssid: number = null): number {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist.');
        }
        if (!this._edge_types.has(edge_type)) {
            throw new Error('Edge type does not exist.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid;}
        // calc forward degree
        const edges_fwd = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD);
        if (!edges_fwd.has(node)) {
            return 0;
        }
        return edges_fwd.get(node).length;
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Count the the total number of incoming and outgoing edges.
     * @param node: The name of the node for which to count edges.
     * @param edge_type: The edge type.
     * @returns: An integer, the number of edges.
     */
    public degree(node: string, edge_type: string): number {
        return this.degreeIn(node, edge_type) + this.degreeOut(node, edge_type);
    }
    // ----------------------------------------------------------------------------------------------
    /**
     * Start a new snapshot of the edges in the graph.
     * If `init` is null, the the new snapshot will ne initialised with the current snapshot.
     * @param init: A list of existing snapshot IDS to intialise the new snapshot.
     * @returns An integer, the ssid of the current snapshot.
     */
    public newSnapshot(init: number|number[] = null): number {
        if (init === null) {
            init = this._curr_ssid;
        } 
        if (!Array.isArray(init)) {
            this._curr_ssid += 1;
            this._edges.set(this._curr_ssid, cloneDeep(this._edges.get(init)));
            return this._curr_ssid;
        }
        this._curr_ssid += 1;
        this._edges.set(this._curr_ssid, cloneDeep(this._edges.get(init[0]))); // TODO
        return this._curr_ssid;
    }
}
// ==================================================================================================
// END GRAPH CLASS
// ==================================================================================================
