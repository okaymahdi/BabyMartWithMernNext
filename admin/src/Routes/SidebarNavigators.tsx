import {
  Bookmark,
  ChartBarStacked,
  LayersPlus,
  LayoutDashboard,
  Package,
  ReceiptText,
  ShoppingCart,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

const SidebarNavigators = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    end: true,
  },
  {
    to: '/dashboard/account',
    label: 'Account',
    icon: <User size={20} />,
  },
  {
    to: '/dashboard/users',
    label: 'Users',
    icon: <Users size={20} />,
  },
  {
    to: '/dashboard/orders',
    label: 'Orders',
    icon: <Package size={20} />,
  },
  {
    to: '/dashboard/invoices',
    label: 'Invoices',
    icon: <ReceiptText size={20} />,
  },
  {
    to: '/dashboard/banners',
    label: 'Banners',
    icon: <LayersPlus size={20} />,
  },
  {
    to: '/dashboard/products',
    label: 'Products',
    icon: <ShoppingCart size={20} />,
  },
  {
    to: '/dashboard/categories',
    label: 'Categories',
    icon: <ChartBarStacked size={20} />,
  },

  {
    to: '/dashboard/brands',
    label: 'Brands',
    icon: <Bookmark size={20} />,
  },

  {
    to: '/dashboard/create-users',
    label: 'Create User',
    icon: <UserPlus size={20} />,
  },
];

export { SidebarNavigators };
