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

<div class="shadow-lg p-5 mb-5 rounded position-absolute top-50 start-50 translate-middle ">
    <h2 class="text-center">Editar Datos persona</h2>
   
    <form action="{{route('update', $note->id)}}" method="POST">
        @method('put')
        @csrf
        <label for="">Id</label>
        <input type="text" name="id" value="{{$note->id}}" disabled>
        <label for="">Nombre:    </label>
        <input type="text" name="nombre" value="{{$note->nombre}}">
        <hr>
        <label for="">Apellido</label>
        <input type="text" name="apellido" value="{{$note->apellido}}">
        <label for="">Telefono</label>
        <input type="text" name="telefono" value="{{$note->telefono}}">
        <hr>
        <label for="">Direccion</label>
        <input type="text" name="direccion" value="{{$note->direccion}}">
        <label for="">Correo</label>
        <input type="text" name="correo" value="{{$note->correo}}">
        <hr>
        <label for="">Zona</label>
        <Select class="" name="zona">
            <option value="Cuba" >Cuba</option>
            <option value="{{$note->zona}}" selected>{{$note->zona}}</option>
            <option value="Belmonte">Belmonte</option>
            <option value="Provincia">Provincia</option>
        </Select>
        <label for="">Centro</label>
        <Select class="" name="centro">
           <option value="{{$note->centro}}" >{{$note->centro}}</option>
        </Select>
        <hr>
        <label for="">Puesto</label>
        <Select class="" name="puesto">
           <option value="{{$note->puesto}}" >{{$note->puesto}}</option>
        </Select>
        <input type="submit" name="Actualizar">
    </form>
                    
   
</div>
</body>
</html>