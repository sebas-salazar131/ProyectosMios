<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrador</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="index_admi.css">
</head>
<body>
    <div class="formulario container">
            <form action="index_cliente.php" class="d-inline-block border border-secondary rounded margen shadow-lg">
                <h2>Agroecologia</h2><hr><br>
                    <!-- boton producto -->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                    Agregar Producto
                    </button>
                    <!-- boton agricultor -->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Agregar Agricultor 
                    </button>
            </form>
    </div>



    <!-- Modal Agricultor-->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Datos Agricultor</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="registrar_agricultor.php">
                    <div class="modal-body">
                            <div class="input-group">
                                <input type="text" aria-label="First name" name="nombre" placeholder="Nombres" class="form-control">
                                <input type="text" aria-label="Last name" name="apellido" placeholder="Apellidos" class="form-control">
                            </div><br>
                            <div class="input-group mb-3">
                                <input type="number" class="form-control" name="telefono" placeholder="Telefono" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" name="ubicacion"  placeholder="Ubicacion" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            
                            
                            <div class="row input container">
                            <form>
                                <input type="checkbox" name="opcion" value="opcion1" id="opcion1">
                                <label for="opcion1">Opción 1</label><br>

                                <input type="checkbox" name="opcion" value="opcion2" id="opcion2">
                                <label for="opcion2">Opción 2</label><br>

                                <input type="checkbox" name="opcion" value="opcion3" id="opcion3">
                                <label for="opcion3">Opción 3</label><br>
                            </form>
                                
                          </div><br>
                          <div class="modal-footer justify-content-center">
                             <input type="submit" class="btn btn-primary" value="Registrarse"></input>
                         </div>
                    </div>
                </form>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary">Guardar</button>
            </div>
            </div>
        </div>
    </div>

     Modal Producto
     <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel1">Datos Producto</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary">Guardar</button>
            </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
</body>
</html>