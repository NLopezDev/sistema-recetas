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
    
    // Validaciones
    if ($recipe_id <= 0) {
        throw new Exception('ID de receta inválido');
    }
    
    // Conectar a la base de datos
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Error de conexión a la base de datos');
    }
    
    // Verificar que la receta existe y pertenece al usuario
    $stmt = $db->prepare("SELECT user_id, title FROM recipes WHERE id = ?");
    $stmt->execute([$recipe_id]);
    $recipe = $stmt->fetch();
    
    if (!$recipe) {
        throw new Exception('Receta no encontrada');
    }
    
    if ($recipe['user_id'] != $user_data['id']) {
        throw new Exception('No tienes permisos para eliminar esta receta');
    }
    
    // Eliminar receta
    $stmt = $db->prepare("DELETE FROM recipes WHERE id = ? AND user_id = ?");
    $result = $stmt->execute([$recipe_id, $user_data['id']]);
    
    if (!$result) {
        throw new Exception('Error al eliminar la receta');
    }
    
    // Verificar que se eliminó correctamente
    if ($stmt->rowCount() === 0) {
        throw new Exception('No se pudo eliminar la receta');
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Receta eliminada exitosamente',
        'deleted_recipe' => [
            'id' => $recipe_id,
            'title' => $recipe['title']
        ]
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
    error_log("Error de base de datos eliminando receta: " . $e->getMessage());
}
?>
