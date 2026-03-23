interface EmptyStateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
