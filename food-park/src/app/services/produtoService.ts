import { Injectable } from '@angular/core';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class produtoService {

  produtos:  Produto[] = [
    { id: 1, nome: 'Porção de batata', preco: 35, truck: "SmashIFSC" },
    { id: 2, nome: 'Brigadeiro', preco: 20, truck: "SmashIFSC" },
    { id: 3, nome: 'Pudim de leite', preco: 15, truck: "SmashIFSC" },

];




}