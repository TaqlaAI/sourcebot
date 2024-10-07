import { ArgumentParser } from "argparse";
import { readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import simpleGit, { SimpleGitProgressEvent } from 'simple-git';
import path from 'path';

const parser = new ArgumentParser({
    description: "Sourcebot backend tool",
});


type Arguments = {
    configPath: string;
    cacheDir: string;
}

const main = async () => {
    parser.add_argument("--configPath", {
        help: "Path to config file",
        required: true,
    });

    parser.add_argument("--cacheDir", {
        help: "Path to .sourcebot cache directory",
        required: true,
    })

    const args = parser.parse_args() as Arguments;

    if (!existsSync(args.configPath)) {
        console.error(`Config file ${args.configPath} does not exist`);
        process.exit(1);
    }

    const configContent = await readFile(args.configPath, 'utf-8');

    const config = JSON.parse(configContent);
    config;
    console.log('config loaded!!');

    // @todo:
    // 1. Add ability to authenticate with GitHub and clone repository

    const reposDir = path.join(args.cacheDir, 'repos');
    if (!existsSync(reposDir)) {
        await mkdir(reposDir, { recursive: true });
    }

    const progress = ({ method, stage, progress }: SimpleGitProgressEvent) => {
        console.log(`git.${method} ${stage} stage ${progress}% complete.`);
    }
    const git = simpleGit({
        baseDir: reposDir,
        progress
    });


    const localPath = path.join(reposDir, 'github.com/sourcebot-dev/sourcebot.git');
    if (!existsSync(localPath)) {
        await git.clone(
            "https://github.com/sourcebot-dev/sourcebot.git",
            localPath,
            [
                "--bare",

                // @todo : refactor this
                "--config",
                "zoekt.web-url=https://github.com/sourcebot-dev/sourcebot.git",
                "--config",
                "zoekt.name=github.com/sourcebot-dev/sourcebot",
                "--config",
                "zoekt.web-url-type=github"
            ],
        );
    } else {
        await git.cwd({
            path: localPath,
        }).fetch(
            "origin",
            "HEAD",
            [
                "--prune",
                "--progress"
            ]
        );
    }
}

(async () => {
    await main();
})();

