import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { produtoService } from '../services/produtoService';
import { Produto } from '../models/produto';
import { IONIC_ELEMENTS } from '../imports';
import { ProdutoCardComponent } from '../components/produto-card/produto-card.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IONIC_ELEMENTS, ProdutoCardComponent],
})
export class HomePage {

  categorias: string[] = [];
  categoriaAtual = 'todas';
  produtos: Produto[] = [];
  qtdCombo = 0;

  constructor(
    public auth: AuthService,
    public produtoService: produtoService,
    private router: Router,
  ) {
    this.categorias = this.produtoService.categorias();
    this.atualizar();
  }

  // a página fica em cache no Ionic: recarrega o combo ao voltar para ela
  ionViewWillEnter() {
    this.produtoService.carregarCarrinho();
    this.atualizar();
  }

  atualizar() {
    this.produtos = this.produtoService.filtrarPorCategoria(this.categoriaAtual);
    this.qtdCombo = this.produtoService.quantidadeNoCarrinho();
  }

  filtrar(categoria: string) {
    this.categoriaAtual = categoria;
    this.atualizar();
  }

  adicionar(produto: Produto) {
    this.produtoService.adicionarAoCarrinho(produto);
    this.atualizar();
  }

  remover(produto: Produto) {
    this.produtoService.removerDoCarrinho(produto.id);
    this.atualizar();
  }

  verCombo() {
    this.router.navigate(['/combo']);
  }

  async sair() {
    this.produtoService.limparCarrinho();
    await this.auth.sair();
    this.router.navigate(['/login']);
  }

}
