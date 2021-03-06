import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../../services/auth.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'proveedores-form',
  templateUrl: './proveedores-form.component.html',
  styleUrls: ['./proveedores-form.component.scss']
})

export class ProveedoresFormComponent implements OnInit {

  private idEntidad: any;
  public datos: FormGroup;

  constructor(private formBuilder: FormBuilder, private appService: AppService,
    public dialogRef: MatDialogRef<ProveedoresFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public auth: AuthService) {

    this.datos = this.formBuilder.group(
      {
        nit: ['', Validators.required],
        nombre: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
        email: ['', Validators.required],
        estado: [1, Validators.required]
      }
    );
  }

  ngOnInit() {
    const { entidad: { id } } = JSON.parse(sessionStorage.getItem('usuario'));
    this.idEntidad = id;

    if (this.data.typeForm === 1 && this.data.data !== null) {
      this.datos.patchValue({
        ...this.data.data
      });
    }
  }

  setProveedor() {
    return {
      ...this.datos.value
    };
  }

  updateProveedor() {
    this.appService.put(`/proveedor/update/${this.data.data.id}`, this.setProveedor()).subscribe(
      result => {
        this.matDialogClose(1, result.mensaje);
      },
      error => {
        console.error(error.error);
      }
    );
  }

  createProveedor() {
    this.appService.post(`/proveedor/new`, this.setProveedor()).subscribe(
      result => {
        this.matDialogClose(1, result.mensaje);
      },
      error => {
        console.log(error.error);
      }
    );
  }

  submit() {
    if (this.datos.valid) {
      switch (this.data.typeForm) {
        case 0:
          this.createProveedor();
          break;
        case 1:
          this.updateProveedor();
          break
        default:
          break;
      }
    }

  }

  matDialogClose(tipo: number, message: string) {
    this.dialogRef.close({ tipo, message });
  }

}
