import { Sim, ENT_TYPE, COMPARATOR } from './sim';
import { exportSimData, exportSimFile, importSimData, importSimFile } from './io_sim';

// TODO set up assets folder in jest
const ROOT = 'C:/Users/akiphtj/Documents/Repos/github_da/mobius-sim-ts/src/assets/models/';

test('Basic import export.', () => {
    const sim: Sim = new Sim();
    importSimFile(sim, ROOT + 'pgons_18.sim');
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(18);
    const sim_data: object = exportSimData(sim);
    importSimData(sim, sim_data);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(18 * 2);
    const pgons: string[] = sim.getEnts(ENT_TYPE.PGON);
    const sim_data2: object = exportSimData(sim, pgons[2]);
    importSimData(sim, sim_data2);
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe((18 * 2) + 1);
});

test('Import with create coll.', () => {
    const sim: Sim = new Sim();
    importSimFile(sim, ROOT + 'pgons_18.sim', 'test');
    const coll: string = sim.query(ENT_TYPE.COLL, 'name', COMPARATOR.IS_EQUAL, 'test')[0];
    const coll_pgons: string[] = sim.getEnts(ENT_TYPE.PGON, coll);
    expect(coll_pgons.length).toBe(18);
});

test('Import assorted.', () => {
    const sim: Sim = new Sim();
    importSimFile(sim, ROOT + 'assorted.sim', 'test');
    const coll: string = sim.query(ENT_TYPE.COLL, 'name', COMPARATOR.IS_EQUAL, 'test')[0];
    const coll_points: string[] = sim.getEnts(ENT_TYPE.POINT, coll);
    expect(coll_points.length).toBe(1);
    const coll_plines: string[] = sim.getEnts(ENT_TYPE.PLINE, coll);
    expect(coll_plines.length).toBe(2);
    const coll_pgons: string[] = sim.getEnts(ENT_TYPE.PGON, coll);
    expect(coll_pgons.length).toBe(1);
});

test('Import 2 files.', () => {
    const sim: Sim = new Sim();
    importSimFile(sim, ROOT + 'assorted.sim', 'test1');
    importSimFile(sim, ROOT + 'pgons_18.sim', 'test2');
    expect(sim.numEnts(ENT_TYPE.PGON)).toBe(19);
    exportSimFile(sim, 'test1.sim');
});

// SLOW
// test('Import gg test1.', () => {
//     const sim: Sim = new Sim();
//     importSimFile(sim, ROOT + 'gg_test1.sim');
//     // exportSimFile(sim, 'test1.sim');
//     expect(sim.numEnts(ENT_TYPE.PGONS)).toBe(1171);
// });

// SLOW
// test('Import gg test2.', () => {
//     const sim: Sim = new Sim();
//     importSimFile(sim, ROOT + 'gg_test2.sim');
//     // exportSimFile(sim, 'test2.sim');
//     expect(sim.numEnts(ENT_TYPE.PGONS)).toBe(4016);
// });