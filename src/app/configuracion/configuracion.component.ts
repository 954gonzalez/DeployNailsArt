import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import Swal from 'sweetalert2';
import { AuthService } from '../Auth/auth.service';
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
  selected: Date = new Date(); // Define la propiedad y asigna un valor inicial
  citasPorFecha: any[] = [];
  fechaSeleccionada: string = '';

  constructor(private miServicio: UsuarioService, public auth:AuthService) { }

  ngOnInit(): void {
    this.obtenerServicios();
    this.obtenerCitasPorFecha();
  }

  onDateSelected(selectedDate: Date) {
    this.selected = selectedDate; // Actualiza la fecha seleccionada
    this.fechaSeleccionada = this.formatDate(selectedDate); // Formatea la fecha para la consulta
    this.obtenerCitasPorFecha(); // Obtiene las citas para la fecha seleccionada
  }

  obtenerCitasPorFecha() {  
    const id_usuario: number = this.auth.id(); 
    const rol: string=this.auth.rol()
    this.miServicio.obtenerCitasPorFecha(this.fechaSeleccionada,id_usuario,rol).subscribe(
      (citas: any[]) => {
        this.citasPorFecha = citas;
      },
      error => {
        console.error('Error al obtener citas por fecha:', error);
        // Manejo de errores aquí
      }
    );
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

  formatDate(date: Date): string {
    // Formatea la fecha a 'YYYY-MM-DD' (formato esperado por el backend)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }
}