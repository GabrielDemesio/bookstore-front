import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Book } from '../model/Book';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = '/books';

  constructor(private http: HttpClient) { }
  Select(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl, { responseType: 'json' })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar livros:', error.error?.text || error.message);
          return throwError(() => new Error('Erro ao buscar livros'));
        })
      );
  }
  SaveBookStore(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book)
      .pipe(
        catchError(error => {
          console.error('Erro ao salvar', error);
          return throwError(() => new Error('Erro ao salvar livro'));
        })
      );
  }
  editBook(book: Book): Observable<Book> {
    return this.http.put<Book>(this.apiUrl, book);
  }
  removeBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:4200/books/${bookId}`);
  }
  getBookTitle(): Observable<string[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      map((books: Book[]) => books.map(book => book.title))
    );
  }
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }
}
