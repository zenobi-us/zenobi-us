import { tv, VariantProps } from 'tailwind-variants';
import { PropsWithChildren } from 'react';

import { classnames } from '~/core/classnames';

import { CodeBlock } from './CodeBlock';

const Styles = tv({
  slots: {
    container: [
      'relative',
      'my-4 p-4',
      'rounded-none', // Remove rounded corners
    ],
    codeBlock: [
      'rounded-none', // Remove rounded corners from CodeBlock
      'p-2 pb-1',
      'whitespace-pre-wrap',
    ],
  },
  variants: {
    role: {
      tool: {
        container: 'border-l-2 border-text-muted bg-transparent dark:bg-transparent',
        codeBlock: 'bg-transparent dark:bg-transparent',
      },
      todo: {
        container: 'border-l-2 border-text-secondary bg-transparent dark:bg-transparent',
        codeBlock: 'bg-transparent dark:bg-transparent',
      },
      agent: {
        container: 'border-l-2 border-text-secondary bg-transparent dark:bg-transparent',
        codeBlock: 'bg-transparent dark:bg-transparent',
      },
      user: {
        container: 'border-l-2 border-text-link',
        badge: 'bg-text-link text-background-base',
      },
    },
  },
});

type ChatStylesProps = VariantProps<typeof Styles>;

interface ChatMessageProps {
  role: ChatStylesProps['role'];
  children: React.ReactNode;
  className?: string;
}

export function Chat(props: PropsWithChildren<{
  title?: string;
}>) {
  const styles = Styles();
  return <div className={classnames(styles.container(), "bg-background-shadow")}>
    {props.title && <div className="text-sm font-mono mb-2 text-white/30">{props.title}</div>}
    {props.children}
  </div>;
}

Chat.Message = ChatMessage;
Chat.User = UserMessage;
Chat.Assistant = AgentMessage;
Chat.ToolUse = ToolUseMessage;
Chat.TodoList = TodoListMessage;
Chat.AgentMode = AgentMode;

export function ChatMessage(props: {
  role: ChatStylesProps['role'];
  children: React.ReactNode;
  className?: string;
}) {
  const styles = Styles(props);

  return (
    <CodeBlock className={classnames(styles.codeBlock(), props.className)}>{props.children}</CodeBlock>
  );
}

// Convenience components for better ergonomics in MDX
export function UserMessage({ children, className }: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="user" className={classnames(className, "border-l-4 border-l-purple-300")}>
      {children}
      <pre className=" m-0 mb-1 p-0 pt-2 text-white/30 text-xs">user</pre>
    </ChatMessage>
  );
}

export function AgentMessage({ children, className }: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="agent" className={classnames(className, "border-none bg-transparent dark:bg-background-shadow")}>
      {children}
    </ChatMessage>
  );
}

export function TodoListMessage({ children, className }: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="todo" className={classnames(className, "m-0 p-0 border-none bg-transparent dark:bg-transparent")}>
      <ul className="m-0 p-0 list-none space-y-1">
        {children}
      </ul>
    </ChatMessage>
  );
}
TodoListMessage.Item = TodoListItemMessage;

export function TodoListItemMessage(props: {
  status?: 'pending' | 'completed' | 'canceled' | 'in-progress';
  children: React.ReactNode;
}) {
  return (
    <li className={classnames(
      'flex gap-2 list-none',
      props.status === 'completed' && 'text-green-400 line-through',
      props.status === 'canceled' && 'text-red-400 line-through',
      props.status === 'in-progress' && 'text-yellow-400',
      !props.status && 'text-white',
    )}>
      <span className="sr-only">
        {props.status === 'completed' && 'Completed task: '}
        {props.status === 'canceled' && 'Canceled task: '}
        {props.status === 'in-progress' && 'In-progress task: '}
        {!props.status && 'Pending task: '}
      </span>

      {props.status === 'pending' && '📝 '}
      {props.status === 'completed' && '✅ '}
      {props.status === 'canceled' && '❌ '}
      {props.status === 'in-progress' && '⏳ '}

      {props.children}
    </li>
  );
}

export function ToolUseMessage({ children, className }: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="tool" className={classnames(className, "m-0 p-0 border-none bg-transparent dark:bg-background-shadow")}>
      <pre className=" m-0 mb-2 p-0 text-white/30 text-xs">⚙ {children}</pre>
    </ChatMessage>
  );
}

const agentModeStyles = tv({
  slots: {
    container: [
      'm-0 p-0 border-none bg-transparent dark:bg-background-shadow flex gap-2 justify-start items-baseline',
    ],
    symbol: [
      'm-0 mb-2 p-0 text-xs',
    ],
    message: [
      'm-0 p-0',
    ],
  },
  variants: {
    color: {
      purple: { symbol: 'text-purple-400' },
      blue: { symbol: 'text-blue-400' },
      green: { symbol: 'text-green-400' },
      red: { symbol: 'text-red-400' },
      orange: { symbol: 'text-orange-400' },
      yellow: { symbol: 'text-yellow-400' },
      teal: { symbol: 'text-teal-400' },
      pink: { symbol: 'text-pink-400' },
      gray: { symbol: 'text-gray-400' },
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

export function AgentMode(props: Omit<ChatMessageProps, 'role'> & VariantProps<typeof agentModeStyles>) {
  const styles = agentModeStyles(props);
  return (
    <ChatMessage role="agent" className={classnames(
      props.className,
      styles.container()
    )}>
      <pre className={classnames(
        "m-0 mb-2 p-0 text-xs",
        styles.symbol(),
      )}>▣</pre>
      <pre className={styles.message()}>{props.children}</pre>
    </ChatMessage>
  );
}
