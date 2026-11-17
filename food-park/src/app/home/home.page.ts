import { ChangeDetectorRef, Component } from '@angular/core';
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
  trucks: string[] = [];
  categoriaAtual = 'todas';
  truckAtual = 'todos';
  produtos: Produto[] = [];
  qtdCombo = 0;

  abaAtual: 'menu' | 'roleta' = 'menu';
  slotTruckItems: string[] = [];
  slotProdutoItems: Produto[] = [];
  truckSorteado?: string;
  produtoSorteado?: Produto;
  truckSlotOffset = 0;
  produtoSlotOffset = 0;
  slotTruckGirando = false;
  slotProdutoGirando = false;
  private timeoutTruckSlot?: number;
  private timeoutProdutoSlot?: number;

  private readonly SLOT_ITEM_HEIGHT = 52;
  private readonly SLOT_ROUNDS = 3;

  private repetirLista<T>(itens: T[]): T[] {
    if (!itens.length) {
      return [];
    }

    return Array.from({ length: this.SLOT_ROUNDS + 1 }, () => itens).flat();
  }

  private calcularOffsetIndice(index: number, baseLength: number): number {
    return -((baseLength * this.SLOT_ROUNDS) + index) * this.SLOT_ITEM_HEIGHT;
  }

  constructor(
    public auth: AuthService,
    public produtoService: produtoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.categorias = this.produtoService.categorias();
    this.trucks = this.produtoService.trucks();
    this.slotTruckItems = this.repetirLista(this.trucks);
    this.slotProdutoItems = [];
    this.atualizar();
  }

  // a página fica em cache no Ionic: recarrega o combo ao voltar para ela
  ionViewWillEnter() {
    this.produtoService.carregarCarrinho();
    this.atualizar();
  }

  atualizar() {
    let lista = this.produtoService.listar();

    if (this.categoriaAtual !== 'todas') {
      lista = lista.filter(p => p.categoria === this.categoriaAtual);
    }

    if (this.truckAtual !== 'todos') {
      lista = lista.filter(p => p.truck === this.truckAtual);
    }

    this.produtos = lista;
    this.qtdCombo = this.produtoService.quantidadeNoCarrinho();
  }

  filtrar(categoria: string) {
    this.categoriaAtual = categoria;
    this.atualizar();
  }

  filtrarPorTruck(truck: string) {
    this.truckAtual = truck;
    this.atualizar();
  }

  adicionar(produto: Produto) {
    const adicionou = this.produtoService.adicionarAoCarrinho(produto);
    if (adicionou) {
      this.atualizar();
      this.produtoSorteado = undefined;
    }
  }

  remover(produto: Produto) {
    this.produtoService.removerDoCarrinho(produto.id);
    this.atualizar();
  }

  verCombo() {
    this.router.navigate(['/combo']);
  }

  abrirRoleta() {
    this.abaAtual = 'roleta';
    this.garantirListaDeSlots();
    this.slotTruckItems = this.repetirLista(this.produtoService.trucks());
    this.slotProdutoItems = [];
    this.truckSorteado = undefined;
    this.produtoSorteado = undefined;
    this.truckSlotOffset = 0;
    this.produtoSlotOffset = 0;
    this.slotTruckGirando = false;
    this.slotProdutoGirando = false;
    if (this.timeoutTruckSlot) {
      clearTimeout(this.timeoutTruckSlot);
      this.timeoutTruckSlot = undefined;
    }
    if (this.timeoutProdutoSlot) {
      clearTimeout(this.timeoutProdutoSlot);
      this.timeoutProdutoSlot = undefined;
    }
    this.cdr.detectChanges();
  }

  abrirMenu() {
    this.abaAtual = 'menu';
    this.slotTruckItems = [];
    this.slotProdutoItems = [];
    this.truckSorteado = undefined;
    this.produtoSorteado = undefined;
    this.slotTruckGirando = false;
    this.slotProdutoGirando = false;
    if (this.timeoutTruckSlot) {
      clearTimeout(this.timeoutTruckSlot);
      this.timeoutTruckSlot = undefined;
    }
    if (this.timeoutProdutoSlot) {
      clearTimeout(this.timeoutProdutoSlot);
      this.timeoutProdutoSlot = undefined;
    }
  }

  girarSlots() {
    this.garantirListaDeSlots();

    if (!this.slotTruckItems.length || this.slotTruckGirando || this.slotProdutoGirando) {
      return;
    }

    const baseTrucks = this.trucksComProdutosDisponiveis();
    if (!baseTrucks.length) {
      return;
    }

    const truckIndex = Math.floor(Math.random() * baseTrucks.length);
    const truck = baseTrucks[truckIndex];
    const produtosDoTruck = this.produtosDisponiveis().filter(produto => produto.truck === truck);

    if (!produtosDoTruck.length) {
      return;
    }

    const produtoIndex = Math.floor(Math.random() * produtosDoTruck.length);
    const produto = produtosDoTruck[produtoIndex];

    if (this.timeoutTruckSlot) {
      clearTimeout(this.timeoutTruckSlot);
    }
    if (this.timeoutProdutoSlot) {
      clearTimeout(this.timeoutProdutoSlot);
    }

    this.slotTruckGirando = true;
    this.slotProdutoGirando = true;
    this.truckSorteado = undefined;
    this.produtoSorteado = undefined;

    this.slotTruckItems = [...baseTrucks, ...baseTrucks, ...baseTrucks];
    this.slotProdutoItems = [...produtosDoTruck, ...produtosDoTruck, ...produtosDoTruck];
    this.truckSlotOffset = 0;
    this.produtoSlotOffset = 0;
    this.cdr.detectChanges();

    requestAnimationFrame(() => {
      this.truckSlotOffset = -((baseTrucks.length * 2 + truckIndex) * this.SLOT_ITEM_HEIGHT);
      this.produtoSlotOffset = -((produtosDoTruck.length * 2 + produtoIndex) * this.SLOT_ITEM_HEIGHT);
      this.cdr.detectChanges();
    });

    this.timeoutTruckSlot = window.setTimeout(() => {
      this.truckSorteado = truck;
      this.slotTruckGirando = false;
      this.cdr.detectChanges();
    }, 1800);

    this.timeoutProdutoSlot = window.setTimeout(() => {
      this.produtoSorteado = produto;
      this.slotProdutoGirando = false;
      this.cdr.detectChanges();
    }, 2200);
  }

  private garantirListaDeSlots() {
    if (!this.slotTruckItems.length) {
      this.slotTruckItems = this.repetirLista(this.trucksComProdutosDisponiveis());
    }
  }

  private produtosDisponiveis(): Produto[] {
    return this.produtoService.listar().filter(
      produto => produto.estoque > 0
        && !this.produtoService.estaNoCarrinho(produto.id),
    );
  }

  private trucksComProdutosDisponiveis(): string[] {
    return [...new Set(this.produtosDisponiveis().map(produto => produto.truck))];
  }

  async sair() {
    this.produtoService.limparCarrinho();
    await this.auth.sair();
    this.router.navigate(['/login']);
  }

}
