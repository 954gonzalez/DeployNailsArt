import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../Auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  citas: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuarioService: UsuarioService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas(): void {
    const fecha: string = this.data.selectedDate.toISOString().split('T')[0];
    const id_usuario: number = this.auth.id(); 
    const rol: string = this.auth.rol();

    this.usuarioService.obtenerCitasPorFecha(fecha, id_usuario, rol).subscribe(
      (citas) => {
        this.citas = citas.map(cita => ({
          ...cita,
          canceladaVisible: cita.estado !== 'realizada' // Ocultar el botón "Cancelar" si la cita está realizada
        }));
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );
  }

  cambiarEstado(idCita: number, nuevoEstado: string, index: number): void {
    this.usuarioService.cambiarEstadoCita(idCita, nuevoEstado).subscribe(
      (response) => {
        console.log('Estado de la cita actualizado correctamente:', response);

        this.citas[index].estado = nuevoEstado;
        if (nuevoEstado === 'realizada') {
          this.citas[index].canceladaVisible = false;
        }
      },
      (error) => {
        console.error('Error al actualizar el estado de la cita:', error);
      }
    );
  }

  eliminarCita(idCita: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor:'#631878',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      },
      iconColor: '#631878',
      iconHtml: '<i class="fas fa-exclamation-triangle"></i>' // Cambia el icono por uno personalizado
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarCita(idCita).subscribe(
          (response) => {
            console.log('Cita eliminada correctamente:', response);
            // Eliminar la cita de la lista
            this.citas = this.citas.filter(cita => cita.id_cita !== idCita);
          },
          (error) => {
            console.error('Error al eliminar la cita:', error);
          }
        );
      }
    });
  }
}
