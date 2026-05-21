import type { ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Alert.scss';
export type AlertTone = 'info' | 'success' | 'warning' | 'error';
export type AlertProps = {
  title?: ReactNode;
  children?: ReactNode;
  tone?: AlertTone;
  progress?: number;
  action?: ReactNode;
  className?: string;
};
export function Alert({
  title,
  children,
  tone = 'info',
  progress,
  action,
  className,
}: AlertProps) {
  return (
    <section
      className={cn('ui-alert', 'ui-alert--tone-' + tone, className)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {title ? <h3 className="ui-alert__title">{title}</h3> : null}
      {children ? <div className="ui-alert__body">{children}</div> : null}
      {action ? <div className="ui-alert__action">{action}</div> : null}
      {typeof progress === 'number' ? (
        <div className="ui-alert__progress">
          <span style={{ width: Math.max(0, Math.min(100, progress)) + '%' }} />
        </div>
      ) : null}
    </section>
  );
}
