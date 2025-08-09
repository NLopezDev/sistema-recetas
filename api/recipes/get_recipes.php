<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
    
    // Obtener categoría del query parameter
    $category = $_GET['category'] ?? '';
    
    if (!in_array($category, ['cocina', 'pasteleria'])) {
        throw new Exception('Categoría inválida');
    }
    
    // Conectar a la base de datos
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Error de conexión a la base de datos');
    }
    
    // Obtener recetas de la categoría
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
        WHERE r.category = ?
        ORDER BY r.created_at DESC
    ");
    
    $stmt->execute([$category]);
    $recipes = $stmt->fetchAll();
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Recetas obtenidas exitosamente',
        'recipes' => $recipes,
        'count' => count($recipes)
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
    error_log("Error de base de datos obteniendo recetas: " . $e->getMessage());
}
?>
