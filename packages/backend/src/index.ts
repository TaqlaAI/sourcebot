import { ArgumentParser } from "argparse";
import { mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { exec } from "child_process";
import path from 'path';
import { SourcebotConfigurationSchema } from "./schemas/v2.js";
import { getGitHubReposFromConfig } from "./github.js";
import { AppContext, Repository } from "./types.js";
import { cloneRepository } from "./git.js";
import { createLogger } from "./logger.js";

const logger = createLogger('core');

const parser = new ArgumentParser({
    description: "Sourcebot backend tool",
});

type Arguments = {
    configPath: string;
    cacheDir: string;
}

const indexRepository = async (repo: Repository, ctx: AppContext) => {
    return new Promise<{ stdout: string, stderr: string}>((resolve, reject) => {
        exec(`zoekt-git-index -index ${ctx.indexPath} ${repo.path}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({
                stdout,
                stderr
            });
        })
    });
}

const main = async () => {
    parser.add_argument("--configPath", {
        help: "Path to config file",
        required: true,
    });

    parser.add_argument("--cacheDir", {
        help: "Path to .sourcebot cache directory",
        required: true,
    });
    const args = parser.parse_args() as Arguments;

    if (!existsSync(args.configPath)) {
        console.error(`Config file ${args.configPath} does not exist`);
        process.exit(1);
    }

    const reposPath = path.join(args.cacheDir, 'repos');
    const indexPath = path.join(args.cacheDir, 'index');

    if (!existsSync(reposPath)) {
        await mkdir(reposPath, { recursive: true });
    }
    if (!existsSync(indexPath)) {
        await mkdir(indexPath, { recursive: true });
    }
    
    const context: AppContext = {
        indexPath,
        reposPath
    }

    const configContent = await readFile(args.configPath, 'utf-8');
    const config = JSON.parse(configContent) as SourcebotConfigurationSchema;


    if (config.repos) {
        const repos: Repository[] = [];

        for (const repoConfig of config.repos) {
            switch (repoConfig.type) {
                case 'github': {
                    const gitHubRepos = await getGitHubReposFromConfig(repoConfig, context);
                    repos.push(...gitHubRepos);
                    break;
                }
            }
        }

        for (const repo of repos) {
            // @todo : We need to handle authenticating with the remote here.
            logger.info(`Cloning ${repo.fullName}...`);
            await cloneRepository(repo);

            logger.info(`Indexing ${repo.fullName}...`);
            await indexRepository(repo, context);
        }
    }
}

(async () => {
    await main();
})();
