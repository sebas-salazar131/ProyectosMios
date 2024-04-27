<?php
   $dataHeader['titulo']= "Perfil";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>



<section class="breadcrumb-section set-bg mt-5" data-setbg="<?php echo base_url("assets/distCliente/img/cana.jpg");?>">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <div class="breadcrumb__text">
                        <h2>Contactanos</h2>
                        <div class="breadcrumb__option">
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<section class="contact spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6 text-center">
                    <div class="contact__widget">
                        <span class="icon_phone"></span>
                        <h4>Telefono</h4>
                        <p>311 782 1213</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 text-center">
                    <div class="contact__widget">
                        <span class="icon_pin_alt"></span>
                        <h4>Direccion</h4>
                        <p>Pereira</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 text-center">
                    <div class="contact__widget">
                        <span class="icon_clock_alt"></span>
                        <h4>Horario de atencion</h4>
                        <p>10:00 am a 6:00 pm</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6 text-center">
                    <div class="contact__widget">
                        <span class="icon_mail_alt"></span>
                        <h4>Correo</h4>
                        <p>dueña@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Contact Section End -->

    <!-- Map Begin -->
    <div class="map">
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.8689118698385!2d-75.68999664687429!3d4.792538172761234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38876503059207%3A0xd5671df2301e9a3b!2sUTP!5e0!3m2!1ses!2sco!4v1712160696800!5m2!1ses!2sco" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div class="map-inside">
            <i class="icon_pin"></i>
            <div class="inside-widget">
                <h4>Pereira</h4>
                <ul>
                    <li>Telefono:311 782 1213 </li>
                    <li>Direccion: Cra. 27 #10-02, Pereira, Risaralda</li>
                </ul>
            </div>
        </div>
    </div>
    <!-- Map End -->
        <br>
        <br>
    <!-- Contact Form Begin -->
    <div class="contact-form spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="contact__form__title">
                        <h2>Dejanos un mensaje</h2>
                    </div>
                </div>
            </div>
            <form action="#">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <input type="text" placeholder="Tu nombre">
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <input type="text" placeholder="Tu correo">
                    </div>
                    <div class="col-lg-12 text-center">
                        <textarea placeholder="Tu mensaje"></textarea>
                        <button type="submit" class="site-btn">ENVIAR MENSAJE</button>
                    </div>
                </div>
            </form>
        </div>
    </div>















<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>