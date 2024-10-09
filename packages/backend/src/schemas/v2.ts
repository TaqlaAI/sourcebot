// THIS IS A AUTO-GENERATED FILE. DO NOT MODIFY MANUALLY!

export type Repos = GitHubConfig;

/**
 * A Sourcebot configuration file outlines which repositories Sourcebot should sync and index.
 */
export interface SourcebotConfigurationSchema {
  $schema?: string;
  /**
   * Defines a collection of repositories from varying code hosts that Sourcebot should sync with.
   */
  repos?: Repos[];
}
export interface GitHubConfig {
  /**
   * GitHub Configuration
   */
  type: "github";
  /**
   * A Personal Access Token (PAT).
   */
  token?: string;
  /**
   * The URL of the GitHub host. Defaults to https://github.com
   */
  url?: string;
  /**
   * List of organizations to sync with. All repositories in the organization will be synced, unless explicitly defined in the `exclude` property.
   */
  orgs?: string[];
  /**
   * List of individual repositories to sync with. Expected to be formatted as '{orgName}/{repoName}' or '{userName}/{repoName}'.
   */
  repos?: string[];
}
