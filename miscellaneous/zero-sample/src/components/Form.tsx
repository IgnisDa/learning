import type * as React from "react";

type FormProps = {
  className?: string;
  children: React.ReactNode;
  onSubmit: () => void | Promise<void>;
};

export function Form({ onSubmit, children, className }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
