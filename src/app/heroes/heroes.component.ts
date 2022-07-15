import { Component, OnInit } from '@angular/core';
import { IHero } from '../hero-interface';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: IHero[] = []; 
  selectedHero?: IHero;

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero : IHero) : void{
    this.selectedHero=hero;
    this.messageService.add(`Heroes Component: Selected hero id=${hero.id}`);
  }

  getHeroes() : void {
    this.heroService.getHeroes().subscribe(heroes=>{this.heroes=heroes});
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as IHero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: IHero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

}

