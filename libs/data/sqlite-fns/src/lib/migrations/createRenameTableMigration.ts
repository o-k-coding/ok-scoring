export function createRenameTableMigration(existingTable: string, newTable: string, tableDef: string): string[] {
    const tempNew = `${newTable }_temp`;
    return [
        `
                CREATE TABLE IF NOT EXISTS ${tempNew}
                        (
                            ${tableDef}
                        );
            `,
        `INSERT INTO ${tempNew} SELECT * FROM ${existingTable};`,
        `DROP TABLE ${existingTable};`,
        `ALTER TABLE ${tempNew} RENAME TO ${newTable};`,
    ]
}
