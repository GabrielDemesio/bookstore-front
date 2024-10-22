import { Component } from '@angular/core';
import { BookService } from '../service/Book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Book } from '../model/Book';

@Component({
  selector: 'app-book-store',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css'] 
})
export class BookStoreComponent {
  book = new Book();
  btnSave = true;
  books: Book[] = [];
  filteredBooks: Book[] = []; // Inicialmente vazio
  currentTab = 'register'; // Define a aba inicial
  searchQuery = '';

  constructor(private service: BookService) {
    this.getBooks(); // Chama o método para buscar os livros ao iniciar
  }

  saveBook(): void {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!this.book.author || !this.book.title || !this.book.text) {
      alert('Por favor, preencha todos os campos obrigatórios: Autor, Título e Sinopse.');
      return; // Sai do método se os campos não estiverem preenchidos
    }
  
    this.service.SaveBookStore(this.book)
      .subscribe(returning => {
        this.books.push(returning);
        this.filteredBooks.push(returning); // Também adiciona à lista filtrada
      });
  
    this.book = new Book();
    alert('Livro Salvo com sucesso!');
  }
  editBook(): void {
    this.service.editBook(this.book)
      .subscribe(returning => {
        const position = this.books.findIndex(book => book.id === returning.id);
        this.books[position] = returning;

        // Atualiza também a lista filtrada
        const filteredPosition = this.filteredBooks.findIndex(book => book.id === returning.id);
        if (filteredPosition !== -1) {
          this.filteredBooks[filteredPosition] = returning;
        }

        this.btnSave = true;
        alert('Livro alterado');
      });
  }
  removeBook(bookId: number | undefined): void {
    if (bookId === undefined) {
      alert('ID do livro não definido.');
      return;
    }

    if (confirm('Você tem certeza que deseja remover este livro?')) {
      this.service.removeBook(bookId).subscribe(() => {
        this.books = this.books.filter(book => book.id !== bookId);
        this.filteredBooks = this.filteredBooks.filter(book => book.id !== bookId);
        alert('Livro removido com sucesso');
      }, (error) => {
        console.error('Erro ao remover o livro:', error);
        alert('Erro ao remover o livro');
      });
    }
  }
  getBooks(): void {
    this.service.getBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
        this.filteredBooks = books; // Inicializa a lista filtrada com todos os livros
        console.log(this.books); // Verifique se os livros estão sendo carregados corretamente
      },
      (error) => {
        console.error('Erro ao buscar livros:', error);
      }
    );
  }  
  searchBookTitle(): void {
    // Se a busca estiver vazia, mantenha a lista filtrada vazia
    if (!this.searchQuery) {
      this.filteredBooks = []; // Mantenha a lista vazia até que uma pesquisa válida seja feita
      return;
    }
  
    // Filtra os livros com base na consulta
    this.filteredBooks = this.books.filter(book => {
      return book && book.title && book.title.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  
    // Se não houver livros correspondentes, você pode optar por exibir uma mensagem
    if (this.filteredBooks.length === 0) {
      alert('Nenhum livro encontrado com o título pesquisado.');
    }
  }
  showTab(tab: string) {
    this.currentTab = tab;

    if (tab === 'search') {
      this.filteredBooks = []; // Limpa a lista ao mudar para a aba de pesquisa
      this.searchQuery = ''; // Limpa a consulta de pesquisa
    }
  }
  selectBook(position: number): void {
    this.book = this.books[position];
    this.btnSave = false;
  }
}
