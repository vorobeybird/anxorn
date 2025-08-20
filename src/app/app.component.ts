import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MenuModule } from "./menu/menu.module";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MenuModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {

}
