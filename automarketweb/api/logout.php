<?php
session_start();
session_unset();
session_destroy();
header("Location: /automarketweb/views/login.php");
exit();
?>