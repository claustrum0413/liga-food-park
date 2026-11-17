import { Injectable } from '@angular/core';
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
    { id: 5, nome: 'Taco', preco: 18, truck: 'La Fiesta', categoria: 'Lanche', estoque: 3 },
    { id: 6, nome: 'Refrigerante', preco: 8, truck: 'La Fiesta', categoria: 'Bebida', estoque: 20 },
    { id: 7, nome: 'Gelato de pistache', preco: 16, truck: 'Gelato', categoria: 'Sobremesa', estoque: 5 },
  ];

  carrinho: Produto[] = [];

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

  

  carregarCarrinho() {
    const salvo = localStorage.getItem(CHAVE_CARRINHO);
    this.carrinho = salvo ? JSON.parse(salvo) : [];
  }

  private salvarCarrinho() {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(this.carrinho));
  }

  estaNoCarrinho(id: number): boolean {
    return this.carrinho.some(item => item.id === id);
  }

  adicionarAoCarrinho(produto: Produto): boolean {
    if (!this.estaDisponivel(produto) || this.estaNoCarrinho(produto.id)) {
      return false;
    }
    this.carrinho.push(produto);
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
