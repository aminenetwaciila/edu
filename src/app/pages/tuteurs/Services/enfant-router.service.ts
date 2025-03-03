import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type RouteDetails = {
  route: string,
  direction: string,
  sub: boolean,
  component: string
}

@Injectable()
export class EnfantRouterService {

  router : BehaviorSubject<RouteDetails> = new BehaviorSubject(null);

  constructor() { }
}
