import { cloneDeep } from 'lodash';
// types
type TGraphEdges = Map<string, Set<string>>;
type TGraphFREdges = Map<number, TGraphEdges>;
type TGraphEdgeTypes = Map<string, TGraphFREdges>;
type TGraphSnapshots = Map<number, TGraphEdgeTypes>;
// enums
export enum X2X {
    O2O,
    O2M,
    M2O,
    M2M
}
// Graph class
export class Graph {
    private static FWD: number = 0;
    private static REV: number = 1;
    private _nodes: Map<string, Map<string, any>>;
    private _edges_reversed: Map<string, boolean>;
    private _edges: TGraphSnapshots;
    private _curr_ssid: number;
    // ---------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR
     */
    constructor() {
        // nodes
        this._nodes = new Map(); // key is node name, value is Map of properties
        // edge_types, key is edge_type, value is a boolean
        this._edges_reversed = new Map();
        // edges, nested dictionaries four levels deep
        // first level, key is the ssid, value is an Map
        // second level, key is the edge_type, value is an Map
        // third level, key is FWD or REV, value is Map
        // fourth level, key is a start node, value is a Set of end nodes
        this._edges = new Map();
        // init snapshot 0
        this._edges.set(0, new Map());
        this._curr_ssid = 0
    }
    // =============================================================================================
    // METHODS
    // =============================================================================================
    /**
     * Add a node to the graph. Throws an error if the node already exists.
     * @param node: The name of the node, a string.
     */
    public addNode(node: string): void {
        if (this._nodes.has(node)) {
            throw new Error('Node already exists.');
        }
        this._nodes.set(node, null);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set a property of a node . Throws an error is the node does not exist.
     * @param node: The name of the node, a string. 
     * @param prop_name: The name of the property, a string. 
     * @param prop_val: The value of the property, of type 'any'. 
     * @returns: Void
     */
     public setNodeProp(node: string, prop_name: string, prop_val: any): void {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist: ' + node + '.');
        }
        let props: Map<string, any> = this._nodes.get(node);
        if (props === null) { 
            props = new Map();
            this._nodes.set(node, props);
        }
        props.set(prop_name, prop_val);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the value of a node property. Throws an error is the node does not exist.
     * Throws an error is the property does not exist.
     * @param node: The name of the node, a string. 
     * @param prop_name: The name of the property, a string. 
     * @returns: The value of a node property.
     */
    public getNodeProp(node: string, prop_name: string): any {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist: ' + node + '.');
        }
        const props: Map<string, any> = this._nodes.get(node);
        if (props === undefined || !props.has(prop_name)) { 
            throw new Error('Property does not exist.');
        }
        return props.get(prop_name);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the names of all the node properties. Throws an error is the node does not exist.
     * @param node: The name of the node, a string. 
     * @returns: A list of node property names.
     */
     public getNodePropNames(node: string): string[] {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist: ' + node + '.');
        }
        return Array.from(this._nodes.get(node).keys());
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an outgoing edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: A list of node names.
     */
    public getNodesWithOutEdge(edge_type: string, ssid: number = null): string[] {
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get the nodes
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges ===  undefined) {
            return [];
        }
        return Array.from(edges.get(Graph.FWD).keys());
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an incoming edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: A list of node names.
     */
    public getNodesWithInEdge(edge_type: string, ssid: number = null): string[] {
        if (!this._edges_reversed.get(edge_type)) {
            throw new Error('Edge types "' + edge_type + '" does not have reverse edges.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get the nodes
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined) {
            return [];
        }
        return Array.from(edges.get(Graph.REV).keys());
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Return true if the node node exists. 
     * @param node: The name of the node, a string.
     * @returns : True if the node exists, false otherwise.
     */
    public hasNode(node: string): boolean {
        return this._nodes.has(node);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an edge to the graph, from node 0 to node 1. If the edge_type has reverse edges, then a
     * reverse edge will also be added. If the edge already exists, then no error is thrown. 
     * @param node0: The name of the start node.
     * @param node1: The name of the end node.
     * @param edge_type: The edge type.
     */
    public addEdge(node0: string, node1: string, edge_type: string, ssid: number = null): void {
        if (!this._nodes.has(node0) || !this._nodes.has(node1)) {
            throw new Error('Node does not exist: ' + node0 + ', ' + node1 + '.');
        }
        if (node0 === node1) {
            throw new Error('Nodes cannot be the same.')
        }
        if (!this._edges_reversed.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get edges
        let edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined) {
            edges = new Map();
            edges.set(Graph.FWD, new Map());
            if (this._edges_reversed.get(edge_type)) {
                edges.set(Graph.REV, new Map());
            }
            this._edges.get(ssid).set(edge_type, edges);
        }
        // add fwd edge from n0 to n1
        const edge_fwd: TGraphEdges = edges.get(Graph.FWD);
        if (edge_fwd.has(node0)) {
            edge_fwd.get(node0).add( node1 );
        } else {
            edge_fwd.set(node0, new Set([node1]));
        }
        // add rev edge from n1 to n0
        if (this._edges_reversed.get(edge_type)) {
            const edge_rev: TGraphEdges = edges.get(Graph.REV);
            if (edge_rev.has(node1)) {
                edge_rev.get(node1).add( node0 );
            } else {
                edge_rev.set(node1, new Set([node0]));
            }
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Delete the edge from n0 to n1.
     * If `node0` is null, then all edges ending at `node1` will be deleted.
     * If `node1` is null, then all edges starting at `node0` will be deleted.
     * If the edge does not exists, then no error is thrown. 
     * @param node0: The name of the start node.
     * @param node1: The name of the end node, or null.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     */
     public delEdge(node0: string, node1: string, edge_type: string, ssid: number = null): void {
         // error check
         if (!this._edges_reversed.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        const rev: boolean = this._edges_reversed.get(edge_type);
        // null cases, del all edges which end at node1
        if (node0 == null) {
            if (!rev) {
                throw new Error('Edge types "' + edge_type + '" does not have reverse edges.');
            }
            const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
            if (edges !== undefined && edges.get(Graph.REV).has(node1)) {
                for (const node of edges.get(Graph.REV).get(node1)) {
                    this.delEdge(node, node1, edge_type, ssid);
                }
            }
            return;
        }
        // null cases, del all edges which end start at node0
        if (node1 == null) {
            const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
            if (edges !== undefined && edges.get(Graph.FWD).has(node0)) {
                // edges.get(Graph.FWD).delete(node0);
                for (const node of edges.get(Graph.FWD).get(node0)) {
                    this.delEdge(node0, node, edge_type, ssid);
                }
            }
            return;
        }
        // error check
        if (!this._nodes.has(node0) || !this._nodes.has(node1)) {
            throw new Error('Node does not exist: ' + node0 + ', ' + node1 + '.');
        }
        if (node0 === node1) {
            throw new Error('Nodes cannot be the same.')
        }
        // get edges
        const edges = this._edges.get(ssid).get(edge_type);
        // if no edge, silently return
        if (!edges.get(Graph.FWD).has(node0)) {
            return;
        }
        // del fwd edge from n0 to n1
        let deleted: boolean = edges.get(Graph.FWD).get(node0).delete(node1); 
        // if no edge, silently return
        if (!deleted) {
            return;
        }
        // del rev edge from n1 to n0
        if (rev) {
            edges.get(Graph.REV).get(node1).delete(node0);
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Return true if an edge from n0 to n1 exists .
     * @param node0: The name of the start node.
     * @param node1: The name of the end node.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: True if the edge exists, false otherwise.
     */
     public hasEdge(node0: string, node1: string, edge_type: string, ssid: number = null): boolean {
        if (!this._nodes.has(node0) || !this._nodes.has(node1)) {
            throw new Error('Node does not exist: ' + node0 + ', ' + node1 + '.');
        }
        if (!this._edges_reversed.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get edges
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        // check if edge exists 
        if (edges === undefined || !edges.get(Graph.FWD).has(node0)) {
            return false;
        }
        return edges.get(Graph.FWD).get(node0).has(node1);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an edge type to the graph.
     * @param edge_type: The edge type.
     * @param rev: If true, create reverse edges,
     */
    public addEdgeType(edge_type: string, rev: boolean = true): void {
        if (this._edges_reversed.has(edge_type)) {
            throw new Error('Edge type already exists.')
        }
        this._edges_reversed.set(edge_type, rev);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Return true if the edge type exists .
     * @param edge_type: The edge type.
     * @returns: True if the edge type exists, false otherwise.
     */
    public hasEdgeType(edge_type: string): boolean {
        return this._edges_reversed.has(edge_type);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get multiple successors of a node .
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
            throw new Error('Node does not exist: ' + node + '.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get successors
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined || !edges.get(Graph.FWD).has(node)) {
            return [];
        }
        return Array.from(edges.get(Graph.FWD).get(node));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get multiple predecessors of a node .
     * The node 'n' is linked to each predecessor by a reverse edge of type 'edge_type'.
     * If there are no predecessors, then an empty list is returned.
     * If the edge type starts with 'o' (i.e. 'o2o' or 'o2m'), then an error is thrown.
     * @param node: The name of the node from which to find predecessors.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: A list of nodes names, or a single node name.
     */
    public predecessors(node: string, edge_type: string, ssid: number = null): string[] {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist: "' + node + '".');
        }
        if (!this._edges_reversed.get(edge_type)) {
            throw new Error('Edge types "' + edge_type + '" does not have reverse edges.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get predecessors
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined || !edges.get(Graph.REV).has(node)) {
            return [];
        }
        return Array.from(edges.get(Graph.REV).get(node));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Advanced low level method - this can break graph consistency. Creates multiple edges by
     * manually specifying the successors of a node. An existing successors will be overwritten. If
     * this edge_type has reverse edges, then care needs to be taken to also update the
     * predecessors.
     * @param node0: The name of the start node.
     * @param nodes1: A list of names of the sucessor nodes.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     */
     public setSuccessors(node0: string, nodes1: string[], edge_type: string, ssid: number = null): void {
        if (!this._nodes.has(node0)) {
            throw new Error('Node does not exist: ' + node0 + '.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get successors
        let edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined) {
            edges = new Map();
            edges.set(Graph.FWD, new Map());
            if (this._edges_reversed.get(edge_type)) {
                edges.set(Graph.REV, new Map());
            }
            this._edges.get(ssid).set(edge_type, edges);
        }
        // set successors
        edges.get(Graph.FWD).set(node0, new Set(nodes1));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Advanced low level method - this can break graph consistency. Creates multiple edges by
     * manually specifying the predecessors of a node. Any existing predecessors will be
     * overwritten. Care needs to be taken to also update the successors.
     * @param node1: The name of the end node.
     * @param nodes0: A list of names of the predecessor nodes.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     */
     public setPredessors(node1: string, nodes0: string[], edge_type: string, ssid: number = null): void {
        if (!this._nodes.has(node1)) {
            throw new Error('Node does not exist: ' + node1 + '.');
        }
        if (!this._edges_reversed.get(edge_type)) {
            throw new Error('Edge types "' + edge_type + '" does not have reverse edges.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get edges
        let edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined) {
            edges = new Map();
            edges.set(Graph.FWD, new Map());
            if (this._edges_reversed.get(edge_type)) {
                edges.set(Graph.REV, new Map());
            }
            this._edges.get(ssid).set(edge_type, edges);
        }
        // set predecessors
        edges.get(Graph.REV).set(node1, new Set(nodes0));
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Count the the number of incoming edges.
     * The 'in degree' is the number of reverse edges of type 'ent_type' linked to node 'n'.
     * @param node: The name of the node for which to count incoming edges.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: An integer, the number of incoming edges.
     */
    public degreeIn(node: string, edge_type: string, ssid: number = null): number {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist: ' + node + '.');
        }
        if (!this._edges_reversed.get(edge_type)) {
            throw new Error('Edge types "' + edge_type + '" does not have reverse edges.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // calc reverse degree
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined || !edges.get(Graph.REV).has(node)) {
            return 0;
        }
        return edges.get(Graph.REV).get(node).size;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Count the the number of outgoing edges.
     * The 'out degree' is the number of forward edges of type 'ent_type' linked to node 'n'.
     * @param node: The name of the node for which to count outgoing edges.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: An integer, the number of outgoing edges.
     */
    public degreeOut(node: string, edge_type: string, ssid: number = null): number {
        if (!this._nodes.has(node)) {
            throw new Error('Node does not exist: ' + node + '.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // calc forward degree
        const edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined || !edges.get(Graph.FWD).has(node)) {
            return 0;
        }
        return edges.get(Graph.FWD).get(node).size;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Count the the total number of incoming and outgoing edges.
     * @param node: The name of the node for which to count edges.
     * @param edge_type: The edge type.
     * @returns: An integer, the number of edges.
     */
    public degree(node: string, edge_type: string, ssid: number = null): number {
        return this.degreeIn(node, edge_type, ssid) + this.degreeOut(node, edge_type, ssid);
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Start a new snapshot of the edges .
     * If `ssid` is null, the the new snapshot will be empty.
     * @param ssid: A snapshot ID to intialise the new snapshot.
     * @returns An integer, the ssid of the new snapshot.
     */
    public newSnapshot(ssid: number = null): number {
        this._curr_ssid += 1;
        if (ssid === null) {
            // create a new empty snapshot
            this._edges.set(this._curr_ssid, new Map());
        } else {
            // create a deep copy of the edge in an existing snapshot
            this._edges.set(this._curr_ssid, cloneDeep(this._edges.get(ssid)));
        }
        return this._curr_ssid;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Copy a set of edges from another snapshot into the current active snapshot.
     * @param edge_type The type of edges to copy.
     * @param ssid The snapshot ID to copy from.
     * @param x2x The relationship between nodes, for clash detection.
     */
    public snapshotCopyEdges(edge_type: string, ssid: number, x2x: X2X = X2X.M2M): void {
        // get the other edges to copy
        const other_edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (other_edges === undefined) {
            return;
        }
        // get the current edges
        let curr_edges: TGraphFREdges = this._edges.get(this._curr_ssid).get(edge_type);
        if (curr_edges === undefined) {
            curr_edges = new Map();
            curr_edges.set(Graph.FWD, new Map());
            if (this._edges_reversed.get(edge_type)) {
                curr_edges.set(Graph.REV, new Map());
            }
            this._edges.get(this._curr_ssid).set(edge_type, curr_edges);
        }
        // copy forward edges
        for (const [other_node0, other_nodes1_set] of other_edges.get(Graph.FWD)) {
            if (curr_edges.get(Graph.FWD).has(other_node0)) {
                const curr_nodes1_set: Set<string> = curr_edges.get(Graph.FWD).get(other_node0);
                for (const other_node1 of other_nodes1_set) {
                    curr_nodes1_set.add(other_node1);
                    if (x2x !== X2X.M2M && x2x !== X2X.O2M && curr_nodes1_set.size > 1) {
                        throw new Error('Node relationship violated: ' + X2X[x2x]);
                    }
                }
            } else {
                curr_edges.get(Graph.FWD).set(other_node0, cloneDeep(other_nodes1_set));
            }
        }
        // copy reverse edges
        if (this._edges_reversed.get(edge_type)) {
            for (const [other_node0, other_nodes1_set] of other_edges.get(Graph.REV)) {
                if (curr_edges.get(Graph.REV).has(other_node0)) {
                    const curr_nodes1_set: Set<string> = curr_edges.get(Graph.REV).get(other_node0);
                    for (const other_node1 of other_nodes1_set) {
                        curr_nodes1_set.add(other_node1);
                        if (x2x !== X2X.M2M && x2x !== X2X.M2O && curr_nodes1_set.size > 1) {
                            throw new Error('Node relationship violated: ' + X2X[x2x]);
                        }
                    }
                } else {
                    curr_edges.get(Graph.REV).set(other_node0, cloneDeep(other_nodes1_set));
                }
            }
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get the ID of the current active snapshot.
     * @returns An integer, the ssid of the active snapshot.
     */
    public getActiveSnapshot(): number {
         return this._curr_ssid;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Clear all edges in the current active snapshot.
     * @returns An integer, the ssid of the active snapshot.
     */
    public clearSnapshot(): void {
        this._edges.set(this._curr_ssid, new Map());
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Set the ID of the current active snapshot.
     * If teh snapshot ID does not exist, an error will be thrown.
     * @param ssid: The ID of an existing spanshot.
     * @returns An integer, the ssid of the active snapshot.
     */
    public setActiveSnapshot(ssid: number): void {
        if (!this._edges.has(ssid)) {
            throw new Error('Snapshot ID does not exist.');
        }
        this._curr_ssid = ssid;
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Creates a human-readable string representation of the graph, for debugging.
     * @returns A string representation of the graph.
     */
     public toString(): string {
        let info: string = '\n';
        for (const [ssid, edge_types_map] of this._edges) {
            info += 'SSID = ' + ssid + '\n';
            for (const [edge_type, fr_edges_map] of edge_types_map) {
                info += '    EDGE TYPE = ' + edge_type + ', reverse = ' + this._edges_reversed.get(edge_type) + '\n';
                // fwd edges
                for (const [start, end] of fr_edges_map.get(Graph.FWD)) {
                    info += '      FWD EDGE: ' + start + ' -> ';
                    if (end instanceof Set) {
                        info += '[' + Array.from(end).toString() + ']\n';
                    } else {
                        info += end + '\n';
                    }
                }
                // rev edges
                if (this._edges_reversed.get(edge_type)) {
                    for (const [start, end] of fr_edges_map.get(Graph.REV)) {
                        info += '      REV EDGE: ';
                        if (end instanceof Set) {
                            info += '[' + Array.from(end).toString() + ']';
                        } else {
                            info += end;
                        }
                        info += ' <- ' + start + '\n';
                    }
                }
            }
        }
        return info;
    }
}
// =================================================================================================
// END GRAPH CLASS
// =================================================================================================
