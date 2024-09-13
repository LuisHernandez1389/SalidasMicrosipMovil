import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  server: string = 'SERVER'; // Valor predeterminado para el servidor
  databasePath: string = 'C:\\Microsip datos\\SUPER CARQUIN.FDB'; // Valor predeterminado para la ruta de la base de datos
  username: string = ''; // Valor predeterminado para el usuario
  password: string = ''; // Valor predeterminado para la contraseña

  constructor(private http: HttpClient, private router: Router) {}

  connectToMicrosip() {
    const url = 'https://b381-177-231-173-6.ngrok-free.app/api/Microsip/connect'; // URL del endpoint

    const body = {
      server: this.server,
      databasePath: this.databasePath,
      username: this.username,
      password: this.password
    };

    this.http.post<string>(url, body, { responseType: 'text' as 'json' })
      .subscribe(
        response => {
          console.log('Conexión exitosa:', response);
          this.router.navigate(['/salida']); // Redirige al nuevo componente

        },
        error => {
          console.error('Error en la conexión:', error);
          if (error.error) {
            console.error('Detalles del error:', error.error);
          }
        }
      );
  }
  
}