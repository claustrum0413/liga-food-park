import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { produtoService } from '../services/produtoService';
import { Produto } from '../models/produto';
import { IONIC_ELEMENTS } from '../imports';

@Component({
  selector: 'app-combo',
  templateUrl: 'combo.page.html',
  styleUrls: ['combo.page.scss'],
  imports: [IONIC_ELEMENTS],
})
export class ComboPage {

  itens: Produto[] = [];

  constructor(
    public produtoService: produtoService,
    private router: Router,
  ) {}

  ionViewWillEnter() {
    this.produtoService.carregarCarrinho();
    this.itens = this.produtoService.carrinho;
  }

  remover(produto: Produto) {
    this.produtoService.removerDoCarrinho(produto.id);
    this.itens = this.produtoService.carrinho;
  }

  voltar() {
    this.router.navigate(['/home']);
  }

}
