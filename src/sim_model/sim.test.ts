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
    expect(sim.getEnts(ENT_TYPE.POSI)).toEqual(['ps0', 'ps1', 'ps2']);
    expect(sim.getEnts(ENT_TYPE.POINT)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.PLINE)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGON)).toEqual(['pg0']);
    expect(sim.getEnts(ENT_TYPE.COLL)).toEqual(['co0']);
    expect(sim.getEnts(ENT_TYPE.VERT)).toEqual(['_v0', '_v1', '_v2', '_v3', '_v4']);
    expect(sim.getEnts(ENT_TYPE.EDGE)).toEqual(['_e0', '_e1', '_e2', '_e3']);
    expect(sim.getEnts(ENT_TYPE.WIRE)).toEqual(['_w0']);
    expect(sim.getEnts(ENT_TYPE.POINT, coll)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.PLINE, coll)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGON, coll)).toEqual(['pg0']);
    expect(sim.getEnts(ENT_TYPE.VERT, p0)).toEqual(['_v0', '_v2']);
    expect(sim.getEnts(ENT_TYPE.EDGE, p0)).toEqual(['_e0','_e3','_e1']);
    expect(sim.getEnts(ENT_TYPE.WIRE, p0)).toEqual(['_w0']);
    expect(sim.getEnts(ENT_TYPE.POINT, p0)).toEqual([]);
    expect(sim.getEnts(ENT_TYPE.PLINE, p0)).toEqual(['pl0']);
    expect(sim.getEnts(ENT_TYPE.PGON, p0)).toEqual(['pg0']);
    expect(sim.getEnts(ENT_TYPE.COLL, p0)).toEqual(['co0']);
    expect(sim.numEnts(ENT_TYPE.POSI)).toBe(3);
    expect(sim.numEnts(ENT_TYPE.VERT)).toBe(5);
    expect(sim.numEnts(ENT_TYPE.EDGE)).toBe(4);
    expect(sim.numEnts(ENT_TYPE.WIRE)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.POINT)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.PLINE)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(1);
    expect(sim.numEnts(ENT_TYPE.COLL)).toBe(1);
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
    sim.addAttrib(ENT_TYPE.POSI, 'aa', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.POINT, 'aa', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.PLINE, 'cc', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.PGON, 'dd', DATA_TYPE.NUM);
    sim.addAttrib(ENT_TYPE.COLL, 'ee', DATA_TYPE.NUM);
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
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 123)).toEqual(['ps0']);
    expect(sim.query(ENT_TYPE.POINT, 'aa', COMPARATOR.IS_EQUAL, 123)).toEqual(['pt0']);
    expect(sim.query(ENT_TYPE.PLINE, 'cc', COMPARATOR.IS_EQUAL, 123)).toEqual(['pl0']);
    expect(sim.query(ENT_TYPE.PGON, 'dd', COMPARATOR.IS_EQUAL, 123)).toEqual(['pg0']);
    expect(sim.query(ENT_TYPE.COLL, 'ee', COMPARATOR.IS_EQUAL, 123)).toEqual(['co0']);
});

test('Overwrite attributes.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    sim.addAttrib(ENT_TYPE.POSI, 'aa', DATA_TYPE.NUM);
    sim.setAttribVal(p0, 'aa', 123);
    expect(sim.getAttribVal(p0, 'aa')).toBe(123);
    sim.setAttribVal(p0, 'aa', 0);
    expect(sim.getAttribVal(p0, 'aa')).toBe(0);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 123)).toEqual([]);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 0)).toEqual(['ps0']);
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
    sim.addAttrib(ENT_TYPE.POSI, 'aa', DATA_TYPE.STR);
    sim.setAttribVal(p0, 'aa', 'hello');
    sim.setAttribVal(p2, 'aa', 'patrick');
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 'xxx')).toEqual([]);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 'hello')).toEqual(['ps0']);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_NOT_EQUAL, 'hello')).toEqual(['ps1', 'ps2', 'ps3']);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, null)).toEqual(['ps1', 'ps3']);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 'patrick')).toEqual(['ps2']);
    expect(() => sim.setAttribVal(p1, 'aa', 10)).toThrow();
});

test('Queries with numbers.', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const p3 = sim.addPosi([1,2,3]);
    sim.addAttrib(ENT_TYPE.POSI, 'aa', DATA_TYPE.NUM);
    sim.setAttribVal(p0, 'aa', 5);
    sim.setAttribVal(p1, 'aa', 10);
    sim.setAttribVal(p3, 'aa', 15);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_EQUAL, 10)).toEqual(['ps1']);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_NOT_EQUAL, 11)).toEqual(['ps0', 'ps1', 'ps2', 'ps3']);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_GREATER, 8)).toEqual(['ps1', 'ps3']);
    expect(sim.query(ENT_TYPE.POSI, 'aa', COMPARATOR.IS_LESS_OR_EQUAL, 10)).toEqual(['ps0', 'ps1']);
    expect(() => sim.setAttribVal(p1, 'aa', 'hello')).toThrow();
});

test('Multi attribs same name', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const pt0 = sim.addPoint(p0);
    sim.addAttrib(ENT_TYPE.POSI, 'msg', DATA_TYPE.STR);
    sim.addAttrib(ENT_TYPE.POINT, 'msg', DATA_TYPE.STR);
    sim.setAttribVal(p0, 'msg', 'hello');
    sim.setAttribVal(pt0, 'msg', 'hello');
    expect(sim.getAttribs(ENT_TYPE.POSI)).toEqual(['xyz', 'msg']);
    expect(sim.getAttribs(ENT_TYPE.POINT)).toEqual(['msg']);
    expect(sim.getAttribVals(ENT_TYPE.POSI, 'msg')).toEqual(['hello']);
    expect(sim.getAttribVals(ENT_TYPE.POINT, 'msg')).toEqual(['hello']);
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
    expect(sim.getEnts(ENT_TYPE.POINT, coll2)).toEqual(['pt0']);
    expect(sim.getEnts(ENT_TYPE.COLL, pt0)).toEqual(['co0', 'co1', 'co2']);
    expect(sim.getEnts(ENT_TYPE.COLL_SUCC, coll2)).toEqual(['co1', 'co0']);
    expect(sim.getEnts(ENT_TYPE.COLL_PRED, coll1)).toEqual(['co2']);
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

test('Copy some objects', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const point = sim.addPoint(p2);
    const pline = sim.addPline([p0, p1]);
    const pgon = sim.addPgon([p0, p1, p2]);
    const result = sim.copyEnts([point, pline, pgon]);
    expect(result).toEqual(['pt1', 'pl1', 'pg1']);
    expect(sim.numEnts(ENT_TYPE.POSI)).toBe(6);
    expect(sim.getPosiCoords(sim.getEnts(ENT_TYPE.POSI, 'pt1')[0])).toEqual([0,0,0]);

});

test('Copy some objects and move', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([1,2,3]);
    const p1 = sim.addPosi([9,8,7]);
    const p2 = sim.addPosi([0,0,0]);
    const point = sim.addPoint(p2);
    const pline = sim.addPline([p0, p1]);
    const pgon = sim.addPgon([p0, p1, p2]);
    const result = sim.copyEnts([point, pline, pgon], [10, 0, 0]);
    expect(result).toEqual(['pt1', 'pl1', 'pg1']);
    expect(sim.numEnts(ENT_TYPE.POSI)).toBe(6);
    expect(sim.getPosiCoords(sim.getEnts(ENT_TYPE.POSI, 'pt1')[0])).toEqual([10,0,0]);
})

test('Pgon tris', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([0,0,0]);
    const p1 = sim.addPosi([10,0,0]);
    const p2 = sim.addPosi([10,10,0]);
    const p3 = sim.addPosi([0,10,0]);
    const pgon = sim.addPgon([p0, p1, p2, p3]);
    expect(sim.numEnts(ENT_TYPE.TRI)).toBe(2);
    expect(sim.getEnts(ENT_TYPE.TRI, 'pg0')).toEqual(['_t0', '_t1']);
    expect(sim.getEnts(ENT_TYPE.TRI, 'ps0')).toEqual(['_t0']);
});

test('Copy posi with attribs', () => {
    const sim: Sim = new Sim();
    const p0 = sim.addPosi([0,0,0]);
    sim.addAttrib(ENT_TYPE.POSI, 'test', DATA_TYPE.STR);
    sim.setAttribVal(p0, 'test', 'hello');
    const p1 = sim.copyEnts([p0])[0];
    expect(sim.getAttribVal(p1, 'test')).toBe('hello');
});