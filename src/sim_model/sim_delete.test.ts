import { Sim, ENT_TYPE, DATA_TYPE, COMPARATOR } from './sim';

test('Basic entity deletion.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const point = sim.addPoint(p2);
    const pline = sim.addPline([p0, p1]);
    const pgon = sim.addPgon([p0, p1, p2]);
    const coll = sim.addColl();
    sim.addCollEnt(coll, point);
    sim.addCollEnt(coll, pline);
    sim.addCollEnt(coll, pgon);
    sim.delEnts([point, pline, pgon, coll]);
    // expect(sim.toString()).toEqual(['dummy']);
    expect(sim.getEnts(ENT_TYPE.POSI)).toEqual(['ps3']);
    expect(sim.getEnts(ENT_TYPE.VERT)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.EDGE)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.WIRE)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.POINT)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.PLINE)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.PGON)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.COLL)).toEqual([]);
    expect(sim.numEnts(ENT_TYPE.POSI)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.VERT)).toBe(0);
    expect(sim.numEnts(ENT_TYPE.EDGE)).toBe(0);
    expect(sim.numEnts(ENT_TYPE.WIRE)).toBe(0);
    expect(sim.numEnts(ENT_TYPE.POINT)).toBe(0);
    expect(sim.numEnts(ENT_TYPE.PLINE)).toBe(0);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(0);
    expect(sim.numEnts(ENT_TYPE.COLL)).toBe(0);
    expect(sim.query(ENT_TYPE.POSI, 'xyz', COMPARATOR.IS_EQUAL, [1,2,3])).toEqual([]);
    expect(sim.query(ENT_TYPE.POSI, 'xyz', COMPARATOR.IS_EQUAL, [9,9,9])).toEqual(['ps3']);
});

test('Delete verts of open pline.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const pline = sim.addPline([p0, p1, p2, p3]);
    sim.delEnts([p2]);
    expect(sim.getEnts(ENT_TYPE.POSI, pline)).toEqual(['ps0','ps1','ps3']);
    sim.delEnts([p0]);
    expect(sim.getEnts(ENT_TYPE.POSI, pline)).toEqual(['ps1','ps3']);
    sim.delEnts([p3]);
    expect(sim.numEnts(ENT_TYPE.PLINE)).toBe(0);
});

test('Delete multiple verts at open pline start.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const pline = sim.addPline([p0, p1, p2, p3]);
    sim.delEnts([p0, p1]);
    // expect(sim.toString()).toEqual(['dummy']);
    expect(sim.getEnts(ENT_TYPE.POSI, pline)).toEqual(['ps2','ps3']);
});

test('Delete multiple verts at open pline start rev.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const pline = sim.addPline([p0, p1, p2, p3]);
    sim.delEnts([p1, p0]);
    // expect(sim.toString()).toEqual(['dummy']);
    expect(sim.getEnts(ENT_TYPE.POSI, pline)).toEqual(['ps2','ps3']);
});

test('Delete multiple verts at open pline end.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const pline = sim.addPline([p0, p1, p2, p3]);
    sim.delEnts([p3, p2]);
    // expect(sim.toString()).toEqual(['dummy']);
    expect(sim.getEnts(ENT_TYPE.POSI, pline)).toEqual(['ps0','ps1']);
});

test('Delete multiple verts at open pline end rev.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const pline = sim.addPline([p0, p1, p2, p3]);
    sim.delEnts([p2, p3]);
    // expect(sim.toString()).toEqual(['dummy']);
    expect(sim.getEnts(ENT_TYPE.POSI, pline)).toEqual(['ps0','ps1']);
});

test('Delete verts of pgon.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const pgon = sim.addPgon([p0, p1, p2, p3]);
    sim.delEnts([p2]);
    expect(sim.getEnts(ENT_TYPE.POSI, pgon)).toEqual(['ps0','ps1','ps3']);
    // expect(sim.toString()).toEqual(['dummy']);
    sim.delEnts([p0]);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(0);
});

test('Delete multiple verts of pgon.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const p4 = sim.addPosi([5,4,3]);
    const pgon = sim.addPgon([p0, p1, p2, p3, p4]);
    sim.delEnts([p4, p0]);
    expect(sim.getEnts(ENT_TYPE.POSI, pgon)).toEqual(['ps1','ps2','ps3']);
    // expect(sim.toString()).toEqual(['dummy']);
    sim.delEnts([p1]);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(0);
});

test('Delete multiple verts of pgon.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const p4 = sim.addPosi([5,4,3]);
    const pgon = sim.addPgon([p0, p1, p2, p3, p4]);
    sim.delEnts([p1, p0]);
    expect(sim.getEnts(ENT_TYPE.POSI, pgon)).toEqual(['ps2','ps3','ps4']);
    // expect(sim.toString()).toEqual(['dummy']);
    sim.delEnts([p4]);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(0);
});

test('Delete invert.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([9,9,9]);
    const point = sim.addPoint(p0);
    const pline = sim.addPline([p0, p1]);
    const pgon = sim.addPgon([p0, p1, p2]);
    const coll = sim.addColl();
    sim.addCollEnt(coll, pline);
    sim.delEnts([point, coll], true);
    // expect(sim.toString()).toEqual(['dummy']);
    expect(sim.getEnts(ENT_TYPE.POSI)).toEqual(['ps0', 'ps1']);
    expect(sim.getEnts(ENT_TYPE.POINT)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.PLINE)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGON)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.COLL)).toEqual(['co0']);
});