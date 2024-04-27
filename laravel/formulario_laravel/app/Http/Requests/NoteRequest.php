<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre'=>'required|max:255|min:3',
            'apellido' => 'required|max:255|min:3',
            'telefono'=>'required|max:255|min:3',
            'direccion' => 'required|max:255|min:3',
            'correo'=>'required|max:255|min:3',
            'zona' => 'required|max:255|min:3',
            'centro'=>'required|max:255|min:3',
            'puesto' => 'required|max:255|min:3'
        
        ];
    }
}
