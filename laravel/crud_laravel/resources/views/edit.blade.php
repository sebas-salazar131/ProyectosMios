<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="{{route('update', $note->id)}}" method="POST">
        @method('put')
        @csrf
        <label for="">Title</label>
        <input type="text" name="title" value="{{$note->title}}">
        <label for="">Descripcion</label>
        <input type="text" name="descripcion" value="{{$note->descripcion}}">
        <input type="submit" name="enviar">
    </form>
</body>
</html>