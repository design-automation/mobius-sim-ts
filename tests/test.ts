import { Graph } from '../sim_model/graph';

console.log('Start testing...');
const gr: Graph = new Graph();
gr.addNode('aa', new Map());
gr.addNode('bb', new Map());
gr.addEdgeType('edge_c', Graph.O2O);
gr.addEdge('bb', 'bb', 'edge_c');
console.log('End testing...');