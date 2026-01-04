import { cn } from '@/lib/utils';
import * as React from 'react';

// --------------------
// Table Container
// --------------------
function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot='table-container'
      className='relative w-full overflow-x-auto'
    >
      <table
        data-slot='table'
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

// --------------------
// Table Header
// --------------------
function TableHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'thead'>) {
  const filteredChildren = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim() !== '',
  );

  return (
    <thead
      data-slot='table-header'
      className={cn('[&_tr]:border-b', className)}
      {...props}
    >
      {filteredChildren}
    </thead>
  );
}

// --------------------
// Table Body
// --------------------
function TableBody({
  className,
  children,
  ...props
}: React.ComponentProps<'tbody'>) {
  const filteredChildren = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim() !== '',
  );

  return (
    <tbody
      data-slot='table-body'
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {filteredChildren}
    </tbody>
  );
}

// --------------------
// Table Footer
// --------------------
function TableFooter({
  className,
  children,
  ...props
}: React.ComponentProps<'tfoot'>) {
  const filteredChildren = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim() !== '',
  );

  return (
    <tfoot
      data-slot='table-footer'
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    >
      {filteredChildren}
    </tfoot>
  );
}

// --------------------
// Table Row
// --------------------
function TableRow({
  className,
  children,
  ...props
}: React.ComponentProps<'tr'>) {
  const filteredChildren = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim() !== '',
  );

  return (
    <tr
      data-slot='table-row'
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    >
      {filteredChildren}
    </tr>
  );
}

// --------------------
// Table Head Cell
// --------------------
function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

// --------------------
// Table Body Cell
// --------------------
function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
}

// --------------------
// Table Caption
// --------------------
function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
