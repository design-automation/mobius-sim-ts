import { Sim, ENT_TYPE, DATA_TYPE, COMPARATOR } from './sim';

test('Basic entity creation.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const point = sim.addPoint(p2);
    const pline = sim.addPline([p0, p1]);
    const pgon = sim.addPgon([p0, p1, p2]);
    const coll = sim.addColl();
    sim.addCollEnt(coll, point);
    sim.addCollEnt(coll, pline);
    sim.addCollEnt(coll, pgon);
    expect(() => sim.addPline([p0])).toThrow();
    expect(() => sim.addPgon([p0, p1])).toThrow();
    expect(sim.getEnts(ENT_TYPE.POSIS)).toEqual(['ps0', 'ps1', 'ps2']);
    expect(sim.getEnts(ENT_TYPE.POINTS)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.PLINES)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGONS)).toEqual(['pg0']);
    expect(sim.getEnts(ENT_TYPE.COLLS)).toEqual(['co0']);
    expect(sim.getEnts(ENT_TYPE.VERTS)).toEqual(['_v0', '_v1', '_v2', '_v3', '_v4', '_v5']);
    expect(sim.getEnts(ENT_TYPE.EDGES)).toEqual(['_e0', '_e1', '_e2', '_e3']);
    expect(sim.getEnts(ENT_TYPE.WIRES)).toEqual(['_w0']);
    expect(sim.getEnts(ENT_TYPE.POINTS, coll)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.PLINES, coll)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGONS, coll)).toEqual(['pg0']);
    expect(sim.getEnts(ENT_TYPE.VERTS, p0)).toEqual(['_v1', '_v3']);
    expect(sim.getEnts(ENT_TYPE.EDGES, p0)).toEqual(['_e0', '_e1', '_e3']);
    expect(sim.getEnts(ENT_TYPE.WIRES, p0)).toEqual(['_w0']);
    expect(sim.getEnts(ENT_TYPE.POINTS, p0)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.PLINES, p0)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGONS, p0)).toEqual(['pg0']);
    expect(sim.getEnts(ENT_TYPE.COLLS, p0)).toEqual(['co0']);
    expect(sim.numEnts(ENT_TYPE.POSIS)).toBe(3);
    expect(sim.numEnts(ENT_TYPE.VERTS)).toBe(6);
    expect(sim.numEnts(ENT_TYPE.EDGES)).toBe(4);
    expect(sim.numEnts(ENT_TYPE.WIRES)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.POINTS)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.PLINES)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.PGONS)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.COLLS)).toBe(1);
});

test('Attributes and queries.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const point = sim.addPoint(p2);
    const pline = sim.addPline([p0, p1]);
    const pgon = sim.addPgon([p0, p1, p2]);
    const coll = sim.addColl();
    sim.addAttrib(ENT_TYPE.POSIS, 'aa', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.POINTS, 'aa', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.PLINES, 'cc', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.PGONS, 'dd', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.COLLS, 'ee', DATA_TYPE.NUM);
    sim.setAttribVal(p0, 'aa', 123);
    sim.setAttribVal(point, 'aa', 123);
    sim.setAttribVal(pline, 'cc', 123);
    sim.setAttribVal(pgon, 'dd', 123);
    sim.setAttribVal(coll, 'ee', 123);
    expect(() => sim.setAttribVal(coll, 'xx', 123)).toThrow();
    expect(() => sim.setAttribVal(coll, 'aa', 123)).toThrow();
    expect(sim.getAttribVal(p0, 'aa')).toBe(123);
    expect(sim.getAttribVal(point, 'aa')).toBe(123);
    expect(sim.getAttribVal(pline, 'cc')).toBe(123);
    expect(sim.getAttribVal(pgon, 'dd')).toBe(123);
    expect(sim.getAttribVal(coll, 'ee')).toBe(123);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 123)).toEqual(['ps0']);
    expect(sim.query(ENT_TYPE.POINTS, 'aa', COMPARATOR.IS_EQUAL, 123)).toEqual(['pt0']);
    expect(sim.query(ENT_TYPE.PLINES, 'cc', COMPARATOR.IS_EQUAL, 123)).toEqual(['pl0']);
    expect(sim.query(ENT_TYPE.PGONS, 'dd', COMPARATOR.IS_EQUAL, 123)).toEqual(['pg0']);
    expect(sim.query(ENT_TYPE.COLLS, 'ee', COMPARATOR.IS_EQUAL, 123)).toEqual(['co0']);
});

test('Overwrite attributes.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    sim.addAttrib(ENT_TYPE.POSIS, 'aa', DATA_TYPE.NUM);
    sim.setAttribVal(p0, 'aa', 123);
    expect(sim.getAttribVal(p0, 'aa')).toBe(123);
    sim.setAttribVal(p0, 'aa', 0);
    expect(sim.getAttribVal(p0, 'aa')).toBe(0);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 123)).toEqual([]);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 0)).toEqual(['ps0']);
});

test('Open and closed polylines.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([1,2,3]);
    const open_pline1 = sim.addPline([p0, p1]);
    const closed_pline = sim.addPline([p0, p1, p2, p0]);
    const open_pline2 = sim.addPline([p0, p1, p2, p3]);
    expect(sim.isPlineClosed(open_pline1)).toBeFalsy();
    expect(sim.isPlineClosed(closed_pline)).toBeTruthy();
    expect(sim.isPlineClosed(open_pline2)).toBeFalsy();
});

test('Queries with strings.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([1,2,3]);
    sim.addAttrib(ENT_TYPE.POSIS, 'aa', DATA_TYPE.STR);
    sim.setAttribVal(p0, 'aa', 'hello');
    sim.setAttribVal(p2, 'aa', 'patrick');
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 'xxx')).toEqual([]);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 'hello')).toEqual(['ps0']);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_NOT_EQUAL, 'hello')).toEqual(['ps1', 'ps2', 'ps3']);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, null)).toEqual(['ps1', 'ps3']);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 'patrick')).toEqual(['ps2']);
    expect(() => sim.setAttribVal(p1, 'aa', 10)).toThrow();
});

test('Queries with numbers.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([1,2,3]);
    sim.addAttrib(ENT_TYPE.POSIS, 'aa', DATA_TYPE.NUM);
    sim.setAttribVal(p0, 'aa', 5);
    sim.setAttribVal(p1, 'aa', 10);
    sim.setAttribVal(p3, 'aa', 15);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_EQUAL, 10)).toEqual(['ps1']);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_NOT_EQUAL, 11)).toEqual(['ps0', 'ps1', 'ps2', 'ps3']);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_GREATER, 8)).toEqual(['ps1', 'ps3']);
    expect(sim.query(ENT_TYPE.POSIS, 'aa', COMPARATOR.IS_LESS_OR_EQUAL, 10)).toEqual(['ps0', 'ps1']);
    expect(() => sim.setAttribVal(p1, 'aa', 'hello')).toThrow();
});

test('Multi attribs same name', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const pt0 = sim.addPoint(p0);
    sim.addAttrib(ENT_TYPE.POSIS, 'msg', DATA_TYPE.STR);
    sim.addAttrib(ENT_TYPE.POINTS, 'msg', DATA_TYPE.STR);
    sim.setAttribVal(p0, 'msg', 'hello');
    sim.setAttribVal(pt0, 'msg', 'hello');
    expect(sim.getAttribs(ENT_TYPE.POSIS)).toEqual(['xyz', 'msg']);
    expect(sim.getAttribs(ENT_TYPE.POINTS)).toEqual(['msg']);
    expect(sim.getAttribVals(ENT_TYPE.POSIS, 'msg')).toEqual(['hello']);
    expect(sim.getAttribVals(ENT_TYPE.POINTS, 'msg')).toEqual(['hello']);
    // expect(sim.toString()).toEqual(['dummy']);
});

test('Polyline with duplicate positions.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([-10, 10, 0]);
    const p1 = sim.addPosi([-10, -10, 0]);
    const p2 = sim.addPosi([0, 0, 0]);
    const p3 = sim.addPosi([10, 10, 0]);
    const p4 = sim.addPosi([10, -10, 0]);
    const pline = sim.addPline( [p0, p1, p2, p3, p4, p2, p0] );
    expect(sim.getEntPosis(pline)).toEqual(['ps0', 'ps1', 'ps2', 'ps3', 'ps4', 'ps2', 'ps0']);
});

test('Nav colls of colls.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([-10, 10, 0]);
    const pt0 = sim.addPoint(p0);
    const coll0 = sim.addColl();
    sim.addCollEnt(coll0, pt0);
    const coll1 = sim.addColl();
    sim.addCollEnt(coll1, coll0);
    const coll2 = sim.addColl();
    sim.addCollEnt(coll2, coll1);
    expect(sim.getEnts(ENT_TYPE.POINTS, coll2)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.COLLS, pt0)).toEqual(['co0', 'co1', 'co2']);
    expect(sim.getEnts(ENT_TYPE.COLLS_S, coll2)).toEqual(['co1', 'co0']);
    expect(sim.getEnts(ENT_TYPE.COLLS_P, coll1)).toEqual(['co2']);
});

test('Pgon with hole posis', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([0,0,0]);
    const p1 = sim.addPosi([10,0,0]);
    const p2 = sim.addPosi([10,10,0]);
    const p3 = sim.addPosi([0,10,0]);
    const pgon = sim.addPgon([p0, p1, p2, p3]);
    const p4 = sim.addPosi([5,5,0]);
    const p5 = sim.addPosi([5,7,0]);
    const p6 = sim.addPosi([7,7,0]);
    const wire = sim.addPgonHole(pgon, [p4, p5, p6]);
    const posis = sim.getEntPosis(pgon);
    expect(posis).toEqual([['ps0', 'ps1', 'ps2', 'ps3'],['ps4', 'ps5', 'ps6']]);
    // expect(sim.toString()).toEqual(['dummy']);
});