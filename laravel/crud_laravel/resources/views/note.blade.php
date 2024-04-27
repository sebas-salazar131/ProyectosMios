<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="{{ route('store')}}" mathod="POST" >
    @csrf
    <label for="">Title</label>
    <input type="text" name="title">
    @error('title')
        <p style="color:red;">{{$message}}</p>
    @enderror
    <label for="">Descripcion</label>
    <input type="text" name="descripcion">
    @error('descripcion')
    <p style="color:red;">{{$message}}</p>
    @enderror


    <input type="submit" name="create">
</form>
</body>
</html>