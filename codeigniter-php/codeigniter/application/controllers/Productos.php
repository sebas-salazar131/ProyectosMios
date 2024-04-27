<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Productos extends CI_Controller {

	public function __construct(){
		parent::__construct();
        $this->load->helper('form');
        $this->load->model('ProductoBD');
        $this->load->database();
        
	}
    
	public function listado(){
		$vdata["productos"] = $this->ProductoBD->findAll();
		$this->load->view('productos/mostrar', $vdata);
	}

	public function guardar()
	{
		
        $this->load->view('productos/guardar');

        if($this->input->server("REQUEST_METHOD")== "POST"){
            $data["serial"] = $this->input->post("serial");
            $data["nombre"] = $this->input->post("nombre");
            $data["descripcion"] = $this->input->post("descripcion");
            $data["valor"] = $this->input->post("valor");
            $data["cantidad"] = $this->input->post("cantidad");
                
            $this->ProductoBD->insert($data);
        }     

	}

    public function ver($serial=null){
		$producto =$this->ProductoBD->find2($serial);

		if(isset($producto)){
            $vdata["serial"]=$producto->serial;
			$vdata["nombre"]=$producto->nombre;
			$vdata["descripcion"]=$producto->descripcion;
			$vdata["valor"]=$producto->valor;
            $vdata["cantidad"]=$producto->cantidad;

		}else{
			$vdata["serial"]=$vdata["nombre"]=$vdata["descripcion"]=$vdata["valor"]=$vdata["cantidad"]="";
		}
		$this->load->view('productos/ver', $vdata);
	}
    

	public function modificar($serial){
		$this->load->helper('form');
		
		//$this->load->model('Producto_model');
        $data['datos'] = $this->ProductoBD->find($serial);
        $this->load->view('productos/modificar', $data);

		if($this->input->server("REQUEST_METHOD")== "POST"){
            $serial= $this->input->post("serial");
            $data2["serial"] = $this->input->post("serial");
            $data2["nombre"] = $this->input->post("nombre");
            $data2["descripcion"] = $this->input->post("descripcion");
            $data2["valor"] = $this->input->post("valor");
            $data2["cantidad"] = $this->input->post("cantidad");
            $this->ProductoBD->update($serial, $data2);
			redirect('Productos/listado');
		}
	}

    public function eliminar($serial){
        $this->ProductoBD->delete($serial);
		redirect('Productos/listado');
    }

    
}
