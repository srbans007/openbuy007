import { Component } from '@angular/core';

@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.scss']
})
export class CargaDatosComponent {
  fileName = '';

  onFileSelected(event: Event) {

    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {

      this.fileName = files[0].name;

      const formData = new FormData();
      formData.append("file", files[0]);


    }

  }

  onUpload() {

  }
}
