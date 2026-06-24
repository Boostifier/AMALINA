"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit button for a server-action <form> that asks for confirmation first
 * and disables itself while the action runs.
 */
export default function ConfirmSubmit({
  confirm,
  children,
  className,
}: {
  confirm: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
