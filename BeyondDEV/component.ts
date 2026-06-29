/*import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-component',
    templateUrl: `
        <input [(ngModel)]='counter'>{{counter}} <button (click)='increaseCOunter()'>+1</button>
    `,
    styleUrls: ['./component.css']
})
export class AppComponent {
    counter = 3;
    valor = input<number>(0);
    valorNuevo = output<number>();


    increaseCOunter() {
        this.counter = this.counter + 1;
        console.log(this.counter);
        this.valorNuevo.emit(this.counter);
    }
}

@Component({
    selector: 'app',
    templateUrl: `
        <div>
            <app-component [valor] = "counter" (valorNuevo)="counter = $event"/>        
        </div>
    `,
    styleUrls: ['./component.css'],
    imports: [AppComponent]
})
export class Padre {

}
*/