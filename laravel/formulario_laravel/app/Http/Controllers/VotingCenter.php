<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Centro;
class VotingCenter extends Controller
{
    public function index(){
        return view('centros');
    }
}
