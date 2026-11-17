import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { produtoService } from '../services/produtoService';
import { Produto } from '../models/produto';
import { IONIC_ELEMENTS } from '../imports';
import { db } from '../firebase.config';

@Component({
  selector: 'app-combo',
  templateUrl: 'combo.page.html',
  styleUrls: ['combo.page.scss'],
  imports: [IONIC_ELEMENTS],
})
export class ComboPage implements OnInit {

  itens: Produto[] = [];
  compraFinalizada = false;

  constructor(
    public produtoService: produtoService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.produtoService.carregarCarrinho();
    this.itens = [...this.produtoService.carrinho];

    this.produtoService.carrinho$.subscribe(carrinho => {
      this.itens = [...carrinho];
    });
  }

  ionViewWillEnter() {
    this.produtoService.carregarCarrinho();
    this.itens = [...this.produtoService.carrinho];
  }

  remover(produto: Produto) {
    this.produtoService.removerDoCarrinho(produto.id);
    this.itens = [...this.produtoService.carrinho];
  }

  async finalizarCompra() {
    if (this.itens.length === 0) {
      return;
    }

    try {
      const compra = {
        itens: this.itens.map(item => ({
          id: item.id,
          nome: item.nome,
          truck: item.truck,
          preco: item.preco,
          categoria: item.categoria,
        })),
        subtotal: this.produtoService.subtotal(),
        taxaEntrega: this.produtoService.taxaEntrega(),
        total: this.produtoService.total(),
        status: 'pendente',
        criadoEm: serverTimestamp(),
      };

      await addDoc(collection(db, 'compras'), compra);

      this.ngZone.run(() => {
        this.itens = [];
        this.compraFinalizada = true;
        this.produtoService.limparCarrinho();
      });
    } catch (error) {
      console.error('Erro ao gravar compra no Firestore:', error);
      window.alert('Não foi possível finalizar a compra. Tente novamente.');
    }
  }

  fecharMensagemSucesso() {
    this.compraFinalizada = false;
    this.router.navigate(['/home']);
  }

  voltar() {
    this.router.navigate(['/home']);
  }

}
