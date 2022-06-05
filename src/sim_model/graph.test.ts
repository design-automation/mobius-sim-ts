import { Graph } from './graph';

test('Add nodes', () => {
    const gr: Graph = new Graph();
    gr.addNode('aa');
    gr.addNode('bb');
    gr.addEdgeType('edge_x');
    expect(gr.successors('aa', 'edge_x')).toEqual([]);
});

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
    // expect(gr.toString()).toEqual(['dummy']);
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
    // expect(gr.toString()).toEqual(['dummy']);
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
    // expect(gr.toString()).toEqual(['dummy']);
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
    // expect(gr.toString()).toEqual(['dummy']);
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
    // expect(gr.toString()).toEqual(['dummy']);
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
    // expect(gr.toString()).toEqual(['dummy']);
});

// test('Edges O2O', () => {
//     const gr: Graph = new Graph();
//     gr.addNode('aa');
//     gr.addNode('bb');
//     gr.addNode('cc');
//     gr.addNode('dd');
//     gr.addEdgeType('edge_x', X2X.O2O);
//     gr.addEdge('aa', 'bb', 'edge_x');
//     expect(gr.successors('aa','edge_x')).toEqual(['bb']);
//     expect(gr.predecessors('bb','edge_x')).toEqual(['aa']);
//     gr.addEdge('aa', 'cc', 'edge_x');
//     expect(gr.successors('aa','edge_x')).toEqual(['cc']);
//     expect(gr.predecessors('bb','edge_x')).toEqual([]);
//     expect(gr.predecessors('cc','edge_x')).toEqual(['aa']);
//     gr.delEdge('aa', 'cc', 'edge_x');
//     expect(gr.predecessors('cc','edge_x')).toEqual([]);
//     // expect(gr.toString()).toEqual(['dummy']);
// });

// test('Edges O2M', () => {
//     const gr: Graph = new Graph();
//     gr.addNode('aa');
//     gr.addNode('bb');
//     gr.addNode('cc');
//     gr.addNode('dd');
//     gr.addEdgeType('edge_x', X2X.O2M);
//     gr.addEdge('aa', 'bb', 'edge_x');
//     gr.addEdge('aa', 'cc', 'edge_x');
//     expect(gr.successors('aa','edge_x')).toEqual(['bb', 'cc']);
//     expect(gr.predecessors('bb','edge_x')).toEqual(['aa']);
//     gr.addEdge('dd', 'cc', 'edge_x');
//     gr.delEdge('aa', 'bb', 'edge_x');
//     expect(gr.successors('dd','edge_x')).toEqual(['cc']);
//     expect(gr.predecessors('cc','edge_x')).toEqual(['dd']);
//     // expect(gr.toString()).toEqual(['dummy']);
// });

// test('Edges M2O', () => {
//     const gr: Graph = new Graph();
//     gr.addNode('aa');
//     gr.addNode('bb');
//     gr.addNode('cc');
//     gr.addNode('dd');
//     gr.addEdgeType('edge_x', X2X.M2O);
//     gr.addEdge('aa', 'bb', 'edge_x');
//     gr.addEdge('cc', 'bb', 'edge_x');
//     expect(gr.successors('aa','edge_x')).toEqual(['bb']);
//     expect(gr.predecessors('bb','edge_x')).toEqual(['aa', 'cc']);
//     gr.addEdge('cc', 'dd', 'edge_x');
//     gr.delEdge('aa', 'bb', 'edge_x');
//     expect(gr.successors('cc','edge_x')).toEqual(['dd']);
//     expect(gr.predecessors('dd','edge_x')).toEqual(['cc']);
//     expect(gr.predecessors('bb','edge_x')).toEqual([]);
//     // expect(gr.toString()).toEqual(['dummy']);
// });