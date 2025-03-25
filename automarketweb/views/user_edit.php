<?php 
include '../includes/header.php'; 
include '../includes/config.php';

if (!isset($_SESSION['id_usuario'])) {
    header("Location: /automarketweb/views/login.php");
    exit();
}

$userId = $_SESSION['id_usuario'];

// Obtener datos actuales del usuario mediante cURL
$endpoint = USERS_SERVICE_URL . '/' . $userId;
$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode != 200) {
    echo "<div class='alert alert-danger text-center'>Error al obtener datos del usuario.</div>";
    include '../includes/footer.php';
    exit();
}

$userData = json_decode($response, true);
?>

<h2 class="fs-2 mb-4 text-center">Editar Perfil de Usuario</h2>
<div class="row justify-content-center">
    <div class="col-md-6">
        <?php
        if (isset($_GET['error'])) {
            echo "<div class='alert alert-danger text-center'>" . htmlspecialchars($_GET['error']) . "</div>";
        }
        if (isset($_GET['success'])) {
            echo "<div class='alert alert-success text-center'>" . htmlspecialchars($_GET['success']) . "</div>";
        }
        ?>
        <form action="/automarketweb/api/user_edit_process.php?id=<?php echo $userId; ?>" method="POST">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required value="<?php echo htmlspecialchars($userData['nombre']); ?>">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" id="email" name="email" class="form-control" required value="<?php echo htmlspecialchars($userData['email']); ?>">
            </div>
            <div class="mb-3">
                <label for="identificacion" class="form-label">Número de Identificación</label>
                <input type="text" id="identificacion" name="identificacion" class="form-control" required value="<?php echo htmlspecialchars($userData['identificacion']); ?>" readonly>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="text" id="telefono" name="telefono" class="form-control" required value="<?php echo htmlspecialchars($userData['telefono']); ?>">
            </div>
            <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input type="text" id="direccion" name="direccion" class="form-control" required value="<?php echo htmlspecialchars($userData['direccion']); ?>">
            </div>
            <div class="mb-3">
                <label for="usuario" class="form-label">Usuario</label>
                <input type="text" id="usuario" name="usuario" class="form-control" required value="<?php echo htmlspecialchars($userData['usuario']); ?>">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <!-- Se prellena con la contraseña actual y es editable -->
                <input type="password" id="password" name="password" class="form-control" required value="<?php echo htmlspecialchars($userData['password']); ?>">
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-success me-2" style="width: 10rem;">Guardar Cambios</button>
                <a href="/automarketweb/views/vehicles.php" class="btn btn-secondary" style="width: 10rem;">Cancelar</a>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>
