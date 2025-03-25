<?php include '../includes/header.php'; ?>

<div class="row justify-content-center">
    <div class="col-md-6">
        <h2 class="fs-2 mb-4 text-center">Registro de Usuario</h2>
        <?php
        if (isset($_GET['error'])) {
            echo "<div class='alert alert-danger text-center'>" . htmlspecialchars($_GET['error']) . "</div>";
        }
        if (isset($_GET['success'])) {
            echo "<div class='alert alert-success text-center'>" . htmlspecialchars($_GET['success']) . "</div>";
        }
        ?>
        <form action="/automarketweb/api/register_process.php" method="POST">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="identificacion" class="form-label">Número de Identificación</label>
                <input type="text" id="identificacion" name="identificacion" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="text" id="telefono" name="telefono" class="form-control">
            </div>
            <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input type="text" id="direccion" name="direccion" class="form-control">
            </div>
            <div class="mb-3">
                <label for="usuario" class="form-label">Usuario</label>
                <input type="text" id="usuario" name="usuario" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <div class="text-center">
                <button type="submit" class="btn btn-success">Registrarse</button>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>
