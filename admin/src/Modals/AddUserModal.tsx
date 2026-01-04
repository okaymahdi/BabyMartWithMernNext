// src/Pages/Users/components/AddUserModal.tsx
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import ImageUpload from '@/Components/ui/Image.upload';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Spinner } from '@/Components/ui/spinner';
import type { FormData } from '@/lib/Types/UserTypes';

import { UserPlus } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

const AddUserModal = ({
  open,
  onClose,
  form,
  onSubmit,
  loading,
}: AddUserModalProps) => {
  const formFields = [
    { name: 'name' as const, label: 'Name', type: 'text' },
    { name: 'email' as const, label: 'Email', type: 'email' },
    { name: 'password' as const, label: 'Password', type: 'password' },
    { name: 'role' as const, label: 'Role', type: 'select' },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Create a new user account</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: rhfField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'select' ? (
                        <Select
                          {...rhfField}
                          onValueChange={rhfField.onChange}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select role' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='user'>User</SelectItem>
                            <SelectItem value='admin'>Admin</SelectItem>
                            <SelectItem value='manager'>Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...rhfField}
                          type={field.type}
                          placeholder={`Enter ${field.label}`}
                          disabled={loading}
                        />
                      )}
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors[field.name]?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors['avatar']?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <DialogFooter className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={loading}
              >
                {loading ? (
                  <Spinner className='h-4 w-4' />
                ) : (
                  <span className='flex items-center gap-2'>
                    <UserPlus />
                    Create User
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
