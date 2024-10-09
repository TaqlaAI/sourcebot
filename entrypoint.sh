#!/bin/sh
set -e

# Issue a info message about telemetry
if [ ! -z "$SOURCEBOT_TELEMETRY_DISABLED" ]; then
    echo -e "\e[34m[Info] Disabling telemetry since SOURCEBOT_TELEMETRY_DISABLED was set.\e[0m"
fi

# Check if DATA_CACHE_DIR exists, if not create it
if [ ! -d "$DATA_CACHE_DIR" ]; then
    mkdir -p "$DATA_CACHE_DIR"
fi

# In order to detect if this is the first run, we create a `.installed` file in
# the cache directory.
FIRST_RUN_FILE="$DATA_CACHE_DIR/.installed"
if [ ! -f "$FIRST_RUN_FILE" ]; then
    touch "$FIRST_RUN_FILE"

    # If this is our first run, send a `install` event to PostHog
    # (if telemetry is enabled)
    if [ -z "$SOURCEBOT_TELEMETRY_DISABLED" ]; then
        curl -L -s --header "Content-Type: application/json" -d '{
            "api_key": "'"$NEXT_PUBLIC_POSTHOG_KEY"'",
            "event": "install",
            "distinct_id": "'"$(uuidgen)"'"
        }' https://us.i.posthog.com/capture/ > /dev/null
    fi
fi

# Fallback to sample config if a config does not exist
if echo "$CONFIG_PATH" | grep -qE '^https?://'; then
    if ! curl --output /dev/null --silent --head --fail "$CONFIG_PATH"; then
        echo -e "\e[33m[Warning] Remote config file at '$CONFIG_PATH' not found. Falling back on sample config.\e[0m"
        CONFIG_PATH="./default-config.json"
    fi
elif [ ! -f "$CONFIG_PATH" ]; then
    echo -e "\e[33m[Warning] Config file at '$CONFIG_PATH' not found. Falling back on sample config.\e[0m"
    CONFIG_PATH="./default-config.json"
fi

echo -e "\e[34m[Info] Using config file at: '$CONFIG_PATH'.\e[0m"

# Check if GITHUB_TOKEN is set
if [ -n "$GITHUB_TOKEN" ]; then
    echo "$GITHUB_TOKEN" > "$HOME/.github-token"
    chmod 600 "$HOME/.github-token"

    # Configure Git with the provided GITHUB_TOKEN
    echo -e "\e[34m[Info] Configuring GitHub credentials with hostname '$GITHUB_HOSTNAME'.\e[0m"
    echo "machine ${GITHUB_HOSTNAME}
    login oauth
    password ${GITHUB_TOKEN}" >> "$HOME/.netrc"
    chmod 600 "$HOME/.netrc"
else
    echo -e "\e[34m[Info] Private GitHub repositories will not be indexed since GITHUB_TOKEN was not set.\e[0m"
fi

# Check if GITLAB_TOKEN is set
if [ -n "$GITLAB_TOKEN" ]; then
    echo "$GITLAB_TOKEN" > "$HOME/.gitlab-token"
    chmod 600 "$HOME/.gitlab-token"
   
    # Configure Git with the provided GITLAB_TOKEN
    echo -e "\e[34m[Info] Configuring GitLab credentials with hostname '$GITLAB_HOSTNAME'.\e[0m"
    echo "machine ${GITLAB_HOSTNAME}
    login oauth
    password ${GITLAB_TOKEN}" >> "$HOME/.netrc"
    chmod 600 "$HOME/.netrc"
else
    echo -e "\e[34m[Info] GitLab repositories will not be indexed since GITLAB_TOKEN was not set.\e[0m"
fi

# Update nextjs public env variables w/o requiring a rebuild.
# @see: https://phase.dev/blog/nextjs-public-runtime-variables/

# Infer NEXT_PUBLIC_SOURCEBOT_TELEMETRY_DISABLED if it is not set
if [ -z "$NEXT_PUBLIC_SOURCEBOT_TELEMETRY_DISABLED" ] && [ ! -z "$SOURCEBOT_TELEMETRY_DISABLED" ]; then
    export NEXT_PUBLIC_SOURCEBOT_TELEMETRY_DISABLED="$SOURCEBOT_TELEMETRY_DISABLED"
fi

find /app/packages/web/public /app/packages/web/.next -type f -name "*.js" |
while read file; do
    sed -i "s|BAKED_NEXT_PUBLIC_SOURCEBOT_TELEMETRY_DISABLED|${NEXT_PUBLIC_SOURCEBOT_TELEMETRY_DISABLED}|g" "$file"
done

exec supervisord -c /etc/supervisor/conf.d/supervisord.conf