// src/Components/Users/RoleBadge.tsx
import { cn } from '@/lib/utils'; // Tailwind class merge utility

interface RoleBadgeProps {
  role: 'admin' | 'manager' | 'user' | string; // safer
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  // 🌈 Role অনুযায়ী কালার
  let roleClass = '';

  switch (role) {
    case 'admin':
      roleClass = 'bg-red-500/15 text-red-400 border border-red-500/20';
      break;
    case 'manager':
      roleClass =
        'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20';
      break;
    case 'user':
      roleClass =
        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      break;
    default:
      roleClass = 'bg-slate-500/15 text-slate-400 border border-slate-500/20';
      break;
  }

  return (
    <span
      className={cn(
        'px-3 py-1 text-xs font-medium rounded-full capitalize',
        roleClass,
      )}
    >
      {role}
    </span>
  );
};

export { RoleBadge };
