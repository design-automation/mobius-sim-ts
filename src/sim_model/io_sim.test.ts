import { Sim, ENT_TYPE, DATA_TYPE, COMPARATOR } from './sim';
import { exportSimData, exportSimFile, importSimData, importSimFile } from './io_sim';

test('Basic import export.', () => {
    const sim: Sim = new Sim();
    importSimFile(sim, 'C:/Users/akiphtj/Documents/Repos/github_da/mobius-sim-ts/src/assets/models/pgons_18.sim');
    //importSimFile(sim, '..\\assets\\models\\pgons_18.sim');
    expect(sim.numEnts(ENT_TYPE.PGONS)).toBe(18);
    const sim_data: object = exportSimData(sim);
    importSimData(sim, sim_data);
    expect(sim.numEnts(ENT_TYPE.PGONS)).toBe(18 * 2);
    const pgons: string[] = sim.getEnts(ENT_TYPE.PGONS);
    const sim_data2: object = exportSimData(sim, pgons[2]);
    //exportSimFile(sim, './test.sim', pgons[2]);
    importSimData(sim, sim_data2);
    expect(sim.numEnts(ENT_TYPE.PGONS)).toBe((18 * 2) + 1);
});