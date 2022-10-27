export const queryBuilder = (
    fields: string,
    tableName: string,
    owner: string = '',
    alias: string = '',
    criteria: string = ''
): string => {
    fields = fields.replace(/,/g, '');
    tableName = owner ? `${owner}.${tableName}` : tableName;
    alias = alias ? ` ${alias}` : '';
    criteria = criteria ? ` WHERE ${criteria}` : '';

    return `SELECT ${fields} FROM ${tableName}${alias}${criteria}`
}