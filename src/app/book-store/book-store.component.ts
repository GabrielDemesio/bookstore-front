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
  filteredBooks: Book[] = [];
  currentTab = 'register';
  searchQuery = '';

  constructor(private service: BookService) {
  }

  saveBook(): void {
    if (!this.book.author || !this.book.title || !this.book.text) {
      alert('Por favor, preencha todos os campos obrigatórios: Autor, Título e Sinopse.');
      return;
    }

    this.service.SaveBookStore(this.book)
      .subscribe(returning => {
        this.books.push(returning);
        this.filteredBooks.push(returning);
      });

    this.book = new Book();
    alert('Livro Salvo com sucesso!');
  }

  editBook(): void {
    if (!this.book.id) {
      alert(this.book.id);
      return;
    }
    this.service.editBook(this.book).subscribe(
      (updatedBook) => {
        const index = this.books.findIndex((b) => b.id === updatedBook.id);
        if (index >= -1) {
          this.books[index] = updatedBook;
        }
        const filteredBook = this.filteredBooks.findIndex((b) => b.id === updatedBook.id);
        if (filteredBook !== -1) {
            this.filteredBooks[filteredBook] = updatedBook;
        }
        alert('Livro Salvo com sucesso!');
        this.book = new Book();
        this.btnSave = true;
      },
      (error) => {
        console.error('Erro ao salvar', error);
        alert('Erro ao salvar livro');
      }
    );
  }

  loadBookForEditing(selectedBook: Book): void {
    this.book = {...selectedBook};
    this.btnSave = true;
    this.currentTab = 'register';
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
        this.filteredBooks = books;
        console.log(this.books);
      },
      (error) => {
        console.error('Erro ao buscar livros:', error);
      }
    );
  }

  // @ts-ignore
  showAllBooks(): void{
    this.getBooks();
    this.currentTab = 'search';
  }

  searchBookTitle(): void {
    if (!this.searchQuery) {
      this.filteredBooks = [];
      return;
    }

    this.filteredBooks = this.books.filter(book => {
      return book && book.title && book.title.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
    this.book = new Book();

    if (this.filteredBooks.length === 0) {
      alert('Nenhum livro encontrado com o título pesquisado.');
    }
  }

  showTab(tab: string) {
    this.currentTab = tab;

    if (tab === 'search') {
      this.filteredBooks = [];
      this.searchQuery = '';
    }
  }
  ngOnInit(){
    this.getBooks();
  }
}
