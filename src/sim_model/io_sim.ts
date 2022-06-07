import { Sim, ENT_TYPE, COMPARATOR, TEntSets } from './sim'
import { readFileSync, writeFileSync } from 'fs';
// ==================================================================================================
// Functions for importing and exporting models in the SIM file format.
// ==================================================================================================
// entity attribs
const ent_types: [ENT_TYPE, string][] = [
    [ENT_TYPE.POSIS,'posis'],
    [ENT_TYPE.VERTS,'verts'],
    [ENT_TYPE.EDGES,'edges'],
    [ENT_TYPE.WIRES,'wires'],
    [ENT_TYPE.POINTS,'points'],
    [ENT_TYPE.PLINES,'plines'],
    [ENT_TYPE.PGONS,'pgons'],
    [ENT_TYPE.COLLS,'colls']
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
            ents_i_map.set(ent_type, new Map(ent_sets.get(ent_type).map((ent, i) => [ent, i])));
        }
    }
    // create the geometry data
    const geometry = {
        'num_posis': ents_i_map.get(ENT_TYPE.POSIS).size,
        'points': [],
        'plines': [],
        'pgons': [],
        'coll_points': [],
        'coll_plines': [],
        'coll_pgons':  [],
        'coll_colls': []
    }
    for (const point_ent of ents_i_map.get(ENT_TYPE.POINTS).keys()) {
        const posi: string = sim_model.getEntPosis(point_ent) as string;
        geometry['points'].push(ents_i_map.get(ENT_TYPE.POSIS).get(posi));
    }
    for (const pline_ent of ents_i_map.get(ENT_TYPE.PLINES).keys()) {
        const posis: string[]  = sim_model.getEntPosis(pline_ent) as string[];
        geometry['plines'].push(posis.map(posi => ents_i_map.get(ENT_TYPE.POSIS).get(posi)));
    }
    for (const pgon_ent of ents_i_map.get(ENT_TYPE.PGONS).keys()) {
        const posis: string[][] = sim_model.getEntPosis(pgon_ent) as string[][];
        geometry['pgons'].push(posis.map(w_posis => w_posis.map(posi => ents_i_map.get(ENT_TYPE.POSIS).get(posi))));
    }
    for (const coll_ent of ents_i_map.get(ENT_TYPE.COLLS).keys()) {
        // points
        const coll_points: string[] = sim_model.getEnts(ENT_TYPE.POINTS, coll_ent);
        geometry['coll_points'].push(coll_points.map(coll_point => ents_i_map.get(ENT_TYPE.POINTS).get(coll_point)));
        // plines
        const coll_plines: string[] = sim_model.getEnts(ENT_TYPE.PLINES, coll_ent);
        geometry['coll_plines'].push(coll_plines.map(coll_pline => ents_i_map.get(ENT_TYPE.PLINES).get(coll_pline)));
        // pgons
        const coll_pgons: string[] = sim_model.getEnts(ENT_TYPE.PGONS, coll_ent);
        geometry['coll_pgons'].push(coll_pgons.map(coll_pgon => ents_i_map.get(ENT_TYPE.PGONS).get(coll_pgon)));
        // colls
        const coll_colls: string[] = sim_model.getEnts(ENT_TYPE.COLLS, coll_ent);
        geometry['coll_colls'].push(coll_colls.map(coll_coll => ents_i_map.get(ENT_TYPE.COLLS).get(coll_coll)));
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
        'posis': _attribData(ENT_TYPE.POSIS, ents_i_map.get(ENT_TYPE.POSIS)),
        'verts': _attribData(ENT_TYPE.VERTS, ents_i_map.get(ENT_TYPE.VERTS)),
        'edges': _attribData(ENT_TYPE.EDGES, ents_i_map.get(ENT_TYPE.EDGES)),
        'wires': _attribData(ENT_TYPE.WIRES, ents_i_map.get(ENT_TYPE.WIRES)),
        'points': _attribData(ENT_TYPE.POINTS, ents_i_map.get(ENT_TYPE.POINTS)),
        'plines': _attribData(ENT_TYPE.PLINES, ents_i_map.get(ENT_TYPE.PLINES)),
        'pgons': _attribData(ENT_TYPE.PGONS, ents_i_map.get(ENT_TYPE.PGONS)),
        'colls': _attribData(ENT_TYPE.COLLS, ents_i_map.get(ENT_TYPE.COLLS)),
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
export function importSimData(sim_model: Sim, json_data: object): void {
    // check we have teh right data
    if (json_data['type'] !== 'SIM') {
        throw new Error('Data is not a SIM model');
    }
    if (json_data['version'] !== '0.1') {
        throw new Error('SIM Data is wrong version.' +
        'Version should be 0.1. This data is version ' + json_data['version'] + '.');
    }
    const posis: string[] = []
    // posis
    for (let i = 0; i < json_data['geometry']['num_posis']; i++) {
        posis.push(sim_model.addPosi([0,0,0]));
    }
    // points
    for (const posi_i of json_data['geometry']['points']) {
        sim_model.addPoint(posis[posi_i]);
    }
    // polylines
    for (const posis_i of json_data['geometry']['plines']) {
        sim_model.addPline((posis_i as string[]).map(posi_i => posis[posi_i]));
    }
    // polygons
    for (const posis_i of json_data['geometry']['pgons']) {
        const pgon: string = sim_model.addPgon((posis_i[0] as string[]).map( posi_i => posis[posi_i]));
        for (let i = 1; i < posis_i.length; i++) {
            // TODO add holes
            // sim_model.editPgonHole(pgon, (posis_i[i] as string[]).map( posi_i => posis[posi_i]));
        }
    }
    // collections
    const num_colls: number = json_data['geometry']['coll_points'].length;
    for (let i = 0; i < num_colls; i++) {
        const coll = sim_model.addColl()
        for (const point_i of json_data['geometry']['coll_points'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.POINTS + point_i);
        }
        for (const pline_i of json_data['geometry']['coll_plines'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.PLINES + pline_i);
        }
        for (const pgon_i of json_data['geometry']['coll_pgons'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.PGONS + pgon_i);
        }
        for (const child_coll_i of json_data['geometry']['coll_colls'][i]) {
            sim_model.addCollEnt(coll, ENT_TYPE.COLLS + child_coll_i);
        }
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
                    const ent: string = ent_type + ent_i;
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
export function importSim(sim_model: Sim, json_str: string): void {  
    const json_data = JSON.parse(json_str);
    importSimData(sim_model, json_data);
}
// ----------------------------------------------------------------------------------------------
/**
 * Import SIM file.
 * @param sim_model 
 * @param filepath 
 * @returns 
 */
export function importSimFile(sim_model: Sim, filepath: string): void {
    const json_str: string = readFileSync(filepath, 'utf-8');
    importSim(sim_model, json_str);
    console.log('Importing file successful.');
}
// ==================================================================================================
