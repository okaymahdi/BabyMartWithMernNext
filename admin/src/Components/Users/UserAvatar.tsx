/**
 * 🔹 UserAvatar
 * --------------
 * Avatar rendering logic isolated
 */

import type { User } from '@/lib/Types/UserTypes';

interface UserAvatarProps {
  user: User;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const initial = user.name?.charAt(0).toUpperCase();

  return (
    <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center'>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className='w-full h-full object-cover'
        />
      ) : (
        <span className='font-semibold text-gray-700'>{initial ?? '?'}</span>
      )}
    </div>
  );
};

export default UserAvatar;
