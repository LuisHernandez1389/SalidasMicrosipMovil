import { Component, OnInit, ViewChildren,ViewChild , QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-salida',
  templateUrl: './salida.page.html',
  styleUrls: ['./salida.page.scss'],
})

export class SalidaPage implements OnInit {
  
  datos: any = { almacenes: [], conceptos: [] }; // Inicializar con estructuras vacías
  selectedAlmacen: any; // Declarar las propiedades
  selectedConcepto: any; // Declarar las propiedades
  selectedDestino: any;
  selectedFecha: string = ''; 
  claveArticulo: string = ''; // Para almacenar la clave introducida
  articulos: any[] = [];
  nombreArticulo: string = ''; // Para almacenar el nombre del artículo
  unidadArticulo: string = ''; // Para almacenar la unidad del artículo
  numRenglones: number = 0; 
  renglones: Array<{ claveArticulo: string, nombreArticulo: string, unidadArticulo: string, articuloId:string }> = [];
  descripcion: string = ''; // Para almacenar la descripción
  folio: string = ''; // Inicializado como cadena vacía
  centroCostoId: number = 0; // Para almacenar el centro de costo
  selectedArticulo: number | null = null; // Valor seleccionado (articuloId)
  articuloId: string = ''; //


  @ViewChild('unidadInput') unidadInput!: ElementRef;



  constructor(    private alertController: AlertController,
    private navController: NavController) {}

  ngOnInit() {
    this.fetchDatos();
    this.sumarUnidades()
    this.selectedFecha = this.getCurrentDate(); // Asignar la fecha actual a selectedFecha
    for (let i = 0; i < this.numRenglones; i++) {
      this.renglones.push({ claveArticulo: '', nombreArticulo: '', unidadArticulo: '', articuloId : '' });
    }
    this.actualizarRenglones();

    
  }

  prepararDatosParaEnvio() {
    const articuloIds = this.renglones.map(r => ({
      articuloId: r.articuloId, // Suponiendo que claveArticulo es equivalente a articuloId
      unidades: r.unidadArticulo // Asignar las unidades correspondientes
    }));

    const datosAEnviar = {
      conceptoId: this.selectedConcepto,
      almacenOrigenId: this.selectedAlmacen,
      almacenDestinoId: this.selectedDestino,
      fecha: this.selectedFecha,
      folio: '', // Asegurarse de que el folio sea una cadena vacía
      descripcion: this.descripcion,
      centroCostoId: this.centroCostoId,
      articulos: articuloIds
    };

    console.log('Datos a enviar:', datosAEnviar);
    return datosAEnviar;
  }
  enviarDatos() {
    // Primero prepara los datos
    const datosAEnviar = this.prepararDatosParaEnvio();

    // Luego envíalos al servidor
    const url = 'https://b381-177-231-173-6.ngrok-free.app/api/Microsip/generar-salida'; // Reemplaza con la URL de tu API

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosAEnviar)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Datos enviados exitosamente:", data);

      // Si la solicitud fue exitosa, reiniciar la aplicación o navegar a la página inicial
      this.navController.navigateRoot('/');
    })
    .catch(async error => {
      console.error('Error al enviar los datos:', error);

      // Mostrar una alerta en caso de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.',
        buttons: ['OK']
      });

      await alert.present();
    });
  }


  inicializarArticulos() {
    this.articulos = Array.from({ length: this.numRenglones }, () => ({
      claveArticulo: '',
      nombreArticulo: '',
      unidadArticulo: ''
    }));
  }

  fetchDatos() {
    const url = 'https://b381-177-231-173-6.ngrok-free.app/api/Microsip/datos';
    
    fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Red no OK');
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
      console.log('Datos obtenidos:', data);
      this.datos = data; // Guardar los datos en la variable
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString(); // Retorna en formato ISO 8601
  }
  
  obtenerArticulo(index: number) {
    const url = 'https://b381-177-231-173-6.ngrok-free.app/api/Microsip/obtener-articulo';

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        claveArticulo: this.renglones[index].claveArticulo
      })
    };

    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos obtenidos:', data);
        const articuloID = data.articuloId;
        console.log('Artículo ID:', articuloID)
        this.articuloId = data.articuloId;
        console.log('Artículo ID guardado:', this.articuloId);




        this.renglones[index].articuloId = data.articuloId; 
        this.renglones[index].nombreArticulo = data.nombreArticulo; 
        this.renglones[index].unidadArticulo = data.unidadArticulo; 
      })
      .catch(error => {
        console.error('Error al obtener el artículo:', error);
      });
  }
  focoUnidades(index: number) {
    this.unidadInput.nativeElement.focus();
  }
  actualizarRenglones() {
    const nuevosRenglones = Array.from({ length: this.numRenglones }, () => ({
      claveArticulo: '',
      nombreArticulo: '',
      unidadArticulo: '',
      articuloId: '',
    }));
  
    // Conservar los datos existentes
    this.renglones.forEach((renglon, index) => {
      if (index < nuevosRenglones.length) {
        nuevosRenglones[index] = renglon;
      }
    });
  
    this.renglones = nuevosRenglones;
  }

  sumarUnidades() {
    this.numRenglones++;
    this.actualizarRenglones();
  }
}
