<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	
	public function index(){
		$this->load->view('iniciar_session');
	}

    public function validarIngreso(){
       // print_r($_POST);
       // echo "<br><br>";
        $email=$this->input->post('campo_email');
        $password=$this->input->post('campo_password');

        if($email!="" && $password!=""){
            $this->load->model('UsuariosModel');
            $this->load->model('PersonasModel');
            $validacion = $this->UsuariosModel->validarIngreso($email, $password);
            
            if($validacion){
             //EXTRAER LOS DATOS DE LA PERSONA Y USUARIO
             $datosPersona=$this->PersonasModel->getPersonaByEmail($email);
             $datosUsuarios=$this->UsuariosModel->getUsuariosByEmail($email);
             //CREAR LA VARIABLE DE SESION   
             $dataSession=[
                              "cedula"=> $datosPersona->cedula,
                              "nombres"=> $datosPersona->nombres,
                              "apellidos"=> $datosPersona->apellidos,
                              "telefono"=> $datosPersona->telefono,
                              "direccion"=> $datosPersona->direccion,
                              "email"=> $datosPersona->email,
                              "foto"=> $datosPersona->foto,
                              "tipo"=> $datosUsuarios->tipo,
                              "estado"=> $datosUsuarios->estado,
             ];
             $this->session->set_userdata("session-mvc",$dataSession);

             //REDIRECCIONAR AL CONTROLADOR INICIAL EL TIPO DE USUARIO
                if($datosUsuarios->tipo=="ADMIN"){
                    redirect('admin/inicio','refresh');
                }else if($datosUsuarios->tipo=="VENDEDOR"){
                    redirect('vendedor/inicio','refresh');
                }else{
                    redirect('Login','refresh');
                }
            }else{
                $data['datosInvalidos']=true;
                $this->load->view('iniciar_session',$data);
            }
        }else{
            
            $data['errorInData']=true;
            $data['email']=$email;
            $data['password']=$password;
            $this->load->view('iniciar_session',$data);
        }
        
    }
    public function cerrarSession(){
        $this->session->sess_destroy();
        redirect('Login', 'refresh');
    }
}
