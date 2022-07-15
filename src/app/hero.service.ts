import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IHero } from './hero-interface';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private heroesURL = 'api/heroes'; //url to the web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService,
    private http:HttpClient) { }

  getHeroes(): Observable<IHero[]> {
    return this.http.get<IHero[]>(this.heroesURL).pipe(
      catchError(this.handleError<IHero[]>('getHeroes',[]))
    );
  }

  private handleError<T>(operation='operation', result?:T) {
    return (error: any) : Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  getHero(id: number): Observable<IHero> {
    const url=`${this.heroesURL}/${id}`;
    return this.http.get<IHero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<IHero>(`getHero id=${id}`))
    );
  }

  private log(message:string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** PUT: update the hero on the server */
updateHero(hero: IHero): Observable<any> {
  return this.http.put(this.heroesURL, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}
/** POST: add a new hero to the server */
addHero(hero: IHero): Observable<IHero> {
  return this.http.post<IHero>(this.heroesURL, hero, this.httpOptions).pipe(
    tap((newHero: IHero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<IHero>('addHero'))
  );
}

/** DELETE: delete the hero from the server */
deleteHero(id: number): Observable<IHero> {
  const url = `${this.heroesURL}/${id}`;

  return this.http.delete<IHero>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<IHero>('deleteHero'))
  );
}
/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<IHero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<IHero[]>(`${this.heroesURL}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<IHero[]>('searchHeroes', []))
  );
}
}