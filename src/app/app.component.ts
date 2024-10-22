import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookStoreComponent } from "./book-store/book-store.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookStoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projetoFrontEnd';
}
