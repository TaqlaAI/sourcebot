import { Repository } from './types.js';
import { simpleGit, SimpleGitProgressEvent } from 'simple-git';
import { existsSync } from 'fs';
import { createLogger } from './logger.js';

const logger = createLogger('git');

export const cloneRepository = async (repo: Repository) => {
    if (existsSync(repo.path)) {
        logger.warn(`${repo.fullName} already exists. Skipping clone.`)
        return;
    }

    const progress = ({ method, stage, progress }: SimpleGitProgressEvent) => {
        console.log(`git.${method} ${stage} stage ${progress}% complete.`);
    }

    const git = simpleGit({
        progress
    });

    const gitConfig = Object.entries(repo.gitConfigMetadata ?? {}).flatMap(
        ([key, value]) => ['--config', `${key}=${value}`]
    );

    await git.clone(
        repo.cloneUrl,
        repo.path,
        [
            "--bare",
            ...gitConfig
        ]
    );
}


export const fetchRepository = async (repo: Repository) => {
    const progress = ({ method, stage, progress }: SimpleGitProgressEvent) => {
        console.log(`git.${method} ${stage} stage ${progress}% complete.`);
    }

    const git = simpleGit({
        progress
    });

    await git.cwd({
        path: repo.path,
    }).fetch(
        "origin",
        "HEAD",
        [
            "--prune",
            "--progress"
        ]
    );
}