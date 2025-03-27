<?php
// Inicia la sesión si no está activa
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoMarket</title>
  <!-- Bootstrap CSS (CDN) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
  <!-- Estilos personalizados -->
  <link rel="stylesheet" href="../assets/css/style.css">
  <style>
    /* Ajuste opcional para asegurar que todos los enlaces del navbar tengan la misma altura */
    .navbar-nav .nav-link {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
  </style>
</head>
<body>
  <header class="container-fluid py-3" style="background-color: #343a40;">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <!-- Lado izquierdo: Logo y nombre de la aplicación -->
        <a class="navbar-brand d-flex align-items-center" href="..">
          <img src="../assets/images/logo.png" alt="Logo" style="width: 5rem; height: auto; margin-right: 0.5rem;">
          <span class="fs-3 text-white">AutoMarket</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Lado derecho: Menú de navegación -->
        <div class="collapse navbar-collapse justify-content-end" id="navMenu">
          <ul class="navbar-nav align-items-center">
            <li class="nav-item">
              <a class="nav-link text-white" href="../views/vehicles.php">Vehículos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="../views/contracts_history.php">Contratos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="../views/vehicle_sale.php">Ventas</a>
            </li>
            <?php if (isset($_SESSION['id_usuario'])): ?>
              <!-- Dropdown para usuario autenticado -->
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="me-2"><?php echo isset($_SESSION['nombre']) ? htmlspecialchars($_SESSION['nombre']) : 'Usuario'; ?></span>
                  <i class="bi bi-person-circle fs-3" style="color: white;"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><a class="dropdown-item" href="../views/user_edit.php">Editar Perfil</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="../api/logout.php">Cerrar Sesión</a></li>
                </ul>
              </li>
            <?php else: ?>
              <li class="nav-item">
                <a class="nav-link text-white" href="../views/login.php">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="../views/register.php">Registro</a>
              </li>
            <?php endif; ?>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <main class="container my-4">
