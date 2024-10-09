
export type Repository = {
    /**
     * Name of the repository (e.g., 'zoekt' or 'sourcebot')
     */
    name: string;

    /**
     * The fully qualified name (e.g., `github.com/sourcebot-dev/sourcebot`)
     */
    fullName: string;
    
    /**
     * The .git url for the repository
     */
    cloneUrl: string;

    /**
     * Path to where the repository is cloned
     */
    path: string;

    gitConfigMetadata?: Record<string, string>;
}

export type AppContext = {
    /**
     * Path to the repos cache directory.
     */
    reposPath: string;

    /**
     * Path to the index cache directory;
     */
    indexPath: string;
}
