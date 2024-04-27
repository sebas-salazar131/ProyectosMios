<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    {{-- <h1>Prefijo:{{$user->phone->prefix}}</h1>
    <h1>Prefijo:{{$user->phone->phone_number}}</h1> --}}

    {{-- <h1>{{$user->name}} Phone: </h1>
    <ul>
        @foreach($user->phones as $phone)
            <li>{{$phone->prefix}} {{$phone->phone_number}}</li>
        @endforeach    
    </ul> --}}

    <h1>{{$user->name}} Phone: </h1>
    <ul>
        @foreach($user->roles as $role)
            <li>{{$role->name}} {{$role->pivot->added_by}}</li>
        @endforeach    
    </ul>
</body>
</html>