import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from '../models/produto';

export type SituacaoEstoque = 'ok' | 'acabando' | 'esgotado';

const LIMITE_ESTOQUE_BAIXO = 3;
const TAXA_ENTREGA = 3;
const CHAVE_CARRINHO = 'carrinho';

@Injectable({ providedIn: 'root' })
export class produtoService {

  produtos: Produto[] = [
    { id: 1, nome: 'Porção de batata', preco: 35, truck: 'SmashIFSC', categoria: 'Porção', estoque: 10 },
    { id: 2, nome: 'Brigadeiro', preco: 20, truck: 'SmashIFSC', categoria: 'Sobremesa', estoque: 2 },
    { id: 3, nome: 'Pudim de leite', preco: 15, truck: 'SmashIFSC', categoria: 'Sobremesa', estoque: 0 },
    { id: 4, nome: 'Burger smash', preco: 22, truck: 'SmashIFSC', categoria: 'Lanche', estoque: 8 },
    { id: 5, nome: 'Suco natural', preco: 12, truck: 'SmashIFSC', categoria: 'Bebida', estoque: 9 },
    { id: 6, nome: 'Taco', preco: 18, truck: 'La Fiesta', categoria: 'Lanche', estoque: 8 },
    { id: 7, nome: 'Refrigerante', preco: 8, truck: 'La Fiesta', categoria: 'Bebida', estoque: 2 },
    { id: 8, nome: 'Batata rústica da La Fiesta', preco: 30, truck: 'La Fiesta', categoria: 'Porção', estoque: 6 },
    { id: 9, nome: 'Churros da La Fiesta', preco: 18, truck: 'La Fiesta', categoria: 'Sobremesa', estoque: 4 },
    { id: 10, nome: 'Gelato de pistache', preco: 16, truck: 'Gelato', categoria: 'Sobremesa', estoque: 6 },
    { id: 11, nome: 'Porção de pão de alho', preco: 28, truck: 'Gelato', categoria: 'Porção', estoque: 7 },
    { id: 12, nome: 'Misto quente', preco: 24, truck: 'Gelato', categoria: 'Lanche', estoque: 0 },
    { id: 13, nome: 'Limonada gelada', preco: 10, truck: 'Gelato', categoria: 'Bebida', estoque: 3 },
  ];

  carrinho: Produto[] = [];
  carrinho$ = new BehaviorSubject<Produto[]>([]);

  constructor() {
    this.carregarCarrinho();
  }

  listar(): Produto[] {
    return this.produtos;
  }

  buscarPorId(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  categorias(): string[] {
    return [...new Set(this.produtos.map(p => p.categoria))];
  }

  trucks(): string[] {
    return [...new Set(this.produtos.map(p => p.truck))];
  }

  filtrarPorCategoria(categoria: string): Produto[] {
    if (!categoria || categoria === 'todas') {
      return this.produtos;
    }
    return this.produtos.filter(p => p.categoria === categoria);
  }

  filtrarPorTruck(truck: string): Produto[] {
    return this.produtos.filter(p => p.truck === truck);
  }

  situacaoEstoque(produto: Produto): SituacaoEstoque {
    if (produto.estoque <= 0) {
      return 'esgotado';
    }
    if (produto.estoque <= LIMITE_ESTOQUE_BAIXO) {
      return 'acabando';
    }
    return 'ok';
  }

  estaDisponivel(produto: Produto): boolean {
    return produto.estoque > 0;
  }

  formatarPreco(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  private podeUsarStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  carregarCarrinho() {
    if (!this.podeUsarStorage()) {
      this.carrinho = [];
      this.carrinho$.next(this.carrinho);
      return;
    }

    try {
      const salvo = window.localStorage.getItem(CHAVE_CARRINHO);
      const itens = salvo ? JSON.parse(salvo) : [];
      this.carrinho = Array.isArray(itens) ? itens : [];
    } catch {
      this.carrinho = [];
    }

    this.carrinho$.next(this.carrinho);
  }

  private salvarCarrinho() {
    if (!this.podeUsarStorage()) {
      return;
    }

    try {
      window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(this.carrinho));
    } catch {
      // ignora falha de persistência no navegador
    }

    this.carrinho$.next(this.carrinho);
  }

  estaNoCarrinho(id: number): boolean {
    return this.carrinho.some(item => item.id === id);
  }

  adicionarAoCarrinho(produto: Produto): boolean {
    if (!this.estaDisponivel(produto) || this.estaNoCarrinho(produto.id)) {
      return false;
    }

    this.carrinho = [...this.carrinho, produto];
    this.salvarCarrinho();
    return true;
  }

  removerDoCarrinho(id: number) {
    this.carrinho = this.carrinho.filter(item => item.id !== id);
    this.salvarCarrinho();
  }

  limparCarrinho() {
    this.carrinho = [];
    this.salvarCarrinho();
  }

  quantidadeNoCarrinho(): number {
    return this.carrinho.length;
  }

  subtotal(): number {
    return this.carrinho.reduce((soma, item) => soma + item.preco, 0);
  }

  taxaEntrega(): number {
    return this.carrinho.length > 0 ? TAXA_ENTREGA : 0;
  }

  total(): number {
    return this.subtotal() + this.taxaEntrega();
  }
}
