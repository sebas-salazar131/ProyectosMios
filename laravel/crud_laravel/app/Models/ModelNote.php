<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelNote extends Model
{
    use HasFactory;
    protected $fillable=[
        'title',
        'descripcion',
    ];
}
