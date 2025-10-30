// Conteúdo para price-comparison/components/product-comparison.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
// NOVOS IMPORTS
import { Input } from "@/components/ui/input" 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// FIM NOVOS IMPORTS

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PriceHistoryModal } from "@/components/price-history-modal"
import { TrendingDown, ExternalLink, Star, ShoppingCart, SearchIcon, AlertTriangle } from "lucide-react" // Adicionado SearchIcon e AlertTriangle
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

// Interfaces
interface Store {
  name: string
  price: number
  originalPrice?: number | null
  shipping: string
  rating: number
  reviews: number
  affiliateLink: string
  inStock: boolean
}

interface PriceHistoryEntry {
  date: string;
  price: number;
  loja: string
}

interface Product {
  id: string
  name: string
  image: string
  category: string
  stores: Store[]
  priceHistory: PriceHistoryEntry[]
}

// Função Auxiliar para Ordenação
const getLowestPrice = (product: Product): number => {
    const validPrices = product.stores
        .filter(s => s.price > 0 && s.inStock)
        .map(s => s.price);
    return validPrices.length > 0 ? Math.min(...validPrices) : Infinity;
};


export function ProductComparison() {
  // ESTADOS ATUALIZADOS
  const [masterProducts, setMasterProducts] = useState<Product[]>([]); // Lista mestra
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para os controles
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default"); // 'default', 'price-asc', 'price-desc'

  // useEffect para buscar dados
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        // AQUI ESTÁ A URL DA SUA API NO RENDER
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-comparador-backend.onrender.com/";
        console.log(`Buscando produtos de: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log(`Status da resposta: ${response.status}`);

        if (!response.ok) {
          let errorBody = 'Erro desconhecido';
          try {
            const errorData = await response.json();
            errorBody = errorData.error || response.statusText;
          } catch (e) {
             errorBody = response.statusText;
          }
          throw new Error(`Falha ao buscar produtos (${response.status}): ${errorBody}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);

        if (!Array.isArray(data)) {
            throw new Error("Formato de dados inesperado recebido da API.");
        }
        
        setMasterProducts(data); // Seta a lista MESTRA
      } catch (err: any) {
        console.error("Erro detalhado no fetch:", err);
        setError(`Não foi possível carregar os produtos. Detalhe: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []); // O array vazio [] faz o useEffect rodar só uma vez

  
  // --- LÓGICA DE FILTRO E ORDENAÇÃO (CORREÇÃO v3) ---
  const filteredProducts = useMemo(() => {
    let productsToFilter = [...masterProducts];

    // 1. Aplica Filtro (Barra de Pesquisa)
    if (searchTerm) {
      productsToFilter = productsToFilter.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Aplica Ordenação
    if (sortOption === 'price-asc' || sortOption === 'price-desc') {
      
      // === A CORREÇÃO ESTÁ AQUI ===
      // Em vez de .sort() (que muta o array), usamos .toSorted() (que retorna um novo array)
      // Isso é muito mais seguro para o React e evita o erro 'removeChild'.
      return productsToFilter.toSorted((a, b) => { 
        const priceA = getLowestPrice(a);
        const priceB = getLowestPrice(b);
        return sortOption === 'price-asc' ? priceA - priceB : priceB - priceA;
      });
      // === FIM DA CORREÇÃO ===

    }
    
    return productsToFilter; // Retorna a lista (apenas filtrada, ou na ordem padrão)
  }, [masterProducts, searchTerm, sortOption]); // Dependências


  // Estados para o modal (mantidos)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Funções de clique (mantidas)
  const handleImageClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }
  const handleStoreClick = (affiliateLink: string) => {
    window.open(affiliateLink, "_blank", "noopener,noreferrer")
  }

  // ---- RENDERIZAÇÃO ----

  // 1. Estado de Carregamento
  if (isLoading) {
    // ... (código do skeleton, sem mudanças)
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center">
            <Skeleton className="h-10 w-3/4 mx-auto mb-3" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
        </header>
        <div className="space-y-8">
            {[1, 2].map((n) => (
                <Card key={n} className="overflow-hidden"><div className="grid md:grid-cols-[300px_1fr] gap-6 p-6"><div className="space-y-3"><Skeleton className="aspect-square rounded-lg w-full" /><Skeleton className="h-6 w-1/3" /></div><div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-5 w-1/4" /><div className="space-y-3 pt-4"><Skeleton className="h-20 w-full rounded-lg" /><Skeleton className="h-20 w-full rounded-lg" /></div></div></div></Card>
            ))}
        </div>
      </div>
    );
  }

  // 2. Estado de Erro
  if (error) {
     return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro ao Carregar Dados</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        </div>
     );
  }

  // 3. Estado Sem Produtos (Após Carregamento)
   if (masterProducts.length === 0 && !isLoading) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-3 text-balance">Compare Preços e Economize</h1>
                <p className="text-muted-foreground text-lg text-balance">
                Encontre as melhores ofertas em diversas lojas online
                </p>
            </header>
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Nenhum produto encontrado</AlertTitle>
                <AlertDescription>
                    O arquivo <code className="bg-muted px-1 rounded">precos.csv</code> está vazio ou não foi encontrado.
                    Execute o script <code className="bg-muted px-1 rounded">scraper.py</code> no seu computador e faça o push para o GitHub.
                </AlertDescription>
            </Alert>
        </div>
      );
  }


  // 4. Estado Normal (com produtos)
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3 text-balance">Compare Preços e Economize</h1>
        <p className="text-muted-foreground text-lg text-balance">
          Encontre as melhores ofertas em diversas lojas online
        </p>
      </header>
      
      {/* --- SEÇÃO DE FILTROS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-4 z-10 bg-background/90 backdrop-blur-sm p-2 rounded-lg">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar por nome (ex: RTX 4070)..."
            className="pl-10" // Adiciona padding para o ícone
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown de Ordenação */}
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Ordenação Padrão</SelectItem>
            <SelectItem value="price-asc">Menor Preço</SelectItem>
            <SelectItem value="price-desc">Maior Preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* --- FIM DA SEÇÃO DE FILTROS --- */}


      {/* --- LISTA DE PRODUTOS ATUALIZADA --- */}
      <div className="space-y-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            // Lógica de cálculo
            const lowestPrice = getLowestPrice(product);
            const highestDiscount = Math.max(
              0,
              ...product.stores
                .filter((s) => s.originalPrice && s.originalPrice > s.price && s.inStock)
                .map((s) => ((s.originalPrice! - s.price) / s.originalPrice!) * 100),
            );

            const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                event.currentTarget.src = '/placeholder.svg';
                event.currentTarget.onerror = null; 
            };

            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                  {/* Product Image Section */}
                  <div className="space-y-3">
                    <button onClick={() => handleImageClick(product)} className="relative group cursor-pointer w-full">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform group-hover:scale-105"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                        <div className="text-white text-center">
                          <TrendingDown className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Ver Histórico de Preços</p>
                        </div>
                      </div>
                    </button>
                    <Badge variant="secondary" className="w-full justify-center truncate">
                      {product.category}
                    </Badge>
                  </div>

                  {/* Product Details Section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-balance">{product.name}</h2>
                      {highestDiscount > 0 && (
                        <Badge variant="default" className="bg-accent text-accent-foreground">
                          Até {highestDiscount.toFixed(0)}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Stores Comparison */}
                    <div className="space-y-3">
                      {/* A correção da key da v2 (key={store.name}) está mantida aqui */}
                      {product.stores.map((store) => { 
                        const isLowestPrice = store.price === lowestPrice && store.price > 0 && store.inStock;
                        const discount = store.originalPrice && store.originalPrice > store.price && store.inStock
                          ? ((store.originalPrice - store.price) / store.originalPrice) * 100
                          : 0;

                        return (
                          <div
                            key={store.name} 
                            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                              isLowestPrice ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              {/* Detalhes da Loja */}
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg truncate">{store.name}</h3>
                                  {isLowestPrice && (
                                    <Badge variant="default" className="text-xs flex-shrink-0">
                                      Melhor Preço
                                    </Badge>
                                  )}
                                  {!store.inStock && (
                                    <Badge variant="destructive" className="text-xs flex-shrink-0">
                                      Indisponível
                                    </Badge>
                                  )}
                                </div>
                                {store.rating > 0 && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{store.rating.toFixed(1)}</span>
                                      {store.reviews > 0 && <span>({store.reviews.toLocaleString("pt-BR")} avaliações)</span>}
                                      </div>
                                  </div>
                                )}
                                <p className="text-sm text-muted-foreground">{store.shipping}</p>
                              </div>

                              {/* Preço e Botão */}
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                {store.originalPrice && store.originalPrice > store.price && store.inStock && (
                                  <div className="text-sm text-muted-foreground line-through whitespace-nowrap">
                                    R$ {store.originalPrice.toFixed(2).replace(".", ",")}
                                  </div>
                                )}
                                <div className={`text-2xl sm:text-3xl font-bold whitespace-nowrap ${store.inStock && store.price > 0 ? 'text-primary' : 'text-muted-foreground text-xl'}`}>
                                  {store.inStock && store.price > 0 ? `R$ ${store.price.toFixed(2).replace(".", ",")}` : "Indisponível"}
                                </div>
                                {discount > 0 && store.inStock && (
                                  <Badge variant="secondary" className="text-xs">
                                    {discount.toFixed(0)}% OFF
                                  </Badge>
                                )}
                                <Button
                                  onClick={() => handleStoreClick(store.affiliateLink)}
                                  disabled={!store.inStock}
                                  className="w-full sm:w-auto mt-2"
                                  size="sm"
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Ir para Loja
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          // Mensagem para quando não há resultados de filtro
          <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Nenhum resultado encontrado</AlertTitle>
              <AlertDescription>
                  Nenhum produto corresponde à sua busca. Tente alterar o termo de pesquisa.
              </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <PriceHistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />
      )}
    </div>
  )
}