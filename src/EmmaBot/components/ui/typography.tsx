import { cn } from '@emma/lib/utils';

export function H1({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
        className
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...rest}
    >
      {children}
    </h2>
  );
}

export function H3({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function H4({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'h4'>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...rest}
    >
      {children}
    </h4>
  );
}

export function Paragraph({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p className={cn('leading-7', className)} {...rest}>
      {children}
    </p>
  );
}
