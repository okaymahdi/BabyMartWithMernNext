import useAuthStore from '@/Store/UseAuthStore';

const DashboardPage = () => {
  const { user, token } = useAuthStore();
  // ✅ isAuthenticated derive from persisted values
  const isAuthenticated = !!user && !!token;

  console.log('Dashboard isAuthenticated:', isAuthenticated);

  // if (!isAuthenticated) {
  //   return (
  //     <Navigate
  //       to='/login'
  //       replace
  //     />
  //   );
  // }

  return <div>Dashboard</div>;
};

export default DashboardPage;
