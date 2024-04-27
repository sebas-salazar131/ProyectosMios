@extends('layouts.landing')

@section('title', 'Pagina Principal')

@section('content')
    <h1>Este es el contact</h1>
    <h2>pagina secundaria</h2>

    @component('_components.card')
        @slot('title', 'xontenido contact 1')
        @slot('content', 'lorem ...........')
            
        
    @endcomponent

    @component('_components.card')
        @slot('title', 'contenido contact 2')
        @slot('content', 'lorem ...........')
            
        
    @endcomponent
@endsection