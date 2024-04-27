<?php
  session_start();

  session_unset();
  session_destroy();

  header("Location: http://localhost/Conexion_BD/Agroecologia/registrar_cliente.php");
  echo "sapo";
  exit();
?>