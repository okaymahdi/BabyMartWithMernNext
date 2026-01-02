// src/Components/Users/UsersSkeleton.tsx
const UsersSkeleton = () => {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='h-12 rounded-xl bg-slate-800/60 animate-pulse'
        />
      ))}
    </div>
  );
};

export { UsersSkeleton };
