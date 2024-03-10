import { Component ,OnInit} from '@angular/core';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../Auth/auth.service';
@Component({
  selector: 'app-fechas-agendadas',
  templateUrl: './fechas-agendadas.component.html',
  styleUrls: ['./fechas-agendadas.component.css']
})
export class FechasAgendadasComponent implements OnInit{

  citas: any[] = [];
  constructor(private usuarioService: UsuarioService,public auth:AuthService) {}

  ngOnInit(): void {
     const id_usuario: number = this.auth.id();
    this.usuarioService.obtenerCitasUsuario(id_usuario).subscribe(
      (citas) => {
        this.citas = citas;
        console.log('Citas del usuario:', this.citas);
      },
      (error) => {
        console.error('Error al obtener citas:', error);
      }
    );
  }
}
