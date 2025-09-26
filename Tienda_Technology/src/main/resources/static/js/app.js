/**
 * Script principal con lógica común para toda la aplicación.
 * Archivo: src/main/resources/static/js/main.js
 */

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Configura la interactividad del sidebar responsivo.
     */
    function setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const openSidebarBtn = document.getElementById('open-sidebar');
        const closeSidebarBtn = document.getElementById('close-sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (openSidebarBtn && sidebar) {
            openSidebarBtn.addEventListener('click', function() {
                sidebar.classList.add('active');
                if (sidebarOverlay) sidebarOverlay.classList.add('active');
            });
        }

        function closeSidebar() {
            if (sidebar) sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }

        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', closeSidebar);
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }
    }

    // Inicializar la funcionalidad del sidebar
    setupSidebar();
});

class TiendaApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.updateNavigation();
    }

    // User management
    loadCurrentUser() {
        const userData = localStorage.getItem('minimarket_current_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateUserDisplay();
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('minimarket_current_user');
            }
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Profile button
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfile();
            });
        }
    }

    updateNavigation() {
        const userDropdownItem = document.getElementById('userDropdownItem');
        const loginLinkItem = document.getElementById('loginLinkItem');
        const userNameDisplay = document.getElementById('userNameDisplay');

        if (this.currentUser) {
            // Usuario logueado - mostrar dropdown y ocultar login link
            if (userDropdownItem) userDropdownItem.classList.remove('d-none');
            if (loginLinkItem) loginLinkItem.classList.add('d-none');
            if (userNameDisplay) {
                userNameDisplay.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            }
        } else {
            // Usuario no logueado - ocultar dropdown y mostrar login link
            if (userDropdownItem) userDropdownItem.classList.add('d-none');
            if (loginLinkItem) loginLinkItem.classList.remove('d-none');
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('minimarket_current_user', JSON.stringify(user));
        this.updateUserDisplay();
        this.updateNavigation();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('minimarket_current_user');
        this.updateNavigation();
        window.location.href = '/login';
    }

    showProfile() {
        alert('Funcionalidad de perfil en desarrollo');
    }

    updateUserDisplay() {
        const userNameElement = document.getElementById('currentUser');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.tiendaApp = new TiendaApp();
});