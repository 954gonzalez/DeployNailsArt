import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import Swal from 'sweetalert2';
import { response } from 'express';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  modalAbierta: boolean = false;
  servicios: any[] = [];
  nuevoServicio: any = {};
  nuevoPrecio: number | undefined;
  otraModal: boolean = false;
  servicioSeleccionado: any;

  constructor(private miServicio: UsuarioService) { }

  ngOnInit(): void {
    this.obtenerServicios();
  }
  
  abrirModal() {
    this.modalAbierta = true;
  }
  
  cerrarModal() {
    this.modalAbierta = false;
  }
  
  abrirOtraModal(servicio: any) {
    this.servicioSeleccionado = servicio;
    this.nuevoPrecio = servicio.precio;
    this.otraModal = true;
  }
  
  
  cerrarOtraModal() {
    this.otraModal = false;
  }

  actualizarPrecio() {
    if (this.nuevoPrecio !== undefined && this.servicioSeleccionado) {
      const idServicio = this.servicioSeleccionado.id_servicio;
      this.miServicio.actualizarPrecioServicio(idServicio, this.nuevoPrecio).subscribe(
        (response: any) => {
          console.log('Precio del servicio actualizado:', response);
          this.obtenerServicios();
          Swal.fire({
            icon: "success",
            title: "¡Precio Actualizado!'",
            text: "El Precio del servicio ha actualizado",
            showConfirmButton: false,
            timer: 2000,
            iconColor: "#631878"
          });
        },
        (error) => {
          console.error('Error al actualizar el precio del servicio:', error);
        }
      );
    } else {
      console.error('El nuevo precio es undefined o no se ha seleccionado un servicio');
    }
  }
  
  
  obtenerServicios() {
    this.miServicio.getConfiguracion().subscribe(
      (data: any) => {
        this.servicios = data.servicios;
      },
      (error) => {
        console.error('Error al obtener los servicios:', error);
      }
    );
  }

  onSubmitForm() {
    this.miServicio.createServicio(this.nuevoServicio).subscribe(
      (response: any) => {
        console.log('Servicio creado:', response);
        this.obtenerServicios();
        this.nuevoServicio = {};
        this.cerrarModal();
        Swal.fire({
          icon: "success",
          title: "¡Agregado el servicio!'",
          text: "El servicio ha agregado",
          showConfirmButton: false,
          timer: 2000,
          iconColor: "#631878"
        });
      },
      (error) => {
        console.error('Error al crear el servicio:', error);
      }
    );
  }

  eliminarServicio(id_servicio:number): void{
    if (!id_servicio || id_servicio <= 0) {
      console.error('Id del servicio no valido',id_servicio);
      return
    }

    console.log('id del servicio',id_servicio);
    this.miServicio.eliminarServicio(id_servicio).subscribe(
      (response) =>{
        console.log('servicio elimando con exito:', response);
        this.obtenerServicios();
        Swal.fire({
          title: 'Éxito',
          text: 'Operación realizada con éxito.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      (Error)=>{
        console.error('error al eliminar el servicio', Error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al realizar la operación. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    )
    
  }
}
