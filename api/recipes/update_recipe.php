<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

require_once '../config/database.php';
require_once '../config/jwt_helper.php';

try {
    // Verificar autenticación
    $token = JWTHelper::getTokenFromHeader();
    
    if (!$token) {
        throw new Exception('Token no proporcionado');
    }
    
    $user_data = JWTHelper::getUserFromToken($token);
    
    if (!$user_data) {
        throw new Exception('Token inválido o expirado');
    }
    
    // Obtener datos del request
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos inválidos');
    }
    
    $recipe_id = intval($input['id'] ?? 0);
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $ingredients = trim($input['ingredients'] ?? '');
    $instructions = trim($input['instructions'] ?? '');
    $category = $input['category'] ?? '';
    $prep_time = intval($input['prep_time'] ?? 0);
    $difficulty = $input['difficulty'] ?? '';
    
    // Validaciones
    if ($recipe_id <= 0) {
        throw new Exception('ID de receta inválido');
    }
    
    if (empty($title) || empty($description) || empty($ingredients) || empty($instructions)) {
        throw new Exception('Todos los campos son requeridos');
    }
    
    if (strlen($title) < 3 || strlen($title) > 255) {
        throw new Exception('El título debe tener entre 3 y 255 caracteres');
    }
    
    if (strlen($description) < 10 || strlen($description) > 1000) {
        throw new Exception('La descripción debe tener entre 10 y 1000 caracteres');
    }
    
    if (strlen($ingredients) < 10 || strlen($ingredients) > 2000) {
        throw new Exception('Los ingredientes deben tener entre 10 y 2000 caracteres');
    }
    
    if (strlen($instructions) < 20 || strlen($instructions) > 5000) {
        throw new Exception('Las instrucciones deben tener entre 20 y 5000 caracteres');
    }
    
    if (!in_array($category, ['cocina', 'pasteleria'])) {
        throw new Exception('Categoría inválida');
    }
    
    if ($prep_time < 1 || $prep_time > 1440) { // Máximo 24 horas
        throw new Exception('El tiempo de preparación debe estar entre 1 y 1440 minutos');
    }
    
    if (!in_array($difficulty, ['facil', 'medio', 'dificil'])) {
        throw new Exception('Dificultad inválida');
    }
    
    // Conectar a la base de datos
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Error de conexión a la base de datos');
    }
    
    // Verificar que la receta existe y pertenece al usuario
    $stmt = $db->prepare("SELECT user_id FROM recipes WHERE id = ?");
    $stmt->execute([$recipe_id]);
    $recipe = $stmt->fetch();
    
    if (!$recipe) {
        throw new Exception('Receta no encontrada');
    }
    
    if ($recipe['user_id'] != $user_data['id']) {
        throw new Exception('No tienes permisos para editar esta receta');
    }
    
    // Actualizar receta
    $stmt = $db->prepare("
        UPDATE recipes 
        SET title = ?, description = ?, ingredients = ?, instructions = ?, 
            category = ?, prep_time = ?, difficulty = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    ");
    
    $result = $stmt->execute([
        $title,
        $description,
        $ingredients,
        $instructions,
        $category,
        $prep_time,
        $difficulty,
        $recipe_id,
        $user_data['id']
    ]);
    
    if (!$result) {
        throw new Exception('Error al actualizar la receta');
    }
    
    // Obtener la receta actualizada
    $stmt = $db->prepare("
        SELECT 
            r.id,
            r.title,
            r.description,
            r.ingredients,
            r.instructions,
            r.category,
            r.prep_time,
            r.difficulty,
            r.created_at,
            r.updated_at,
            u.name as user_name,
            u.id as user_id
        FROM recipes r
        INNER JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
    ");
    
    $stmt->execute([$recipe_id]);
    $updated_recipe = $stmt->fetch();
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Receta actualizada exitosamente',
        'recipe' => $updated_recipe
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
    error_log("Error de base de datos actualizando receta: " . $e->getMessage());
}
?>
