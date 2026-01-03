import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

/**
 * 🧠 UserSkeleton Component
 * -------------------------
 * 🔹 এটা Users page-এর loading state দেখানোর জন্য
 * 🔹 isAdmin রাখা হয়েছে শেখার উদ্দেশ্যে
 * 🔹 ধরে নিচ্ছি admin আছে
 */
const UserSkeleton = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className='p-6 space-y-6'>
      {/* ===========================
          🟦 Header Skeleton
          👉 Page title + count area
      ============================ */}
      <div className='flex items-center justify-between'>
        {/* 📝 Left side: Title & subtitle */}
        <div>
          <Skeleton className='h-8 w-64 mb-2' /> {/* Title */}
          <Skeleton className='h-4 w-48' /> {/* Subtitle */}
        </div>

        {/* 🔢 Right side: icon + count */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8 rounded-full' /> {/* Users icon */}
          <Skeleton className='h-6 w-12' /> {/* Total count */}
        </div>
      </div>

      {/* ===========================
          🔍 Filter Skeleton
          👉 Search + Role filter
      ============================ */}
      <div className='bg-white p-4 rounded-lg shadow-sm border'>
        <div className='flex items-center gap-4 flex-wrap'>
          <Skeleton className='h-9 w-64' /> {/* Search input */}
          <Skeleton className='h-9 w-48' /> {/* Role select */}
          {/* 🛡️ Admin হলে extra filter দেখাতে পারি */}
          {isAdmin && <Skeleton className='h-9 w-32' />}
        </div>
      </div>

      {/* ===========================
          📊 Table Skeleton
          👉 Users list loading view
      ============================ */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <Table>
          {/* 🧾 Table Header */}
          <TableHeader>
            <TableRow className='bg-gray-50'>
              {/* ⚠️ Header count = Body count (খুব important) */}
              <TableHead>
                <Skeleton className='h-4 w-16' />
              </TableHead>{' '}
              {/* Avatar */}
              <TableHead>
                <Skeleton className='h-4 w-20' />
              </TableHead>{' '}
              {/* Name */}
              <TableHead>
                <Skeleton className='h-4 w-24' />
              </TableHead>{' '}
              {/* Email */}
              <TableHead>
                <Skeleton className='h-4 w-16' />
              </TableHead>{' '}
              {/* Role */}
              <TableHead>
                <Skeleton className='h-4 w-20' />
              </TableHead>{' '}
              {/* Created At */}
              <TableHead>
                <Skeleton className='h-4 w-16' />
              </TableHead>{' '}
              {/* Action */}
            </TableRow>
          </TableHeader>

          {/* 📦 Table Body */}
          <TableBody>
            {/* 🔁 Fake rows (loading effect) */}
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {/* 👤 Avatar */}
                <TableCell>
                  <Skeleton className='h-12 w-12 rounded-full' />
                </TableCell>

                {/* 🧑 Name */}
                <TableCell>
                  <Skeleton className='h-4 w-32' />
                </TableCell>

                {/* 📧 Email */}
                <TableCell>
                  <Skeleton className='h-4 w-40' />
                </TableCell>

                {/* 🏷️ Role badge */}
                <TableCell>
                  <Skeleton className='h-6 w-20 rounded-full' />
                </TableCell>

                {/* 📅 Created date */}
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>

                {/* ⚙️ Action buttons */}
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {/* 👁️ View button (সবাই দেখতে পারে) */}
                    <Skeleton className='h-8 w-8 rounded-full' />

                    {/* 🛡️ Admin হলে extra action */}
                    {isAdmin && (
                      <>
                        <Skeleton className='h-8 w-8 rounded-full' />{' '}
                        {/* Edit */}
                        <Skeleton className='h-8 w-8 rounded-full' />{' '}
                        {/* Delete */}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserSkeleton;
