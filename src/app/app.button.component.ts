import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  styles: [`
  `],
  template: `
    <button [ngClass]="customClass">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
    @Input() label: string = '';
    @Input() customClass: string = '';
}
