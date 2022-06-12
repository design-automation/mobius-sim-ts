import { Sim, ENT_TYPE, COMPARATOR, TEntSets, DATA_TYPE } from './sim'
import { readFileSync, writeFileSync } from 'fs';
// ==================================================================================================
// Functions for importing and exporting models in the SIM file format.
// ==================================================================================================
// entity attribs
const ent_types: [ENT_TYPE, string][] = [
    [ENT_TYPE.POSI,'posis'],
    [ENT_TYPE.VERT,'verts'],
    [ENT_TYPE.EDGE,'edges'],
    [ENT_TYPE.WIRE,'wires'],
    [ENT_TYPE.POINT,'points'],
    [ENT_TYPE.PLINE,'plines'],
    [ENT_TYPE.PGON,'pgons'],
    [ENT_TYPE.COLL,'colls']
];
/**
 * Return JSON representing that data in the SIM model.
 * @param sim_model 
 * @returns JSON data.
 */
export function exportSimData(sim_model: Sim, ents: string|string[] = null): object {
    const ents_i_map: Map<ENT_TYPE,  Map<string, number>> = new Map();
    if (ents === null) {
        for (const [ent_type, _] of ent_types) {
            // create maps for entity name -> entity index
            ents_i_map.set(ent_type, new Map(sim_model.getEnts(ent_type).map((ent, i) => [ent, i])));
        }
    } else {
        // a set to store all posis
        const ent_sets: TEntSets = sim_model.getSubEnts(ents);
        for (const [ent_type, _] of ent_types) {
            // create maps for entity name -> entity index
            ents_i_map.set(ent_type, new Map(
                Array.from(ent_sets.get(ent_type)).map((ent, i) => [ent, i])));
        }
    }
    // create the geometry data
    const geometry = {
        'num_posis': ents_i_map.get(ENT_TYPE.POSI).size,
        'points': [],
        'plines': [],
        'pgons': [],
        'coll_points': [],
        'coll_plines': [],
        'coll_pgons':  [],
        'coll_colls': []
    }
    for (const point_ent of ents_i_map.get(ENT_TYPE.POINT).keys()) {
        const posi: string = sim_model.getEntPosis(point_ent) as string;
        geometry['points'].push(ents_i_map.get(ENT_TYPE.POSI).get(posi));
    }
    for (const pline_ent of ents_i_map.get(ENT_TYPE.PLINE).keys()) {
        const posis: string[]  = sim_model.getEntPosis(pline_ent) as string[];
        geometry['plines'].push(posis.map(posi => ents_i_map.get(ENT_TYPE.POSI).get(posi)));
    }
    for (const pgon_ent of ents_i_map.get(ENT_TYPE.PGON).keys()) {
        const posis: string[][] = sim_model.getEntPosis(pgon_ent) as string[][];
        geometry['pgons'].push(posis.map(w_posis => w_posis.map(posi => ents_i_map.get(ENT_TYPE.POSI).get(posi))));
    }
    for (const coll_ent of ents_i_map.get(ENT_TYPE.COLL).keys()) {
        // points
        const coll_points: string[] = sim_model.getEnts(ENT_TYPE.POINT, coll_ent);
        geometry['coll_points'].push(coll_points.map(coll_point => ents_i_map.get(ENT_TYPE.POINT).get(coll_point)));
        // plines
        const coll_plines: string[] = sim_model.getEnts(ENT_TYPE.PLINE, coll_ent);
        geometry['coll_plines'].push(coll_plines.map(coll_pline => ents_i_map.get(ENT_TYPE.PLINE).get(coll_pline)));
        // pgons
        const coll_pgons: string[] = sim_model.getEnts(ENT_TYPE.PGON, coll_ent);
        geometry['coll_pgons'].push(coll_pgons.map(coll_pgon => ents_i_map.get(ENT_TYPE.PGON).get(coll_pgon)));
        // colls
        const coll_colls: string[] = sim_model.getEnts(ENT_TYPE.COLL, coll_ent);
        geometry['coll_colls'].push(coll_colls.map(coll_coll => ents_i_map.get(ENT_TYPE.COLL).get(coll_coll)));
    }
    // create the attribute data
    function _attribData(ent_type: ENT_TYPE, ents_dict: Map<string, number>) {
        const attribs_data: object[] = []
        for (const att_name of sim_model.getAttribs(ent_type)) {
            const data: object = {};
            data['name'] = att_name
            data['data_type'] = sim_model.getAttribDatatype(ent_type, att_name)
            data['values'] = []
            data['entities'] = []
            for (const att_val of sim_model.getAttribVals(ent_type, att_name)) {
                let att_ents: string[] = sim_model.query(ent_type, att_name, COMPARATOR.IS_EQUAL, att_val);
                if (ents !== null) {
                    att_ents = att_ents.filter( ent => ents_i_map.get(ent_type).has(ent) );
                }
                if (att_ents.length === 0) { continue; }
                data['values'].push(att_val);
                const ents_i = att_ents.map(ent => ents_dict.get(ent));
                data['entities'].push(ents_i);
            }
            attribs_data.push(data);
        }
        return attribs_data;
    }
    const attributes = {
        'posis': _attribData(ENT_TYPE.POSI, ents_i_map.get(ENT_TYPE.POSI)),
        'verts': _attribData(ENT_TYPE.VERT, ents_i_map.get(ENT_TYPE.VERT)),
        'edges': _attribData(ENT_TYPE.EDGE, ents_i_map.get(ENT_TYPE.EDGE)),
        'wires': _attribData(ENT_TYPE.WIRE, ents_i_map.get(ENT_TYPE.WIRE)),
        'points': _attribData(ENT_TYPE.POINT, ents_i_map.get(ENT_TYPE.POINT)),
        'plines': _attribData(ENT_TYPE.PLINE, ents_i_map.get(ENT_TYPE.PLINE)),
        'pgons': _attribData(ENT_TYPE.PGON, ents_i_map.get(ENT_TYPE.PGON)),
        'colls': _attribData(ENT_TYPE.COLL, ents_i_map.get(ENT_TYPE.COLL)),
        'model': sim_model.getModelAttribs().map(att_name => 
            [att_name, sim_model.getModelAttribVal(att_name)])
    }
    // create the json
    const data: object = {
        'type': 'SIM',
        'version': '0.1',
        'geometry': geometry,
        'attributes': attributes
    };
    // console.log(">>>>", JSON.stringify(data))
    return data;
}
// ----------------------------------------------------------------------------------------------
/**
 * Return a JSON formatted string representing that data in the model.
 * @param sim_model 
 * @returns A JSON string in the SIM format.
 */
export function exportSim(sim_model: Sim, ents: string|string[] = null): string {
    return JSON.stringify(exportSimData(sim_model, ents));
}
// ----------------------------------------------------------------------------------------------
/**
 * Save a SIM file.
 * @param sim_model 
 * @param filepath 
 */
export function exportSimFile(sim_model: Sim, filepath: string, ents: string|string[] = null): void {
    writeFileSync(filepath, JSON.stringify(exportSimData(sim_model, ents)));
    console.log('Exporting file successful.');
}
// ==================================================================================================
// IMPORT
// ==================================================================================================
/**
 * Import SIM JSON data.
 * @param sim_model 
 * @param json_data 
 */
export function importSimData(sim_model: Sim, json_data: object, coll_name: string = null): void {
    // check we have the right data
    if (json_data['type'] !== 'SIM') {
        throw new Error('Data is not a SIM model');
    }
    if (json_data['version'] !== '0.1') {
        throw new Error('SIM Data is wrong version.' +
        'Version should be 0.1. This data is version ' + json_data['version'] + '.');
    }
    // get current num entities
    const num_ents: Map<ENT_TYPE, number> = new Map([
        [ENT_TYPE.POSI, sim_model.numEnts(ENT_TYPE.POSI)],
        [ENT_TYPE.VERT, sim_model.numEnts(ENT_TYPE.VERT)],
        [ENT_TYPE.EDGE, sim_model.numEnts(ENT_TYPE.EDGE)],
        [ENT_TYPE.WIRE, sim_model.numEnts(ENT_TYPE.WIRE)],
        [ENT_TYPE.POINT, sim_model.numEnts(ENT_TYPE.POINT)],
        [ENT_TYPE.PLINE, sim_model.numEnts(ENT_TYPE.PLINE)],
        [ENT_TYPE.PGON, sim_model.numEnts(ENT_TYPE.PGON)],
        [ENT_TYPE.COLL, sim_model.numEnts(ENT_TYPE.COLL)]
    ]);
    // create coll
    let imp_coll: string = null;
    if (coll_name !== null) {
        imp_coll = sim_model.addColl();
        if (!sim_model.hasAttrib(ENT_TYPE.COLL, 'name')) {
            sim_model.addAttrib(ENT_TYPE.COLL, 'name', DATA_TYPE.STR);

        }
        sim_model.setAttribVal(imp_coll, 'name', coll_name);
    }
    // posis
    const posis: string[] = []
    for (let i = 0; i < json_data['geometry']['num_posis']; i++) {
        posis.push(sim_model.addPosi([0,0,0]));
    }
    // points
    for (const posi_i of json_data['geometry']['points']) {
        const point: string = sim_model.addPoint(posis[posi_i]);
        if (imp_coll !== null) { sim_model.addCollEnt(imp_coll, point); }
    }
    // polylines
    for (const posis_i of json_data['geometry']['plines']) {
        const pline: string = sim_model.addPline((posis_i as string[]).map(posi_i => posis[posi_i]));
        if (imp_coll !== null) { sim_model.addCollEnt(imp_coll, pline); }
    }
    // polygons
    for (const posis_i of json_data['geometry']['pgons']) {
        const pgon: string = sim_model.addPgon((posis_i[0] as string[]).map( posi_i => posis[posi_i]));
        for (let i = 1; i < posis_i.length; i++) {
            // TODO add holes
            // sim_model.addPgonHole(pgon, (posis_i[i] as string[]).map( posi_i => posis[posi_i]));
        }
        if (imp_coll !== null) { sim_model.addCollEnt(imp_coll, pgon); }
    }
    // collections
    const num_colls: number = json_data['geometry']['coll_points'].length;
    for (let i = 0; i < num_colls; i++) {
        const coll = sim_model.addColl();
        for (const point_i of json_data['geometry']['coll_points'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.POINT + (num_ents.get(ENT_TYPE.POINT) + point_i));
        }
        for (const pline_i of json_data['geometry']['coll_plines'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.PLINE + (num_ents.get(ENT_TYPE.PLINE) + pline_i));
        }
        for (const pgon_i of json_data['geometry']['coll_pgons'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.PGON + (num_ents.get(ENT_TYPE.PGON) + pgon_i));
        }
        for (const child_coll_i of json_data['geometry']['coll_colls'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.COLL + (num_ents.get(ENT_TYPE.COLL) + child_coll_i));
        }
        if (imp_coll !== null) { sim_model.addCollEnt(imp_coll, coll); }
    }
    for (const [ent_type, ent_name] of ent_types) {
        for (const attrib of json_data['attributes'][ent_name]) {
            let att_name: string = attrib['name'];
            if (sim_model.hasAttrib(ent_type, att_name)) { 
                if (attrib['data_type'] != sim_model.getAttribDatatype(ent_type, att_name)) {
                    // if attrib already exists but with different datatype, then rename attrib
                    att_name = att_name + '_' + attrib['data_type'];
                }
            } else {
                sim_model.addAttrib(ent_type, att_name, attrib['data_type']);
            }
            for (let i = 0; i < attrib['values'].length; i++) {
                const att_value = attrib['values'][i];
                for (const ent_i of attrib['entities'][i]) {
                    const ent: string = ent_type + (num_ents.get(ent_type) + ent_i);
                    sim_model.setAttribVal(ent, att_name, att_value);
                }
            }
        }
    }
    // model attributes
    for (const [att_name, att_val] of json_data['attributes']['model']) {
        sim_model.setModelAttribVal(att_name, att_val)
    }
}
// ----------------------------------------------------------------------------------------------
/**
 * Import SIM string.
 * @param sim_model 
 * @param json_str 
 * @returns 
 */
export function importSim(sim_model: Sim, json_str: string, coll_name: string = null): void {  
    const json_data = JSON.parse(json_str);
    importSimData(sim_model, json_data, coll_name);
}
// ----------------------------------------------------------------------------------------------
/**
 * Import SIM file.
 * @param sim_model 
 * @param filepath 
 * @returns 
 */
export function importSimFile(sim_model: Sim, filepath: string, coll_name: string = null): void {
    const json_str: string = readFileSync(filepath, 'utf-8');
    importSim(sim_model, json_str, coll_name);
    console.log('Importing file successful.');
}
// ==================================================================================================
