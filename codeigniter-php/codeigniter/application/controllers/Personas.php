<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Personas extends CI_Controller {

	public function __construct(){
		parent::__construct();
        $this->load->helper('form');
		$this->load->helper('url');
        $this->load->model('Persona');
        $this->load->database();
        
	}
    public function index()
	{
		
	}
	public function listado(){
		$vdata["personas"] = $this->Persona->findAll();

		$this->load->view('personas/listado', $vdata);
	}

	public function guardar($persona_id = null)
	{
		$vdata["nombre"] = $vdata["apellido"] = $vdata["edad"] = "";
		if(isset($persona_id)){
			$persona = $this->Persona->find($persona_id);

			if(isset($persona)){
				$vdata["nombre"]=$persona->nombre;
				$vdata["apellido"]=$persona->apellido;
				$vdata["edad"]=$persona->edad;
			}
		}
       // $this->load->view('personas/guardar');	

        if($this->input->server("REQUEST_METHOD")== "POST"){

            $data["documento"] = $this->input->post("documento");
            $data["nombre"] = $this->input->post("nombre");
            $data["apellido"] = $this->input->post("apellido");
			$data["edad"] = $this->input->post("edad");
            $data["correo"] = $this->input->post("correo");
			$data["direccion"] = $this->input->post("direccion");
			$data["genero"] = $this->input->post("genero");
			// $habi= $this->input->post("habilidades[]");
			// $tama=count($habi);
			// for($i=0; $i<$tama; $i++){
			// 	$data["habilidades"] = $this->input->post("habilidades['$i']");
			// }
			$data["habilidades"] = $this->input->post("habilidades");
			$data["perfil"] = $this->input->post("perfil");
			$data["usuario"] = $this->input->post("usuario");
			$data["contrasenia"] = $this->input->post("contrasenia");
			$data["anio_grado"] = $this->input->post("shirts");

			

			if(isset($persona_id)){
				$this->Persona->update($persona_id, $data);
			}else{
				$this->Persona->insert($data);
			}	
			
		}
			$this->load->view('personas/guardar', $vdata);



            //$this->Persona->insert($data);

	}

    public function ver($persona_id=null){
		$persona =$this->Persona->find($persona_id);

		if(isset($persona)){
			$vdata["nombre"]=$persona->nombre;
			$vdata["apellido"]=$persona->apellido;
			$vdata["edad"]=$persona->edad;

		}else{
			$vdata["nombre"]=$vdata["apellido"]=$vdata["edad"]="";
		}
		$this->load->view('personas/ver', $vdata);
	}
	public function borrar($persona_id=null){
		$this->Persona->delete($persona_id);
		redirect("/personas/listado");
	}
}
