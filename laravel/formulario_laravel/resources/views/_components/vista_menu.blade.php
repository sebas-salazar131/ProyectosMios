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
			<h1 class="mb-4 text-center">Menu</h1>
                <div class="mb-2 col-12">
                   
                    
                    <a href="{{route("index")}}">Formulario persona</a>
                </div>
                <div class="mb-2 col-12">
                    <a href="{{route('centros')}}">Formulario centros</a>
                    
                </div>
                <div class="mb-2 col-12">
                    <a href="{{route('lider')}}">Formulario lideres</a>
                    
                </div>
                
			
        </form>

</body>
</html>