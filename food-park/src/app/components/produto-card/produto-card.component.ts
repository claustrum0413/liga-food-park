import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Produto } from '../../models/produto';
import { IONIC_ELEMENTS } from '../../imports';
import { produtoService, SituacaoEstoque } from '../../services/produtoService';

@Component({
  selector: 'app-produto-card',
  templateUrl: './produto-card.component.html',
  styleUrls: ['./produto-card.component.scss'],
  imports: [IONIC_ELEMENTS]
})
export class ProdutoCardComponent {

  @Input() produto?: Produto;
  @Input() noCarrinho = false;

  @Output() adicionar = new EventEmitter<Produto>();
  @Output() remover = new EventEmitter<Produto>();

  constructor(private produtoService: produtoService) {}

  get precoFormatado(): string {
    return this.produtoService.formatarPreco(this.produto?.preco ?? 0);
  }

  get situacao(): SituacaoEstoque {
    return this.produto ? this.produtoService.situacaoEstoque(this.produto) : 'ok';
  }

}
