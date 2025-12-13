import { useQuery } from '@tanstack/react-query';

interface GithubContentParams {
  repo: string; // owner/repo format (e.g., "zenobi-us/dotfiles")
  ref: string; // branch, tag, or commit hash
  path: string; // file path from repo root
}

/**
 * Constructs GitHub raw content URL from structured inputs
 */
function buildGithubRawUrl(repo: string, ref: string, path: string): string {
  const [owner, repoName] = repo.split('/');
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://raw.githubusercontent.com/${owner}/${repoName}/${ref}/${cleanPath}`;
}

async function fetchGithubContent(params: GithubContentParams): Promise<string> {
  const { repo, ref, path } = params;
  const url = buildGithubRawUrl(repo, ref, path);
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const text = await response.text();
  
  // Simple validation - ensure we got a string
  if (typeof text !== 'string') {
    throw new Error(`Invalid response: expected string, got ${typeof text}`);
  }

  return text;
}

export function useGetGithubContentQuery(params: GithubContentParams) {
  return useQuery({
    queryKey: ['github-content', params.repo, params.ref, params.path],
    queryFn: () => fetchGithubContent(params),
  });
}
