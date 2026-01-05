// ViewUserModal.tsx
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import type { User } from '@/lib/Types/UserTypes';

interface ViewUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal = ({ open, onClose, user }: ViewUserModalProps) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !val && onClose()}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View details for <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2 mt-2'>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.avatar && (
            <img
              src={
                user.avatar.startsWith('http')
                  ? user.avatar
                  : `${import.meta.env.VITE_API_URL}${user.avatar}`
              }
              alt={user.name}
              className='w-24 h-24 rounded-full object-cover mt-2'
            />
          )}
        </div>

        <DialogFooter className='mt-4'>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
