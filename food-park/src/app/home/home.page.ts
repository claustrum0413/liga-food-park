import { Component } from '@angular/core';
import { AuthService } from '../services/authService';
import { Router } from '@angular/router';
import { produtoService } from '../services/produtoService';
import { Produto } from '../models/produto';
import { IONIC_ELEMENTS } from '../imports';
import { ProdutoCardComponent } from '../components/produto-card/produto-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IONIC_ELEMENTS, ProdutoCardComponent, CommonModule],
})
export class HomePage {

  produtos: Produto[] = [];

  constructor(
    public auth: AuthService,
    public produtoService: produtoService,
    private router: Router,
  ) {
    this.produtos = this.produtoService.produtos
  }

  async ngOnInit() {
    const usuario = await this.auth.esperarUsuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
  }

  finalizar() {
    this.router.navigate(['/comanda'])
  }


  async sair() {
    await this.auth.sair();
    this.router.navigate(['/login']);
  }

}
