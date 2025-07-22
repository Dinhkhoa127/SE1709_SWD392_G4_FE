// Utility functions for role-based navigation and permissions

/**
 * Navigate user to appropriate page based on their role
 * @param {number} roleId - User's role ID
 * @param {function} navigate - React Router navigate function
 */
export const navigateByRole = (roleId, navigate) => {
    console.log('Navigating by role:', roleId);
    
    switch (roleId) {
        case 1:
            // Role 1: User thường
            console.log('Navigating to /users for role 1');
            navigate('/users', { replace: true });
            break;
        case 3:
            // Role 3: Admin
            console.log('Navigating to /admin for role 3');
            navigate('/admin', { replace: true });
            break;
        default:
            break;
    }
};

/**
 * Get default route based on user role
 * @param {number} roleId - User's role ID
 * @returns {string} - Route path
 */
export const getDefaultRouteByRole = (roleId) => {
    switch (roleId) {
        case 1:
            return '/users';
        case 3:
            return '/admin';
        default:
            return null;
    }
};

/**
 * Check if user has permission to access a specific route
 * @param {number} roleId - User's role ID
 * @param {string} route - Route to check
 * @returns {boolean} - Has permission or not
 */
export const hasRoutePermission = (roleId, route) => {
    const adminRoutes = ['/admin', '/subjects', '/topics', '/chapters', '/artifacts', '/artifact-types', '/artifact-medias', '/articles', '/settings'];
    const userRoutes = ['/users'];
    
    switch (roleId) {
        case 1:
            // User thường chỉ có thể truy cập UserPage
            return userRoutes.includes(route);
        case 3:
            // Admin có thể truy cập tất cả
            return true;
        default:
            // Các role khác mặc định có quyền admin
            return true;
    }
};

/**
 * Get role display name
 * @param {number} roleId - User's role ID
 * @returns {string} - Role display name
 */
export const getRoleDisplayName = (roleId) => {
    switch (roleId) {
        case 1:
            return 'Người dùng';
        case 3:
            return 'Quản trị viên';
        default:
            return 'Không xác định';
    }
};
