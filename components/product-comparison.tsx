// Conteúdo para price-comparison/components/product-comparison.tsx
"use client"

import { useState, useEffect } from "react" // Adicionado useEffect
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PriceHistoryModal } from "@/components/price-history-modal"
import { TrendingDown, ExternalLink, Star, ShoppingCart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton" // NOVO: Para loading
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // NOVO: Para erros
import { Terminal } from "lucide-react" // NOVO: Ícone para o Alert

// Interfaces (mantidas como estavam)
interface Store {
  name: string
  price: number
  originalPrice?: number | null // Permite null vindo da API
  shipping: string
  rating: number
  reviews: number
  affiliateLink: string
  inStock: boolean
}

interface PriceHistoryEntry {
  date: string; // Espera 'YYYY-MM-DD' da API
  price: number;
  loja: string
}

interface Product {
  id: string
  name: string
  image: string
  category: string
  stores: Store[]
  priceHistory: PriceHistoryEntry[] // Usa a interface definida
}

// REMOVIDO: const mockProducts = [...]

export function ProductComparison() {
  // Estados para dados, loading e erro
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOVO: useEffect para buscar dados da API quando o componente monta
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true); // Começa carregando
      setError(null); // Limpa erros anteriores
      try {
        // ****** AJUSTE A URL SE NECESSÁRIO ******
        // Se o backend estiver rodando em outra máquina na rede, use o IP dela
        // Ex: const apiUrl = 'http://192.168.1.10:5001/api/products';
        //const apiUrl = 'http://localhost:5001/api/products'; // Padrão: backend na mesma máquina
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-comparador-backend.onrender.com/";

        console.log(`Buscando produtos de: ${apiUrl}`); // Log para debug

        const response = await fetch(apiUrl);
        console.log(`Status da resposta: ${response.status}`); // Log para debug

        if (!response.ok) {
          let errorBody = 'Erro desconhecido';
          try {
            // Tenta ler a mensagem de erro da API, se houver
            const errorData = await response.json();
            errorBody = errorData.error || response.statusText;
            console.error("Erro da API:", errorData);
          } catch (e) {
             console.error("Não foi possível ler o corpo do erro:", e);
             errorBody = response.statusText; // Usa o status text se não conseguir ler o corpo
          }
          throw new Error(`Falha ao buscar produtos (${response.status}): ${errorBody}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data); // Log para debug

        // Validação básica dos dados recebidos (opcional, mas recomendado)
        if (!Array.isArray(data)) {
            throw new Error("Formato de dados inesperado recebido da API.");
        }
        // Aqui você poderia adicionar mais validações se necessário

        setProducts(data);
      } catch (err: any) {
        console.error("Erro detalhado no fetch:", err); // Log completo para debug
        setError(`Não foi possível carregar os produtos. Verifique se o backend Python (API) está rodando em ${'http://localhost:5001'} e acessível. Detalhe: ${err.message}`);
      } finally {
        setIsLoading(false); // Termina o carregamento (com sucesso ou erro)
      }
    }

    fetchProducts();
  }, []); // O array vazio [] faz o useEffect rodar só uma vez

  // Estados para o modal (mantidos)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Funções de clique (mantidas, mas agora usam dados reais)
  const handleImageClick = (product: Product) => {
    setSelectedProduct(product) // O histórico já está no 'product'
    setIsModalOpen(true)
  }

  const handleStoreClick = (affiliateLink: string) => {
    window.open(affiliateLink, "_blank", "noopener,noreferrer")
  }

  // ---- RENDERIZAÇÃO ----

  // 1. Estado de Carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center">
            {/* Skeleton para o título */}
            <Skeleton className="h-10 w-3/4 mx-auto mb-3" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
        </header>
        <div className="space-y-8">
            {/* Exibe alguns Skeletons de Card */}
            {[1, 2].map((n) => (
                <Card key={n} className="overflow-hidden">
                    <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                        <div className="space-y-3">
                            <Skeleton className="aspect-square rounded-lg w-full" />
                            <Skeleton className="h-6 w-1/3" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-5 w-1/4" />
                            <div className="space-y-3 pt-4">
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <Skeleton className="h-20 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                </Card>
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
                    <br/><br/>
                    Verifique o console do navegador (F12) e o terminal onde o backend Python está rodando para mais detalhes.
                </AlertDescription>
            </Alert>
        </div>
     );
  }

  // 3. Estado Sem Produtos (Após Carregamento)
   if (products.length === 0 && !isLoading) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-3 text-balance">Compare Preços e Economize</h1>
                <p className="text-muted-foreground text-lg text-balance">
                Encontre as melhores ofertas em diversas lojas online
                </p>
            </header>
            <p className="text-muted-foreground text-lg">
                Nenhum produto encontrado no arquivo <code className="bg-muted px-1 rounded">precos.csv</code>.
                Execute o script <code className="bg-muted px-1 rounded">scraper.py</code> para buscar os preços primeiro.
            </p>
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

      <div className="space-y-8">
        {/* Mapeia sobre 'products' que vieram da API */}
        {products.map((product) => {
          // Calcula menor preço e maior desconto (com validações)
          const validPrices = product.stores.filter(s => s.price > 0 && s.inStock).map(s => s.price);
          const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

          const highestDiscount = Math.max(
            0,
            ...product.stores
              .filter((s) => s.originalPrice && s.originalPrice > s.price && s.inStock)
              .map((s) => ((s.originalPrice! - s.price) / s.originalPrice!) * 100),
          );

          // Fallback de imagem caso a URL da API falhe
          const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
              event.currentTarget.src = '/placeholder.svg'; // Ou outra imagem placeholder
              event.currentTarget.onerror = null; // Evita loop infinito se o placeholder também falhar
          };

          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                {/* Product Image Section */}
                <div className="space-y-3">
                  <button onClick={() => handleImageClick(product)} className="relative group cursor-pointer w-full">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <img
                        // Usa product.image OU placeholder
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform group-hover:scale-105" // object-contain pode ser melhor que cover
                        onError={handleImageError} // Adiciona fallback de erro
                      />
                    </div>
                    {/* Overlay do histórico */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                      <div className="text-white text-center">
                        <TrendingDown className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Ver Histórico de Preços</p>
                      </div>
                    </div>
                  </button>
                  <Badge variant="secondary" className="w-full justify-center truncate">
                    {/* Usa product.category */}
                    {product.category}
                  </Badge>
                </div>

                {/* Product Details Section */}
                <div className="space-y-4">
                  <div>
                    {/* Usa product.name */}
                    <h2 className="text-2xl font-bold mb-2 text-balance">{product.name}</h2>
                    {highestDiscount > 0 && (
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        {/* Mostra desconto */}
                        Até {highestDiscount.toFixed(0)}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Stores Comparison */}
                  <div className="space-y-3">
                    {/* Mapeia sobre product.stores */}
                    {product.stores.map((store, index) => {
                      const isLowestPrice = store.price === lowestPrice && store.price > 0 && store.inStock;
                      const discount = store.originalPrice && store.originalPrice > store.price && store.inStock
                        ? ((store.originalPrice - store.price) / store.originalPrice) * 100
                        : 0;

                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            isLowestPrice ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Detalhes da Loja */}
                            <div className="flex-1 space-y-2 min-w-0"> {/* Adicionado min-w-0 */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg truncate">{store.name}</h3> {/* Adicionado truncate */}
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

                              {/* Rating e Reviews (Ocultos se rating for 0) */}
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
                                className="w-full sm:w-auto mt-2" // Adiciona margem
                                size="sm" // Tamanho consistente
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
        })}
      </div>

      {/* Modal (usa selectedProduct com dados da API) */}
      {selectedProduct && (
        <PriceHistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />
      )}
    </div>
  )
}