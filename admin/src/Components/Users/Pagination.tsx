// src/Components/Users/Pagination.tsx
interface Props {
  page: number;
  totalPage: number;
  setPage: (p: number) => void;
}

const Pagination = ({ page, totalPage, setPage }: Props) => {
  return (
    <div className='flex justify-end gap-2'>
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className='px-4 py-2 rounded-lg bg-slate-800 disabled:opacity-40'
      >
        Prev
      </button>
      <span className='px-4 py-2 text-sm'>
        {page} / {totalPage}
      </span>
      <button
        disabled={page === totalPage}
        onClick={() => setPage(page + 1)}
        className='px-4 py-2 rounded-lg bg-slate-800 disabled:opacity-40'
      >
        Next
      </button>
    </div>
  );
};

export { Pagination };
