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
    <table class="table table-striped">
        <th>Id</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Telefono</th>
        <th>Direccion</th>
        <th>Correo</th>
        <th>zona</th>
        <th>centro</th>
        <th>puesto</th>
        <th>Editar</th>
        <th>Eliminar</th>
        <tbody>
            @forelse($people as $note)
                <tr>
                    <td>{{$note->id}}</td>
                    <td>{{$note->nombre}}</td>
                    <td>{{$note->apellido}}</td>
                    <td>{{$note->telefono}}</td>
                    <td>{{$note->direccion}}</td>
                    <td>{{$note->correo}}</td>
                    <td>{{$note->zona}}</td>
                    <td>{{$note->centro}}</td>
                    <td>{{$note->puesto}}</td>
                    <td> <form action="{{route('destroy', $note->id)}}" method="POST">
                          @method('DELETE') 
                         @csrf
                        <input type="submit" value="DELETE">
                        </form>
                    </td>
                    <td> <a href="{{route('edit', $note->id)}}">Editar</a></td>
                </tr>
            @empty
            <li>Lista vacia</li>
                
            @endforelse
        </tbody>

       
    
    </table>
    <a href="{{route('index')}}">Volver</a>
</div>
</body>
</html>