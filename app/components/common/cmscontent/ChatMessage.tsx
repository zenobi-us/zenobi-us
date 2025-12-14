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
export function UserMessage(props: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="user">
      {props.children}
      <pre className=" m-0 mb-1 p-0 pt-2 text-white/30 text-xs">user</pre>
    </ChatMessage>
  );
}

export function AgentMessage(props: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="agent" className={classnames(props.className, "border-none bg-transparent dark:bg-background-shadow")}>
      {props.children}
    </ChatMessage>
  );
}

export function TodoListMessage(props: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="todo" className={classnames(props.className, "m-0 p-0 border-none bg-transparent dark:bg-transparent")}>
      <ul className="m-0 p-0 list-none space-y-1">
        {props.children}
      </ul>
    </ChatMessage>
  );
}
TodoListMessage.Item = TodoListItemMessage;

export function TodoListItemMessage(props: {
  status?: 'pending' | 'completed' | 'canceled' | 'in-progress';
  children: React.ReactNode;
}) {
  const statusEmoji = {
    pending: '📝 ',
    completed: '✅ ',
    canceled: '❌ ',
    'in-progress': '⏳ ',
  };

  const statusLabel = {
    pending: 'Pending task: ',
    completed: 'Completed task: ',
    canceled: 'Canceled task: ',
    'in-progress': 'In-progress task: ',
  };

  const statusColor = {
    pending: '',
    completed: 'text-green-400 line-through',
    canceled: 'text-red-400 line-through',
    'in-progress': 'text-yellow-400',
  };

  return (
    <li className={classnames(
      'flex gap-2 list-none',
      props.status ? statusColor[props.status] : 'text-white',
    )}>
      <span className="sr-only">
        {props.status ? statusLabel[props.status] : 'Pending task: '}
      </span>

      {props.status ? statusEmoji[props.status] : '📝 '}
      {props.children}
    </li>
  );
}

export function ToolUseMessage(props: Omit<ChatMessageProps, 'role'>) {
  return (
    <ChatMessage role="tool" className={classnames(props.className, "m-0 p-0 border-none bg-transparent dark:bg-background-shadow")}>
      <pre className=" m-0 mb-2 p-0 text-white/30 text-xs">⚙ {props.children}</pre>
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
