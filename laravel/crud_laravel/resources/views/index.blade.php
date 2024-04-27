<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    @if($message= Session::get('success'))
        <div style="padding: 15px; background-color: green; color:white">
        <p>{{$message}}</p></div>
    @endif    
    @if($message= Session::get('danger'))
    <div style="padding: 15px; background-color: red; color:white">
    <p>{{$message}}</p></div>    
    @endif

    <a href="{{route('create')}}">Crear nueva nota</a>
    <h1>Listado</h1>
    <ul>
        @forelse($notes as $note)

        <li>
            <a href="{{route('show', $note->id)}}">{{$note->title}}</a>
            <a href="{{route('edit', $note->id)}}">Editar</a>

            <form action="{{route('destroy', $note->id)}}" method="POST">
            @csrf
            @method('DELETE')
            <input type="submit" value="DELETE">
            </form>
        </li>

        @empty
        <li>Lista vacia</li>
            
        @endforelse
    </ul>
</body>
</html>