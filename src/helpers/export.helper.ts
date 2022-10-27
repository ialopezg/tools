import { writeFile } from 'fs';
import { execute } from "../database/datasource";

const getTables = async (owner: string): Promise<any> => {
    const { rows } = await execute(`SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER = '${owner}'`);

    return rows.map((row: any) => row[0]);
}

export const exportData = async (owner: string,): Promise<number> => {
    const tables = await getTables(owner);

    tables.map(async (table: any) => {
        return exportTable(owner, table);
    })

    return tables.length;
}

export const exportTable = async (owner: string, tableName: string, criteria: string = ''): Promise<number> => {
    console.log(`SELECT * FROM ${owner ? `${owner}.` : ''}${tableName}${criteria ? ` WHERE ${criteria}` : ''}`);
    const result = await execute(
        `SELECT * FROM ${owner ? `${owner}.` : ''}${tableName}${criteria ? ` WHERE ${criteria}` : ''}`,
        {},
        { extendedMetaData: true }
    );

    const table = { [owner]: owner, tableName: { metadata: result.metaData, rows: result.rows }};
    writeFile(`${(owner ? `${owner}_` : '')}${tableName}.json`, JSON.stringify(table), function (error: any) {
        if (error) {
            throw error;
        }
            
        console.log('File is created successfully.');
    });
    console.log({ [owner]: owner, tableName: { metadata: result.metaData, rows: result.rows }});

    return 0;
};
