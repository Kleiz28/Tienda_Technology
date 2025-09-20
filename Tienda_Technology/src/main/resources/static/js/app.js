class TiendaApp{

    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.updateNavigation();
    }

    // User management
    loadCurrentUser() {
        const userData = localStorage.getItem('minimarket_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserDisplay();
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
        this.updateNavigation(); // Actualizar navegación al cambiar usuario
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('minimarket_current_user');
        this.updateNavigation(); // Actualizar navegación al cerrar sesión
        window.location.href = 'login.html';
    }


    updateUserDisplay() {
        const userNameElement = document.getElementById('currentUser');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
    }
}