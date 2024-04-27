<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;
    protected $fillable=[
        'nombre',
        'apellido',
        'telefono',
        'direccion',
        'correo',
        'zona',
        'centro',
        'puesto'
    ];
}
