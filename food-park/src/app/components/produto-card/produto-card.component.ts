import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Produto } from '../../models/produto';
import { IONIC_ELEMENTS } from '../../imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-card',
  templateUrl: './produto-card.component.html',
  styleUrls: ['./produto-card.component.scss'],
  imports: [IONIC_ELEMENTS, CommonModule]
})
export class ProdutoCardComponent  implements OnInit {

  @Input() produto?: Produto;
  carrinho: Produto[] = [];
  get precoFormatado(): string {
    const valor = this.produto?.preco ?? 0;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  constructor() { }

  ngOnInit() {}

  adicionarPedido(produto: Produto) {
    if (produto == undefined) {
      return
    }
  this.carregarCarrinho();

  const jaExiste = this.carrinho.some(item => item.id === produto.id);

  if (jaExiste) {
    return;
  }

  this.carrinho.push(produto);


  localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
}

  carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem('carrinho');

  if (carrinhoSalvo) {
    this.carrinho = JSON.parse(carrinhoSalvo);
  } else {
    this.carrinho = [];
  }
}

}

