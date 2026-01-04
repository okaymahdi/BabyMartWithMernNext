import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Search } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
}

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
}: UserFiltersProps) => {
  return (
    <div className='flex items-center gap-4 flex-wrap'>
      <div className='flex items-center gap-2'>
        <Search className='h-4 w-4 text-gray-500' />
        <Input
          placeholder='Search Users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-64'
        />
      </div>
      <div>
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}
        >
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Filter By Role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Role</SelectItem>
            <SelectItem value='admin'>Admin</SelectItem>
            <SelectItem value='manager'>Manager</SelectItem>
            <SelectItem value='user'>User</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserFilters;
