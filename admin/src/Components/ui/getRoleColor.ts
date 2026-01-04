/**
 * 🔹 getRoleColor
 * ----------------
 * Role → badge color mapping
 */

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'red';
    case 'manager':
      return 'blue';
    default:
      return 'green';
  }
};
