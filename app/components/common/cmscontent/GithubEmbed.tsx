import { useMemo } from 'react';
import type { BundledLanguage } from 'shiki';
import { tv } from 'tailwind-variants';

import { classnames } from '~/core/classnames';
import { Icon } from '~/components/ds/icon/Icon';
import { useGetGithubContentQuery } from '~/core/useGetGithubContentQuery';
import { useShiki } from '~/core/useShiki';
import { SHIKI_THEMES } from '~/services/Content/shikiOptions';

import { CodeBlock } from './CodeBlock';

const Styles = tv({
  slots: {
    figure: 'overflow-hidden p-0 m-0 flex flex-col space-y-2',
    figcaption: ['flex'],
    icon: [],
    link: [],
    codeWrapper: 'bg-background-card text-text-base text-sm [&_pre]:overflow-x-auto [&_pre]:m-0 [&_pre]:text-wrap',
    error: [
      'px-4 py-2',
      'bg-background-critical text-text-critical',
      'text-sm',
    ],
    loading: [
      'px-4 py-2',
      'bg-background-card text-text-muted',
      'text-sm animate-pulse',
    ],
  },
});

interface GithubEmbedProps {
  repo: string; // owner/repo format
  ref: string; // branch, tag, or commit hash
  path: string; // file path from repo root
  className?: string;
  language?: string;
}

export function GithubEmbed({ repo, ref, path, className, language }: GithubEmbedProps) {
  const { data: content, error, isLoading } = useGetGithubContentQuery({
    repo,
    ref,
    path,
  });

  const { highlighter, loading: shikiLoading } = useShiki();
  const styles = Styles();

  const highlightedCode = useMemo(() => {
    if (!content || !highlighter || !language) {
      return content;
    }

    try {
      return highlighter.codeToHtml(content, {
        lang: language as BundledLanguage,
        themes: SHIKI_THEMES,
        defaultColor: 'dark',
        transformers: []
      });
    } catch (err) {
      console.error('Failed to highlight code:', err);
      return content;
    }
  }, [content, highlighter, language]);

  const formatRef = (r: string) => {
    // Shorten commit hashes for display
    if (/^[0-9a-f]{40}$/.test(r)) {
      return r.slice(0, 7);
    }
    return r;
  };

  // Construct GitHub URL for display
  const githubUrl = `https://github.com/${repo}/blob/${ref}/${path}`;
  const displayPath = `${path}@${formatRef(ref)}`;

  if (isLoading || shikiLoading) {
    return (
      <figure className={classnames(className, styles.figure())}>
        <figcaption className={styles.figcaption()}>
          <Icon name="Github" className={styles.icon()} />
          <span className={styles.loading()}>Loading from GitHub...</span>
        </figcaption>
      </figure>
    );
  }

  if (error) {
    return (
      <figure className={classnames(className, styles.figure())}>
        <figcaption className={styles.figcaption()}>
          <Icon name="Github" className={styles.icon()} />
          <span className={styles.error()}>
            Error: {error instanceof Error ? error.message : 'Failed to fetch'}
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={classnames(className, styles.figure())}>
      <figcaption className={styles.figcaption()}>
        <GithubEmbedLink url={githubUrl} label={displayPath} />
      </figcaption>
      {highlightedCode && highlightedCode !== content ? (
        <div
          className={styles.codeWrapper()}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      ) : (
        <CodeBlock>
          <code className={language ? `language-${language}` : undefined}>
            {content}
          </code>
        </CodeBlock>
      )}
    </figure>
  );
}

function GithubEmbedLink(props: {
  url: string;
  label?: string;
}) {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex rounded-lg bg-background-shadow py-1 px-2  items-center space-x-1 text-text-link hover:underline"
    >
      <Icon name="Github" className="w-4 h-4" />
      <span>{props.label || props.url}</span>
    </a>
  );
}
