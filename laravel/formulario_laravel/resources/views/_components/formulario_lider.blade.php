<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <div class="shadow-lg p-5 mb-5 rounded  position-absolute top-50 start-50 translate-middle ">
		<form action="#" method="POST">
			<h1 class="mb-4 text-center">Formulario lider</h1>
                <div class="mb-2 col-12">
                    <label for="" class="form-label">Cedula</label>
                    <input type="text" class="form-control" name="campo_nombre" >
                </div>
                <div class="mb-2 col-12">
                    <label for="" class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="campo_nombre" >
                </div>
                <div class="mb-2 col-12">
                    <label for="" class="form-label">Apellido</label>
                    <input type="text" class="form-control" name="campo_nombre" >
                </div>
                <div class="mb-2 col-12">
                    <label for="" class="form-label">Telefono</label>
                    <input type="text" class="form-control" name="campo_telefono" >
                </div>
                <div class="mb-2 col-12">
                    <label for="" class="form-label">Lider comunal si/no</label>
                    <input type="text" class="form-control" name="campo_responsable" >
                </div>
                <div class="mb-2 col-12">
                    <label for="" class="form-label">Zona que maneja</label>
                    <input type="text" class="form-control" name="campo_zona" >
                </div>
			<button type="submit" class="btn btn-primary form-control">Enviar</button>
            <a href="{{route('menu')}}">Volver</a>
        </form>

</body>
</html>