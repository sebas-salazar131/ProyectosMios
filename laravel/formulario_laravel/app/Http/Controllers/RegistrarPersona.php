<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Http\Requests\NoteRequest;

class RegistrarPersona extends Controller
{
    public function index(){
        
        return view('index');
    }

    public function store(NoteRequest $request)
    {
       // dd($request->all());
        Person::create($request->all());
        return redirect()->route('index')->with('success', 'Nota Creada');

    }

    /**
     * Display the specified resource.
     */
    // public function show(Person $note){
    //     return view('showPersonas', compact('note'));
    // }

    public function showPersonas(){
        $people = Person::all(); 
        return view('_components/showPersonas', ['people' => $people]);
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function edit(Person $note){
        return view('_components/edit', compact('note'));
    }
    public function update(NoteRequest $request, Person $note)
    {
        $note->update($request->all());
        return redirect()->route('showPersonas')->with('success', 'Nota Actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NoteRequest $request, Person $note)
    {
        $note->delete($request->all());
        return redirect()->route('showPersonas')->with('danger', 'Nota Eliminada');
    }
}
