// Variables globales para demo
let currentUser = null;
let currentCategory = 'cocina';
let recipes = [];

// Datos demo
const demoRecipes = [
    {
        id: 1,
        title: "Pasta Carbonara",
        description: "Clásica pasta italiana con huevo, queso y panceta",
        ingredients: "400g pasta\n200g panceta\n4 huevos\n100g queso parmesano\nSal y pimienta",
        instructions: "1. Cocinar la pasta al dente\n2. Freír la panceta hasta que esté crujiente\n3. Batir los huevos con el queso\n4. Mezclar todo y servir caliente",
        category: "cocina",
        prep_time: 30,
        difficulty: "medio",
        user_id: 1,
        created_at: "2025-08-09 10:00:00"
    },
    {
        id: 2,
        title: "Tarta de Chocolate",
        description: "Deliciosa tarta de chocolate con cobertura brillante",
        ingredients: "200g chocolate negro\n150g mantequilla\n4 huevos\n100g azúcar\n100g harina",
        instructions: "1. Derretir chocolate y mantequilla\n2. Batir huevos con azúcar\n3. Mezclar ingredientes\n4. Hornear a 180°C por 25 minutos",
        category: "pasteleria",
        prep_time: 45,
        difficulty: "facil",
        user_id: 1,
        created_at: "2025-08-09 11:00:00"
    },
    {
        id: 3,
        title: "Paella Valenciana",
        description: "Auténtica paella española con mariscos y azafrán",
        ingredients: "300g arroz\n500g mariscos\n1 cebolla\n2 tomates\nAzafrán\nCaldo de pescado",
        instructions: "1. Sofreír cebolla y tomate\n2. Agregar arroz y azafrán\n3. Añadir caldo caliente\n4. Cocinar sin remover hasta que esté listo",
        category: "cocina",
        prep_time: 60,
        difficulty: "dificil",
        user_id: 1,
        created_at: "2025-08-09 12:00:00"
    }
];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    // Cargar recetas demo al inicio
    recipes = [...demoRecipes];
    loadRecipes(currentCategory);
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
    const recipeForm = document.getElementById('recipeForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', demoLogin);
    }
    
    if (recipeForm) {
        recipeForm.addEventListener('submit', saveRecipe);
    }
}

// Función de login demo
function demoLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Credenciales demo
    if (email === 'demo@example.com' && password === 'demo123') {
        currentUser = {
            id: 1,
            name: 'Usuario Demo',
            email: 'demo@example.com'
        };
        
        showNotification('Inicio de sesión exitoso - Modo Demo', 'success');
        showDashboard();
        loadRecipes(currentCategory);
    } else {
        showNotification('Credenciales incorrectas. Usa: demo@example.com / demo123', 'error');
    }
}

// Mostrar dashboard
function showDashboard() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (loginSection) {
        loginSection.style.display = 'none';
    }
    
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
    }
    
    // Mostrar información del usuario en la navegación
    const navMenu = document.getElementById('navMenu');
    if (navMenu && currentUser) {
        navMenu.innerHTML = `
            <div class="nav-user">Bienvenido, ${currentUser.name}</div>
            <a href="#" class="nav-link" onclick="logout()">Cerrar Sesión</a>
        `;
    }
}

// Función de logout
function logout() {
    currentUser = null;
    showNotification('Sesión cerrada', 'success');
    
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = '';
    }
    
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) {
        dashboardSection.style.display = 'none';
    }
    
    const loginSection = document.getElementById('loginSection');
    if (loginSection) {
        loginSection.style.display = 'flex';
    }
    
    // Enfocar el campo de email
    setTimeout(() => {
        const emailField = document.getElementById('loginEmail');
        if (emailField) {
            emailField.focus();
        }
    }, 100);
}

// Seleccionar categoría
function selectCategory(category) {
    currentCategory = category;
    
    // Actualizar botones
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.category-btn').classList.add('active');
    
    // Actualizar título
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) {
        categoryTitle.textContent = `Recetas de ${category === 'cocina' ? 'Cocina' : 'Pastelería'}`;
    }
    
    // Cargar recetas
    loadRecipes(category);
}

// Cargar recetas (demo)
function loadRecipes(category) {
    const filteredRecipes = recipes.filter(recipe => recipe.category === category);
    displayRecipes(filteredRecipes);
}

// Mostrar recetas
function displayRecipes(recipes) {
    const recipesGrid = document.getElementById('recipesGrid');
    if (!recipesGrid) return;
    
    if (recipes.length === 0) {
        recipesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6c757d;">
                <i class="fas fa-utensils" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No hay recetas en esta categoría</h3>
                <p>¡Sé el primero en agregar una receta!</p>
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
                    <span><i class="fas fa-calendar"></i> ${formatDate(recipe.created_at)}</span>
                </div>
            </div>
            <div class="recipe-card-body">
                <p class="recipe-card-description">${recipe.description}</p>
            </div>
            <div class="recipe-card-actions">
                <button class="btn btn-primary btn-sm" onclick="viewRecipe(${recipe.id})">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn btn-warning btn-sm" onclick="editRecipe(${recipe.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${recipe.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
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

// Mostrar modal de agregar receta
function showAddRecipeModal() {
    closeAllModals();
    document.getElementById('addRecipeModal').style.display = 'block';
}

// Cerrar todos los modales
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Cerrar modal específico
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Guardar receta (demo)
function saveRecipe(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newRecipe = {
        id: recipes.length + 1,
        title: formData.get('title'),
        description: formData.get('description'),
        ingredients: formData.get('ingredients'),
        instructions: formData.get('instructions'),
        category: formData.get('category'),
        prep_time: parseInt(formData.get('prep_time')),
        difficulty: formData.get('difficulty'),
        user_id: currentUser ? currentUser.id : 1,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    recipes.push(newRecipe);
    
    showNotification('Receta guardada exitosamente (Demo)', 'success');
    closeModal('addRecipeModal');
    
    // Limpiar formulario
    event.target.reset();
    
    // Recargar recetas
    loadRecipes(currentCategory);
}

// Ver receta
function viewRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content large">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <div class="recipe-detail">
                <div class="recipe-detail-header">
                    <h2 class="recipe-detail-title">${recipe.title}</h2>
                    <div class="recipe-detail-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.prep_time} minutos</span>
                        <span><i class="fas fa-signal"></i> ${getDifficultyText(recipe.difficulty)}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(recipe.created_at)}</span>
                    </div>
                </div>
                
                <div class="recipe-detail-section">
                    <h3>Descripción</h3>
                    <p>${recipe.description}</p>
                </div>
                
                <div class="recipe-detail-section">
                    <h3>Ingredientes</h3>
                    <div class="recipe-detail-ingredients">
                        <ul>
                            ${recipe.ingredients.split('\n').map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="recipe-detail-section">
                    <h3>Instrucciones</h3>
                    <div class="recipe-detail-instructions">
                        <ol>
                            ${recipe.instructions.split('\n').map(instruction => `<li>${instruction.trim()}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Editar receta (demo - muestra mensaje)
function editRecipe(recipeId) {
    showNotification('Función de edición disponible en la versión completa', 'warning');
}

// Eliminar receta (demo)
function deleteRecipe(recipeId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
        recipes = recipes.filter(r => r.id !== recipeId);
        showNotification('Receta eliminada (Demo)', 'success');
        loadRecipes(currentCategory);
    }
}

// Mostrar registro (demo - muestra mensaje)
function showRegister() {
    showNotification('Registro disponible en la versión completa con backend', 'info');
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
