import { cloneDeep } from 'lodash';
// types
type TGraphEdges2O = Map<string, string>;
type TGraphEdges2M = Map<string, Set<string>>;
type TGraphFREdges = Map<number, TGraphEdges2M|TGraphEdges2O>;
type TGraphEdgeTypes = Map<string, TGraphFREdges>;
type TGraphSnapshots = Map<number, TGraphEdgeTypes>;
type EdgeProps = {rel: X2X, rev: boolean}
// Edge relationships
export enum X2X {
    O2O, // one to one
    O2M, // one to many
    M2O, // many to one
    M2M  // many to many
}
// Graph class
export class Graph {
    private static FWD: number = 0; // forward edges
    private static REV: number = 1; // reverse edges
    private _nodes: Map<string, Map<string, any>>; // the nodes in teh graph
    private _edge_props: Map<string, EdgeProps>; // the properties for each type of edge
    private _edges: TGraphSnapshots; // a nested datastructure to store edges
    private _curr_ssid: number; // the current snapshot ID
    // ---------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR
     */
    constructor() {
        // nodes
        this._nodes = new Map(); // key is node name, value is Map of properties
        // edge_types, key is edge_type, value is the snapshot id
        this._edge_props = new Map();
        // edges, nested dictionaries four levels deep
        // first level, key is the ssid, value is an Map
        // second level, key is the edge_type, value is an Map
        // third level, key is FWD or REV, value is Map
        // fourth level, key is a start node, value is a one end node or a Set of end nodes
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
        if (props === null || !props.has(prop_name)) { 
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
        const edges_fwd = this._edges.get(ssid).get(edge_type).get(Graph.FWD);
        return Array.from(edges_fwd.keys());
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Get a list of nodes that have an incoming edge of type edge_type.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: A list of node names.
     */
    public getNodesWithInEdge(edge_type: string, ssid: number = null): string[] {
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get the nodes
        const edges_rev = this._edges.get(ssid).get(edge_type).get(Graph.REV);
        return Array.from(edges_rev.keys());
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
     * Add an edge to the graph, from node 0 to node 1.
     * Will also add a reverse edge at the same time.
     * If the edge type is O2O, and a previous edge already exists from node0, then this new edge 
     * will replace both the forward and reverse edges. 
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
        if (!this._edge_props.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get edges
        let edges: TGraphFREdges = this._edges.get(ssid).get(edge_type);
        if (edges === undefined) {
            edges = new Map();
            edges.set(Graph.FWD, new Map());
            edges.set(Graph.REV, new Map());
            this._edges.get(ssid).set(edge_type, edges);
        }
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        // add edge
        if (rel === X2X.O2O) {
            this._addEdgeO2O(node0, node1, edges, rev);
        } else if (rel === X2X.O2M) {
            this._addEdgeO2M(node0, node1, edges, rev);
        } if (rel === X2X.M2O) {
            this._addEdgeM2O(node0, node1, edges, rev);
        } if (rel === X2X.M2M) {
            this._addEdgeM2M(node0, node1, edges, rev);
        }
    }
    private _addEdgeO2O(node0: string, node1: string, edges: TGraphFREdges, rev: boolean): void {
        // add rev edge from n1 to n0
        if (rev) {
            const edge_rev: TGraphEdges2O = edges.get(Graph.REV) as TGraphEdges2O;
            if (edges.get(Graph.FWD).has(node0)) {
                // for O2O delete the old rev edge if it exists
                const old_node1: string = edges.get(Graph.FWD).get(node0) as string;
                edge_rev.delete(old_node1);
            }
            edge_rev.set(node1, node0);
        }
        // add fwd edge from n0 to n1
        const edge_fwd: TGraphEdges2O = edges.get(Graph.FWD) as TGraphEdges2O;
        edge_fwd.set(node0, node1);
    }
    private _addEdgeO2M(node0: string, node1: string, edges: TGraphFREdges, rev: boolean): void {
        // add rev edge from n1 to n0
        if (rev) {
            const edge_rev: TGraphEdges2O = edges.get(Graph.REV) as TGraphEdges2O;
            if (edges.get(Graph.REV).has(node1)) {
                const old_node0: string = edges.get(Graph.REV).get(node1) as string;
                const nodes1_set: Set<string> = edges.get(Graph.FWD).get(old_node0) as Set<string>;
                nodes1_set.delete(node1);
            }
            edge_rev.set(node1, node0);
        }
        // add fwd edge from n0 to n1
        const edge_fwd: TGraphEdges2M = edges.get(Graph.FWD) as TGraphEdges2M;
        if (edge_fwd.has(node0)) {
            edge_fwd.get(node0).add( node1 );
        } else {
            edge_fwd.set(node0, new Set([node1]));
        }
    }
    private _addEdgeM2O(node0: string, node1: string, edges: TGraphFREdges, rev: boolean): void {
        // add rev edge from n1 to n0
        if (rev) {
            const edge_rev: TGraphEdges2M = edges.get(Graph.REV) as TGraphEdges2M;
            if (edges.get(Graph.FWD).has(node0)) {
                const old_node1: string = edges.get(Graph.FWD).get(node0) as string;
                const nodes0_set: Set<string> = edges.get(Graph.REV).get(old_node1) as Set<string>;
                nodes0_set.delete(node0);
            }
            if (edge_rev.has(node1)) {
                edge_rev.get(node1).add( node0 );
            } else {
                edge_rev.set(node1, new Set([node0]));
            }
        }
        // add fwd edge from n0 to n1
        const edge_fwd: TGraphEdges2O = edges.get(Graph.FWD) as TGraphEdges2O;
        edge_fwd.set(node0, node1);
    }
    private _addEdgeM2M(node0: string, node1: string, edges: TGraphFREdges, rev: boolean): void {
        // add rev edge from n1 to n0
        if (rev) {
            const edge_rev: TGraphEdges2M = edges.get(Graph.REV) as TGraphEdges2M;
            if (edge_rev.has(node1)) {
                edge_rev.get(node1).add( node0 );
            } else {
                edge_rev.set(node1, new Set([node0]));
            }
        }
        // add fwd edge from n0 to n1
        const edge_fwd: TGraphEdges2M = edges.get(Graph.FWD) as TGraphEdges2M;
        if (edge_fwd.has(node0)) {
            edge_fwd.get(node0).add( node1 );
        } else {
            edge_fwd.set(node0, new Set([node1]));
        }
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Delete the edge from n0 to n1 .
     * @param node0: The name of the start node.
     * @param node1: The name of the end node.
     * @param edge_type: The edge type.
     * @param ssid: Snapshot ID (optional).
     * @returns: True if the edge exists, false otherwise.
     */
     public delEdge(node0: string, node1: string, edge_type: string, ssid: number = null): void {
        if (!this._nodes.has(node0) || !this._nodes.has(node1)) {
            throw new Error('Node does not exist: ' + node0 + ', ' + node1 + '.');
        }
        if (!this._edge_props.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get edges
        const edges = this._edges.get(ssid).get(edge_type);
        // check if edge exists
        if (!edges.get(Graph.FWD).has(node0)) {
            throw new Error('Edge does not exist.');
        }
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        // del fwd edge from n0 to n1
        if (rel === X2X.O2O || rel === X2X.M2O) {
            (edges.get(Graph.FWD) as TGraphEdges2O).delete(node0);
        } else {
            const deleted: boolean = (edges.get(Graph.FWD) as TGraphEdges2M).get(node0).delete(node1); 
            // this may result in emtpy set
            if (!deleted) {
                throw new Error('Edge does not exist.');
            }
        }
        // del rev edge from n1 to n0
        if (rev) {
            if (rel === X2X.O2O || rel === X2X.O2M) {
                (edges.get(Graph.REV) as TGraphEdges2O).delete(node1);
            } else {
                const deleted: boolean = (edges.get(Graph.REV) as TGraphEdges2M).get(node1).delete(node0);
                // this may result in emtpy set
                if (!deleted) {
                    throw new Error('Edge does not exist.');
                }
            }
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
        if (!this._edge_props.has(edge_type)) {
            throw new Error('Edge type does not exist.')
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get edges
        const edges = this._edges.get(ssid).get(edge_type);
        // check if edge exists 
        if (edges === undefined || !edges.get(Graph.FWD).has(node0)) {
            return false;
        }
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        if (rel === X2X.O2O || rel === X2X.M2O) {
            return (edges.get(Graph.FWD) as TGraphEdges2O).get(node0) === node1;
        } else {
            return (edges.get(Graph.FWD) as TGraphEdges2M).get(node0).has(node1);
        }

    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Add an edge type to the graph.
     * @param edge_type: The edge type.
     * @param x2x: Edge relationship, O2O, O2M, M2O, M2M
     */
    public addEdgeType(edge_type: string, x2x: X2X = X2X.M2M, reverse: boolean = true): void {
        if (this._edge_props.has(edge_type)) {
            throw new Error('Edge type already exists.')
        }
        this._edge_props.set(edge_type, {rel: x2x, rev: reverse} );
        // TODO add option to enable/disable reverse edges
    }
    // ---------------------------------------------------------------------------------------------
    /**
     * Return true if the edge type exists .
     * @param edge_type: The edge type.
     * @returns: True if the edge type exists, false otherwise.
     */
    public hasEdgeType(edge_type: string): boolean {
        return this._edge_props.has(edge_type);
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
        const edges_fwd = this._edges.get(ssid).get(edge_type).get(Graph.FWD);
        if (!edges_fwd.has(node)) {
            return [];
        }
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        if (rel === X2X.O2O || rel === X2X.M2O) {
            return [(edges_fwd as TGraphEdges2O).get(node)];
        } else {
            return Array.from((edges_fwd as TGraphEdges2M).get(node));
        }
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
            throw new Error('Node does not exist: ' + node + '.');
        }
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        if (!rev) {
            throw new Error('Edge type has no reverse edges.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // get predecessors
        const edges_rev = this._edges.get(ssid).get(edge_type).get(Graph.REV);
        if (!edges_rev.has(node)) {
            return [];
        }
        
        if (rel === X2X.O2O || rel === X2X.O2M) {
            return [(edges_rev as TGraphEdges2O).get(node)];
        } else {
            return Array.from((edges_rev as TGraphEdges2M).get(node));
        }
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
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        if (!rev) {
            throw new Error('Edge type has no reverse edges.');
        }
        // get ssid
        if (ssid === null) { ssid = this._curr_ssid; }
        // calc reverse degree
        const edges_rev = this._edges.get(ssid).get(edge_type).get(Graph.REV);
        if (!edges_rev.has(node)) {
            return 0;
        }
        if (rel === X2X.O2O || rel === X2X.O2M) {
            return 1;
        } else {
            return (edges_rev as TGraphEdges2M).get(node).size;
        }
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
        const edges_fwd = this._edges.get(ssid).get(edge_type).get(Graph.FWD);
        if (!edges_fwd.has(node)) {
            return 0;
        }
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        if (rel === X2X.O2O || rel === X2X.M2O) {
            return 1;
        } else {
            return (edges_fwd as TGraphEdges2M).get(node).size;
        }
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
     */
    public snapshotCopyEdges(edge_type: string, ssid: number): void {
        const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
        if (!this._edges.get(this._curr_ssid).has(edge_type)) {
            const new_fr_edges: TGraphFREdges = new Map();
            new_fr_edges.set(Graph.FWD, new Map());
            new_fr_edges.set(Graph.REV, new Map());
            this._edges.get(this._curr_ssid).set(edge_type, new_fr_edges);
        }
        // copy forward edges
        let other_edges_fwd = this._edges.get(ssid).get(edge_type).get(Graph.FWD);
        let curr_edges_fwd = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.FWD);
        if (rel === X2X.O2O || rel === X2X.M2O) {
            other_edges_fwd = other_edges_fwd as TGraphEdges2O;
            curr_edges_fwd = curr_edges_fwd as TGraphEdges2O;
            for (const [other_start_node, other_end_node] of other_edges_fwd) {
                if (curr_edges_fwd.has(other_start_node) && 
                        curr_edges_fwd.get(other_start_node) !== other_end_node) {
                    throw new Error('Clash detected: Values are different.');
                } else {
                    curr_edges_fwd.set(other_start_node, other_end_node);
                }
            }
        } else {
            other_edges_fwd = other_edges_fwd as TGraphEdges2M;
            curr_edges_fwd = curr_edges_fwd as TGraphEdges2M;
            for (const [other_node0, other_nodes1_set] of other_edges_fwd) {
                if (curr_edges_fwd.has(other_node0)) {
                    const curr_nodes1_set: Set<string> = curr_edges_fwd.get(other_node0);
                    for (const other_node1 of other_nodes1_set) {
                        curr_nodes1_set.add(other_node1);
                    }
                } else {
                    curr_edges_fwd.set(other_node0, cloneDeep(other_nodes1_set));
                }
            }
        }
        // copy reverse edges
        if (rev) {
            let other_edges_rev = this._edges.get(ssid).get(edge_type).get(Graph.REV);
            let curr_edges_rev = this._edges.get(this._curr_ssid).get(edge_type).get(Graph.REV);
            if (rel === X2X.O2O || rel === X2X.O2M) {
                other_edges_rev = other_edges_rev as TGraphEdges2O;
                curr_edges_rev = curr_edges_rev as TGraphEdges2O;
                for (const [other_node0, other_node1] of other_edges_rev) {
                    if (curr_edges_rev.has(other_node0) && curr_edges_rev.get(other_node0) !== other_node1) {
                        throw new Error('Clash detected: Values are different.');
                    } else {
                        curr_edges_rev.set(other_node0, other_node1);
                    }
                }
            } else {
                other_edges_rev = other_edges_rev as TGraphEdges2M;
                curr_edges_rev = curr_edges_rev as TGraphEdges2M;
                for (const [other_node0, other_nodes1_set] of other_edges_rev) {
                    if (curr_edges_rev.has(other_node0)) {
                        const curr_nodes1_set: Set<string> = curr_edges_rev.get(other_node0);
                        for (const other_node1 of other_nodes1_set) {
                            curr_nodes1_set.add(other_node1);
                        }
                    } else {
                        curr_edges_rev.set(other_node0, cloneDeep(other_nodes1_set));
                    }
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
                const { rel, rev }: EdgeProps = this._edge_props.get(edge_type);
                info += '    EDGE TYPE = ' + edge_type + ', ' + X2X[rel] + ', reverse = ' + rev + '\n';
                for (const [start, end] of fr_edges_map.get(Graph.FWD)) {
                    info += '      FWD EDGE: ' + start + ' -> ';
                    if (end instanceof Set) {
                        info += '[' + Array.from(end).toString() + ']\n';
                    } else {
                        info += end + '\n';
                    }
                }
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
        return info;
    }
}
// =================================================================================================
// END GRAPH CLASS
// =================================================================================================
