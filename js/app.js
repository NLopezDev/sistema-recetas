// Variables globales
let currentUser = null;
let currentCategory = 'cocina';
let recipes = [];

// Configuración de la API
const API_BASE_URL = 'api';

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Inicializar la aplicación
function initializeApp() {
    // Configurar menú móvil
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('nav-link') || event.target.closest('.nav-link')) {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
        
        // Cerrar menú móvil al hacer clic fuera
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const recipeForm = document.getElementById('recipeForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
    
    if (recipeForm) {
        recipeForm.addEventListener('submit', saveRecipe);
    }
}

// Verificar estado de autenticación
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verificar si el token es válido
        fetch(`${API_BASE_URL}/auth/verify.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                showDashboard();
                loadRecipes(currentCategory);
            } else {
                localStorage.removeItem('authToken');
                showWelcome();
            }
        })
        .catch(error => {
            console.error('Error verificando autenticación:', error);
            localStorage.removeItem('authToken');
            showWelcome();
        });
    } else {
        showWelcome();
    }
}

// Mostrar pantalla de login
function showWelcome() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (loginSection) {
        loginSection.style.display = 'flex';
    }
    
    if (dashboardSection) {
        dashboardSection.style.display = 'none';
    }
    
    currentUser = null;
    
    // Limpiar la navegación
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = '';
    }
    
    // Enfocar automáticamente el campo de email
    setTimeout(() => {
        const emailField = document.getElementById('loginEmail');
        if (emailField) {
            emailField.focus();
        }
    }, 100);
}



// Mostrar dashboard
function showDashboard() {
    console.log('showDashboard iniciado');
    
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    console.log('loginSection encontrado:', !!loginSection);
    console.log('dashboardSection encontrado:', !!dashboardSection);
    
    if (loginSection) {
        loginSection.style.display = 'none';
        console.log('Login section ocultado con style.display');
    }
    
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
        console.log('Dashboard section mostrado');
    }
    
    // Mostrar información del usuario en la navegación
    const navMenu = document.getElementById('navMenu');
    console.log('navMenu encontrado:', !!navMenu);
    console.log('currentUser:', currentUser);
    
    if (navMenu && currentUser) {
        navMenu.innerHTML = `
            <div class="nav-user">Bienvenido, ${currentUser.name}</div>
            <a href="#" class="nav-link" onclick="logout()">Cerrar Sesión</a>
        `;
        console.log('Navegación actualizada');
    }
    
    console.log('showDashboard completado');
}



function showRegister() {
    closeAllModals();
    document.getElementById('registerModal').style.display = 'block';
    
    // Ocultar navegación cuando se abre el modal
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.style.display = 'none';
    }
    
    // Enfocar automáticamente el primer campo
    setTimeout(() => {
        const nameField = document.getElementById('registerName');
        if (nameField) {
            nameField.focus();
        }
    }, 100);
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Restaurar navegación cuando se cierran los modales
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.style.display = 'flex';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    
    // Restaurar navegación cuando se cierra un modal
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.style.display = 'flex';
    }
}

// Función de login
async function login(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    console.log('Iniciando login para:', email);
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            console.log('Usuario actual:', currentUser);
            showNotification('Inicio de sesión exitoso', 'success');
            console.log('Llamando a showDashboard...');
            showDashboard();
            console.log('Llamando a loadRecipes...');
            loadRecipes(currentCategory);
        } else {
            showNotification(data.message || 'Error en el inicio de sesión', 'error');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Función de registro
async function register(event) {
    event.preventDefault();
    
    // Prevenir múltiples envíos
    const submitButton = event.target.querySelector('button[type="submit"]');
    if (submitButton.disabled) {
        return;
    }
    submitButton.disabled = true;
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validaciones adicionales
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Todos los campos son requeridos', 'error');
        submitButton.disabled = false;
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        submitButton.disabled = false;
        return;
    }
    
    if (password.length < 8) {
        showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
        submitButton.disabled = false;
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Registro exitoso. Por favor inicia sesión.', 'success');
            closeAllModals();
            showLogin();
        } else {
            showNotification(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
        submitButton.disabled = false;
    }
}

// Función de logout
function logout() {
    console.log('Logout iniciado');
    
    // Limpiar datos de sesión
    localStorage.removeItem('authToken');
    currentUser = null;
    
    // Mostrar notificación
    showNotification('Sesión cerrada', 'success');
    
    // Limpiar navegación
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = '';
        console.log('Navegación limpiada');
    }
    
    // Ocultar dashboard
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) {
        dashboardSection.style.display = 'none';
        console.log('Dashboard ocultado');
    }
    
    // Mostrar sección de login
    const loginSection = document.getElementById('loginSection');
    if (loginSection) {
        loginSection.style.display = 'block';
        console.log('Sección de login mostrada');
    }
    
    // Enfocar campo de email
    setTimeout(() => {
        const emailField = document.getElementById('loginEmail');
        if (emailField) {
            emailField.focus();
            console.log('Campo email enfocado');
        }
    }, 100);
}

// Funciones de categorías
function selectCategory(category) {
    currentCategory = category;
    
    // Actualizar botones de categoría
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.category-btn').classList.add('active');
    
    // Actualizar título
    const categoryTitle = document.getElementById('categoryTitle');
    if (category === 'cocina') {
        categoryTitle.textContent = 'Recetas de Cocina';
    } else {
        categoryTitle.textContent = 'Recetas de Pastelería';
    }
    
    // Cargar recetas de la categoría
    loadRecipes(category);
}

// Cargar recetas
async function loadRecipes(category) {
    showLoading();
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/recipes/get_recipes.php?category=${category}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            recipes = data.recipes;
            displayRecipes(recipes);
        } else {
            showNotification(data.message || 'Error cargando recetas', 'error');
        }
    } catch (error) {
        console.error('Error cargando recetas:', error);
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

// Mostrar recetas en la interfaz
function displayRecipes(recipes) {
    const recipesGrid = document.getElementById('recipesGrid');
    
    if (recipes.length === 0) {
        recipesGrid.innerHTML = `
            <div class="no-recipes">
                <i class="fas fa-utensils"></i>
                <h3>No hay recetas en esta categoría</h3>
                <p>¡Sé el primero en agregar una receta!</p>
                <button class="btn btn-primary" onclick="showAddRecipeModal()">
                    <i class="fas fa-plus"></i> Agregar Receta
                </button>
            </div>
        `;
        return;
    }
    
    recipesGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-card-header">
                <h3 class="recipe-card-title">${recipe.title}</h3>
                <div class="recipe-card-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.prep_time} min</span>
                    <span><i class="fas fa-signal"></i> ${getDifficultyText(recipe.difficulty)}</span>
                    <span><i class="fas fa-user"></i> ${recipe.user_name}</span>
                </div>
            </div>
            <div class="recipe-card-body">
                <p class="recipe-card-description">${recipe.description}</p>
                <div class="recipe-card-actions">
                    <button class="btn btn-primary btn-sm" onclick="viewRecipe(${recipe.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    ${currentUser && recipe.user_id == currentUser.id ? `
                        <button class="btn btn-warning btn-sm" onclick="editRecipe(${recipe.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${recipe.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Obtener texto de dificultad
function getDifficultyText(difficulty) {
    const difficulties = {
        'facil': 'Fácil',
        'medio': 'Medio',
        'dificil': 'Difícil'
    };
    return difficulties[difficulty] || difficulty;
}

// Funciones de recetas
function showAddRecipeModal() {
    closeAllModals(); // Cerrar otros modales primero
    document.getElementById('recipeModalTitle').innerHTML = '<i class="fas fa-plus"></i> Agregar Nueva Receta';
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeId').value = '';
    document.getElementById('recipeCategory').value = currentCategory;
    document.getElementById('recipeModal').style.display = 'block';
}

function editRecipe(recipeId) {
    const recipe = recipes.find(r => r.id == recipeId);
    if (!recipe) return;
    
    closeAllModals(); // Cerrar otros modales primero
    document.getElementById('recipeModalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Receta';
    document.getElementById('recipeId').value = recipe.id;
    document.getElementById('recipeTitle').value = recipe.title;
    document.getElementById('recipeCategory').value = recipe.category;
    document.getElementById('recipeDescription').value = recipe.description;
    document.getElementById('recipeIngredients').value = recipe.ingredients;
    document.getElementById('recipeInstructions').value = recipe.instructions;
    document.getElementById('recipeTime').value = recipe.prep_time;
    document.getElementById('recipeDifficulty').value = recipe.difficulty;
    
    document.getElementById('recipeModal').style.display = 'block';
}

async function saveRecipe(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const recipeData = {
        id: formData.get('id') || null,
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        ingredients: formData.get('ingredients'),
        instructions: formData.get('instructions'),
        prep_time: formData.get('prepTime'),
        difficulty: formData.get('difficulty')
    };
    
    showLoading();
    
    try {
        const token = localStorage.getItem('authToken');
        const url = recipeData.id ? 
            `${API_BASE_URL}/recipes/update_recipe.php` : 
            `${API_BASE_URL}/recipes/create_recipe.php`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(recipeData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(
                recipeData.id ? 'Receta actualizada exitosamente' : 'Receta creada exitosamente', 
                'success'
            );
            closeModal('recipeModal');
            loadRecipes(currentCategory);
        } else {
            showNotification(data.message || 'Error guardando receta', 'error');
        }
    } catch (error) {
        console.error('Error guardando receta:', error);
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

async function deleteRecipe(recipeId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
        return;
    }
    
    showLoading();
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/recipes/delete_recipe.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: recipeId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Receta eliminada exitosamente', 'success');
            loadRecipes(currentCategory);
        } else {
            showNotification(data.message || 'Error eliminando receta', 'error');
        }
    } catch (error) {
        console.error('Error eliminando receta:', error);
        showNotification('Error de conexión', 'error');
    } finally {
        hideLoading();
    }
}

async function viewRecipe(recipeId) {
    const recipe = recipes.find(r => r.id == recipeId);
    if (!recipe) return;
    
    const detailContent = document.getElementById('recipeDetailContent');
    detailContent.innerHTML = `
        <div class="recipe-detail">
            <div class="recipe-detail-header">
                <h2 class="recipe-detail-title">${recipe.title}</h2>
                <div class="recipe-detail-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.prep_time} minutos</span>
                    <span><i class="fas fa-signal"></i> ${getDifficultyText(recipe.difficulty)}</span>
                    <span><i class="fas fa-user"></i> ${recipe.user_name}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(recipe.created_at)}</span>
                </div>
            </div>
            
            <div class="recipe-detail-section">
                <h3><i class="fas fa-info-circle"></i> Descripción</h3>
                <p>${recipe.description}</p>
            </div>
            
            <div class="recipe-detail-section">
                <h3><i class="fas fa-list"></i> Ingredientes</h3>
                <div class="recipe-detail-ingredients">
                    <ul>
                        ${recipe.ingredients.split('\n').filter(ingredient => ingredient.trim()).map(ingredient => 
                            `<li><i class="fas fa-check"></i> ${ingredient.trim()}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="recipe-detail-section">
                <h3><i class="fas fa-tasks"></i> Instrucciones</h3>
                <div class="recipe-detail-instructions">
                    <ol>
                        ${recipe.instructions.split('\n').filter(instruction => instruction.trim()).map(instruction => 
                            `<li>${instruction.trim()}</li>`
                        ).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('recipeDetailModal').style.display = 'block';
}

// Funciones de utilidad
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Estilos adicionales para elementos dinámicos
const additionalStyles = `
    .no-recipes {
        text-align: center;
        padding: 3rem;
        color: var(--gray-color);
    }
    
    .no-recipes i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .no-recipes h3 {
        margin-bottom: 0.5rem;
        color: var(--dark-color);
    }
    
    .no-recipes p {
        margin-bottom: 2rem;
    }
`;

// Agregar estilos adicionales al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
