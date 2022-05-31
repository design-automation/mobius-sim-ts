import { Graph } from './graph';

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
    gr.addNode('aa', {'p':123, 'q':[1,2,3], 'r':{'one':1, 'two': 2, 'three': 3}});
    const result = gr.getNodeProps('aa');
    expect(result['p']).toBe(123);
    expect(result['q']).toEqual([1,2,3]);
    expect(result['r']).toEqual({'one':1, 'two': 2, 'three': 3});
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