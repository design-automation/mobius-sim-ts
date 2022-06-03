import { Graph, X2X } from './graph';

test('Add and has nodes and edges', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addEdgeType('edge_x');
    gr.addEdge('aa', 'bb', 'edge_x');
    expect(gr.hasNode('aa')).toBeTruthy();
    expect(gr.hasNode('bb')).toBeTruthy();
    expect(gr.hasNode('cc')).toBeFalsy();
    expect(gr.hasEdgeType('edge_x')).toBeTruthy();
    expect(gr.hasEdgeType('edge_y')).toBeFalsy();
    expect(gr.hasEdge('aa', 'bb', 'edge_x')).toBeTruthy();
    expect(gr.hasEdge('bb', 'aa', 'edge_x')).toBeFalsy();
    expect(() => gr.hasEdge('aa', 'cc', 'edge_x')).toThrow();
    expect(() => gr.hasEdge('aa', 'bb', 'edge_y')).toThrow();
});

test('Node props', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.setNodeProp('aa', 'p', 123);
    gr.setNodeProp('aa', 'q', [1,2,3]);
    gr.setNodeProp('aa', 'r', {'one':1, 'two': 2, 'three': 3});
    expect(gr.getNodeProp('aa', 'p')).toBe(123);
    expect(gr.getNodeProp('aa', 'q')).toEqual([1,2,3]);
    expect(gr.getNodeProp('aa', 'r')).toEqual({'one':1, 'two': 2, 'three': 3});
});

test('Get edges', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addNode('cc');
    gr.addNode('dd');
    gr.addEdgeType('edge_x');
    gr.addEdge('aa', 'bb', 'edge_x');
    gr.addEdge('aa', 'cc', 'edge_x');
    gr.addEdge('bb', 'dd', 'edge_x');
    gr.addEdge('cc', 'dd', 'edge_x');
    expect(gr.hasEdge('aa', 'bb', 'edge_x')).toBeTruthy();
    expect(gr.hasEdge('aa', 'cc', 'edge_x')).toBeTruthy();
    expect(gr.getNodesWithOutEdge('edge_x')).toEqual(['aa', 'bb', 'cc']);
    expect(gr.getNodesWithInEdge('edge_x')).toEqual(['bb', 'cc', 'dd']);
    expect(gr.getNodesWithOutEdge('edge_x')).toEqual(['aa', 'bb', 'cc']);
    expect(gr.successors('aa', 'edge_x')).toEqual(['bb', 'cc']);
    expect(gr.predecessors('dd', 'edge_x')).toEqual(['bb', 'cc']);
    expect(gr.predecessors('bb', 'edge_x')).toEqual(['aa']);
    expect(gr.successors('bb', 'edge_x')).toEqual(['dd']);
    expect(gr.degree('aa', 'edge_x')).toBe(2);
    expect(gr.degree('bb', 'edge_x')).toBe(2);
    expect(gr.degree('dd', 'edge_x')).toBe(2);
    expect(gr.degreeOut('aa', 'edge_x')).toBe(2);
    expect(gr.degreeIn('aa', 'edge_x')).toBe(0);
});

test('Node props', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addEdgeType('edge_x');
    gr.addEdge('aa', 'bb', 'edge_x');
    expect(gr.hasEdge('aa', 'bb', 'edge_x')).toBeTruthy();
    gr.delEdge('aa', 'bb', 'edge_x');
    expect(gr.hasEdge('aa', 'bb', 'edge_x')).toBeFalsy();
    gr.addEdge('aa', 'bb', 'edge_x');
    expect(gr.hasEdge('aa', 'bb', 'edge_x')).toBeTruthy();
});

test('Create snapshots', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addEdgeType('edge_x');
    gr.addEdge('aa', 'bb', 'edge_x');
    const ssid0 = gr.getActiveSnapshot();
    const ssid1 = gr.newSnapshot(ssid0);
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid0)).toBeTruthy();
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid1)).toBeTruthy();
    gr.delEdge('aa', 'bb', 'edge_x');
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid0)).toBeTruthy();
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid1)).toBeFalsy();
});

test('Merge snapshots', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addNode('cc');
    gr.addEdgeType('edge_x');
    gr.addEdge('aa', 'bb', 'edge_x');
    const ssid0 = gr.getActiveSnapshot();
    const ssid1 = gr.newSnapshot();
    gr.addEdge('aa', 'cc', 'edge_x');
    const ssid2 = gr.newSnapshot(ssid0);
    gr.snapshotCopyEdges('edge_x', ssid1);
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid2)).toBeTruthy();
    expect(gr.hasEdge('aa', 'cc', 'edge_x', ssid2)).toBeTruthy();
    gr.delEdge('aa', 'bb', 'edge_x');
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid0)).toBeTruthy();
    expect(gr.hasEdge('aa', 'cc', 'edge_x', ssid1)).toBeTruthy();
    expect(gr.hasEdge('aa', 'bb', 'edge_x', ssid1)).toBeFalsy();
    expect(gr.hasEdge('aa', 'cc', 'edge_x', ssid0)).toBeFalsy();
});

test('x2x', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addNode('cc');
    gr.addNode('dd');
    gr.addEdgeType('edge_x', X2X.O2O);
    gr.addEdge('aa', 'bb', 'edge_x');
    expect(() => gr.addEdge('aa', 'cc', 'edge_x')).toThrow();
});