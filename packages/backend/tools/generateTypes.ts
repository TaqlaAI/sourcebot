import { compileFromFile } from 'json-schema-to-typescript'
import path from 'path';
import fs from 'fs';

const BANNER_COMMENT = '// THIS IS A AUTO-GENERATED FILE. DO NOT MODIFY MANUALLY!\n';

(async () => {
    const cwd = process.cwd();
    const schemaPath = path.resolve(`${cwd}/../../schemas/v2/index.json`);
    const outputPath = path.resolve(`${cwd}/src/schemas/v2.ts`);

    const content = await compileFromFile(schemaPath, {
        bannerComment: BANNER_COMMENT,
        cwd,
    });

    await fs.promises.writeFile(
        outputPath,
        content,
        "utf-8"
    );
})();