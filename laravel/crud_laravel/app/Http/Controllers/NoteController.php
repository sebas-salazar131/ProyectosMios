<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ModelNote;
use App\Http\Requests\NoteRequest;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = ModelNote::all();
        return view('index', compact('notes'));
    }
    public function create(){
        return view('note');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NoteRequest $request)
    {
        ModelNote::create($request->all());
        return redirect()->route('index')->with('success', 'Nota Creada');

    }

    /**
     * Display the specified resource.
     */
    public function show(ModelNote $note){
        return view('show', compact('note'));
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function edit(ModelNote $note){
        return view('edit', compact('note'));
    }
    public function update(NoteRequest $request, ModelNote $note)
    {
        $note->update($request->all());
        return redirect()->route('index')->with('success', 'Nota Actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NoteRequest $request, ModelNote $note)
    {
        $note->delete($request->all());
        return redirect()->route('index')->with('danger', 'Nota Eliminada');
    }
}
