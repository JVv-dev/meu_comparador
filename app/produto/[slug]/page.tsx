// Conteúdo para: meu_comparador_frontend/app/produto/[slug]/page.tsx
// (v11.4 - Correção URL + Card de Descrição + Shrink-0)

"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from 'next/navigation' 
import Link from "next/link" 
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Legend 
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" 
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, TrendingDown, ExternalLink, Star, ShoppingCart, Trophy, Flame, AlertCircle } from "lucide-react"
import { AdBanner } from '@/components/AdBanner' 

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
 precoMinimoHistorico?: number 
 precoMedioHistorico?: number 
 descricao: string; // Campo para o HTML da descrição
}

// Configuração do Gráfico
const storeColors: { [key: string]: string } = {
 Kabum: "#FF6400",
 Pichau: "#35A2EB",
 Terabyte: "#4BC0C0",
 Default: "#8884d8",
};
const formatCurrency = (value: number): string => {
 if (!value || value === 0) return "N/D";
 return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
const CustomTooltip = ({ active, payload, label }: any) => {
   if (active && payload && payload.length) {
     return (
       <div className="bg-popover p-2 border border-border rounded shadow-lg text-sm">
         <p className="font-medium">{label}</p>
         {payload.map((entry: any) => (
           <p key={entry.name} style={{ color: entry.color }}>
             {`${entry.name}: ${formatCurrency(entry.value)}`}
           </p>
         ))}
       </div>
     );
   }
   return null;
};

// Componente da Página
export default function ProdutoPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const slug = params.slug;

    if (slug) {
      async function fetchProduct() {
        setIsLoading(true);
        setError(null);
        try {
          const productName = decodeURIComponent(slug as string);
          
          // --- CORREÇÃO DA URL (FIX FINAL) ---
          // Pega a URL base definida no ambiente (pode vir com /api/products no final)
          const envApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-comparador-backend.onrender.com/api/products";
          
          // Remove o sufixo '/api/products' (e barra final opcional) para pegar a raiz limpa
          const baseApiUrl = envApiUrl.replace(/\/api\/products\/?$/, ''); 
          
          // Monta a URL correta: raiz + /api/product/NomeDoProduto
          const apiUrl = `${baseApiUrl}/api/product/${encodeURIComponent(productName)}`;
          
          console.log(`Buscando produto em: ${apiUrl}`);

          const response = await fetch(apiUrl);

          if (!response.ok) {
             let msg = `Erro ${response.status}`;
             try { const errJson = await response.json(); if(errJson.error) msg = errJson.error; } catch(e){}
             throw new Error(msg);
          }

          const data = await response.json();
          setProduct(data);
        } catch (err: any) {
          console.error("Erro ao buscar produto:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProduct();
    }
  }, [params.slug]);

  // Lógica do Gráfico
  const { data: chartData, stores: uniqueLojas } = useMemo(() => {
    if (!product || !product.priceHistory || product.priceHistory.length === 0) {
      return { data: [], stores: [] };
    }
    const dataMap = new Map<string, any>();
    const stores = new Set<string>();
    for (const entry of product.priceHistory) {
      if (!entry.loja || !entry.price || entry.price === 0) continue; 
      stores.add(entry.loja); 
      let displayDate = entry.date;
      try {
        const dateObj = new Date(entry.date + 'T00:00:00Z');
        if (!isNaN(dateObj.getTime())) {
          displayDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
        }
      } catch (e) { console.warn(`Data inválida: ${entry.date}`) }
      const mapEntry = dataMap.get(entry.date) || { date: entry.date, displayDate };
      mapEntry[entry.loja] = entry.price;
      dataMap.set(entry.date, mapEntry);
    }
    const sortedData = Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return { data: sortedData, stores: Array.from(stores) };
  }, [product]);
  
  const handleStoreClick = (affiliateLink: string) => {
    window.open(affiliateLink, "_blank", "noopener,noreferrer")
  }

  // --- Renderização ---

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <Skeleton className="aspect-square rounded-lg w-full" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-80 w-full mt-8 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
           <Alert variant="destructive">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Erro 404 - Produto Não Encontrado</AlertTitle>
             <AlertDescription>
                 Não encontramos o produto que você está procurando. <br/>
                 <Link href="/" className="underline mt-2 block font-bold">Voltar para a página inicial</Link>
             </AlertDescription>
           </Alert>
      </div>
    );
  }

  if (!product) return null;

  const validPrices = product.stores.filter(s => s.price > 0 && s.inStock).map(s => s.price);
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">← Voltar</Link>
            <Badge variant="secondary">{product.category}</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-balance">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Imagem */}
        <div className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center border p-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Lista de Lojas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Comparativo de Lojas</h2>
          <div className="space-y-3">
            {product.stores.map((store) => { 
              const isLowestPrice = store.price === lowestPrice && store.price > 0 && store.inStock;
              const isBestHistorical = product.precoMinimoHistorico && store.price > 0 && store.price <= product.precoMinimoHistorico;
              
              return (
                <div key={store.name} className={`border rounded-lg p-4 transition-all ${isLowestPrice ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg truncate">{store.name}</h3>
                        {isLowestPrice && <Badge variant="default" className="text-xs shrink-0">Melhor Preço</Badge>}
                        {isBestHistorical && <Badge variant="outline" className="text-xs shrink-0 border-green-500 text-green-600"><Trophy className="w-3 h-3 mr-1" />Menor Histórico</Badge>}
                        {!store.inStock && <Badge variant="destructive" className="text-xs shrink-0">Indisponível</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{store.shipping}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className={`text-2xl sm:text-3xl font-bold whitespace-nowrap ${store.inStock && store.price > 0 ? 'text-primary' : 'text-muted-foreground text-xl'}`}>
                        {store.inStock && store.price > 0 ? `R$ ${store.price.toFixed(2).replace(".", ",")}` : "Indisponível"}
                      </div>
                      <Button
                        onClick={() => handleStoreClick(store.affiliateLink)}
                        disabled={!store.inStock}
                        className="w-full sm:w-auto mt-2"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>Ir à Loja</span>
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

      {/* CARD DE DESCRIÇÃO (Renderiza o HTML do banco) */}
      {product.descricao && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detalhes Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none overflow-hidden"
              dangerouslySetInnerHTML={{ __html: product.descricao }}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Banner */}
      <div className="my-8 text-center" translate="no"> 
        <AdBanner dataAdSlot="3194989646" className="h-[100px]" /> 
      </div>

      {/* Gráfico */}
      <Card className="mt-8 p-4 md:p-6">
        <h2 className="text-2xl font-semibold mb-4">Histórico de Preços</h2>
        {chartData.length > 1 ? (
          <div className="h-[400px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}> 
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  angle={-45}
                  textAnchor="end"
                  height={60} 
                  interval="preserveStartEnd"
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `R$ ${value}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '15px' }} />
                
                {uniqueLojas.map(loja => {
                    const color = storeColors[loja] || storeColors.Default;
                    return (
                        <Line
                            key={loja}
                            type="monotone"
                            dataKey={loja}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: color }}
                            activeDot={{ r: 5 }}
                            connectNulls 
                        />
                    );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Histórico insuficiente para exibir o gráfico.
          </div>
        )}
      </Card>
      
    </main>
  )
}