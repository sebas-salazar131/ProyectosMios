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
		<form action="store" method="POST">
          @csrf
			<h1 class="mb-4 text-center">Registrar persona</h1>
            <div class="row">
                    <div class="mb-2 col-6">
                        <label for="" class="form-label">Nombre</label>
                       
                        <input type="text" class="form-control " name="nombre" >
                        @error('nombre')
                            <p style="color:red;">{{$message}}</p>
                        @enderror
                    </div>
                    <div class="mb-2 col-6">
                        <label for="" class="form-label">Apellido</label>
                        <input type="text" class="form-control" name="apellido" >
                        @error('apellido')
                            <p style="color:red;">{{$message}}</p>
                        @enderror
                    </div>
            </div>
			
            <div class="row">
                <div class="mb-2 col-6">
                    <label for="" class="form-label">Telefono</label>
                    <input type="text" class="form-control" name="telefono" >
                    @error('telefono')
                            <p style="color:red;">{{$message}}</p>
                        @enderror
                </div>
                <div class="mb-2 col-6">
                    <label for="" class="form-label">Direccion</label>
                    <input type="text" class="form-control" name="direccion" >
                    @error('nombre')
                            <p style="color:red;">{{$message}}</p>
                        @enderror
                </div>
            </div>
            
            <div class="mb-2 ">
				<label for="" class="form-label">Correo</label>
				<input type="text" class="form-control" name="correo" >
                @error('nombre')
                    <p style="color:red;">{{$message}}</p>
                @enderror
			</div>
            <div class="mb-2 ">
                <label for="" class="form-label" >Zona</label>
				<Select class="form-control" name="zona">
                    <option value="Cuba" >Cuba</option>
                    <option value="Centro" selected>Centro</option>
                    <option value="Belmonte">Belmonte</option>
                    <option value="Provincia">Provincia</option>
                </Select>
			</div>
            <div class="mb-2 ">
                <label for="" class="form-label">Centro</label>
				<Select class="form-control" name="centro">
                    <option value="IE Carlota" >IE Carlota</option>
                </Select>
                    ¿Registrar Centro?
                    <a href="{{route('centros')}}">Click Aqui</a>
            </div>
            <div class="mb-5 ">
                <label for="" class="form-label">Puesto</label>
				<Select class="form-control"  name="puesto">
                    <option value="Puesto" >A.A</option>
                </Select>
			</div>
            
            
			<button type="submit" class="btn btn-primary form-control">Enviar</button>
            <a href="{{route('showPersonas')}}">Ver personas</a>

            
       </form>
       <br> 
        {{-- <div class="mt-1 mr-2 ">
            ¿Desea Registrarse?
            <a href="registrar/">Click Aqui</a>
            
        </div> --}}
		
	</div>
</body>
</html>