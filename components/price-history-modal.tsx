"use client"

import { useMemo } from "react" // --- NOVO: Para processar os dados
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend // --- NOVO: Para a legenda
} from "recharts"
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// --- INTERFACE ATUALIZADA ---
// Precisamos que a API envie a 'loja'
interface PriceHistoryEntry {
  date: string; // 'YYYY-MM-DD'
  price: number;
  loja: string; // "Kabum", "Pichau", "Terabyte"
}

// --- INTERFACE ATUALIZADA ---
interface Product {
  id: string
  name: string
  image: string
  priceHistory: PriceHistoryEntry[]
}

interface PriceHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

// Cores fixas para cada loja
const storeColors = {
  Kabum: "#FF6400", // Laranja
  Pichau: "#35A2EB", // Azul
  Terabyte: "#4BC0C0", // Verde
};

// Formata um número como moeda BRL
const formatCurrency = (value: number): string => {
  if (!value || value === 0) return "N/D"; // 'Não disponível'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


export function PriceHistoryModal({ isOpen, onClose, product }: PriceHistoryModalProps) {

  // ---- NOVO: Lógica de transformação de dados ----
  // Transforma os dados "longos" (várias entradas por data)
  // em dados "largos" (uma entrada por data com colunas de loja)
  const chartData = useMemo(() => {
    if (!product || !product.priceHistory || product.priceHistory.length === 0) {
      return { data: [], stores: [] };
    }

    const dataMap = new Map<string, any>();
    const stores = new Set<string>();

    for (const entry of product.priceHistory) {
      // Ignora preços zerados/indisponíveis no gráfico
      if (!entry.loja || !entry.price || entry.price === 0) continue; 
      
      stores.add(entry.loja); // Adiciona a loja ao Set (ex: 'Kabum')

      // Formata a data para o eixo X
      let displayDate = entry.date;
      try {
        const dateObj = new Date(entry.date + 'T00:00:00Z');
        if (!isNaN(dateObj.getTime())) {
          displayDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
        }
      } catch (e) { console.warn(`Data inválida: ${entry.date}`) }

      // Cria ou atualiza a entrada no Map
      const mapEntry = dataMap.get(entry.date) || { date: entry.date, displayDate };
      
      // Adiciona o preço na coluna da loja (ex: mapEntry.Kabum = 1550)
      mapEntry[entry.loja] = entry.price;
      
      dataMap.set(entry.date, mapEntry);
    }
    
    // Converte o Map para um Array e ordena por data
    const sortedData = Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { data: sortedData, stores: Array.from(stores) };

  }, [product]);
  // ---- FIM DA LÓGICA DE TRANSFORMAÇÃO ----


  // Tratamento se 'product' for null ou priceHistory vazio
  if (!product || !product.priceHistory || product.priceHistory.length === 0) {
    if (!isOpen) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Erro</DialogTitle>
                </DialogHeader>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Sem Dados de Histórico</AlertTitle>
                    <AlertDescription>
                        Não foi possível carregar o histórico de preços para este produto.
                    </AlertDescription>
                </Alert>
            </DialogContent>
        </Dialog>
    );
  }

  // Lógica de cálculo (simplificada, pois agora temos várias lojas)
  // Vamos pegar o menor preço atual
  const latestDate = product.priceHistory[product.priceHistory.length - 1]?.date;
  const currentPrices = product.priceHistory
    .filter(p => p.date === latestDate && p.price > 0)
    .map(p => p.price);
  
  const currentPrice = currentPrices.length > 0 ? Math.min(...currentPrices) : 0;
  
  const allPrices = product.priceHistory
    .filter(p => p.price > 0)
    .map(p => p.price);

  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;


  // --- TOOLTIP ATUALIZADO para múltiplas lojas ---
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border border-border rounded shadow-lg text-sm">
          <p className="font-medium">{label}</p> {/* 'label' é o displayDate */}
          {/* Mapeia o payload (que agora tem uma entrada por *linha*) */}
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


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl sm:text-2xl text-balance">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Ajustado para 2 colunas */}
            <div className="bg-muted rounded-lg p-4 text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-1">Menor Preço Atual</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(currentPrice)}</p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-1">Menor Preço Hist.</p>
              <p className="text-2xl font-bold">{formatCurrency(lowestPrice)}</p>
            </div>
          </div>

          {/* Chart */}
          {chartData.data.length > 1 ? (
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-lg font-semibold mb-4">Histórico de Preços por Loja</h3>
              <ResponsiveContainer width="100%" height={300}>
                {/* --- GRÁFICO ATUALIZADO --- */}
                <LineChart data={chartData.data} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}> {/* Mais margem inferior */}
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    dataKey="displayDate"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    angle={-45}
                    textAnchor="end"
                    height={60} // Mais espaço para labels
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `R$ ${value}`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* --- NOVO: Legenda --- */}
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '15px' }} />
                  
                  {/* --- NOVO: Linhas Dinâmicas --- */}
                  {/* Renderiza uma linha para cada loja encontrada */}
                  {chartData.stores.includes("Kabum") && (
                    <Line
                      type="monotone"
                      dataKey="Kabum"
                      stroke={storeColors.Kabum}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls // Conecta se houver dias faltando
                    />
                  )}
                  {chartData.stores.includes("Pichau") && (
                    <Line
                      type="monotone"
                      dataKey="Pichau"
                      stroke={storeColors.Pichau}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  )}
                  {chartData.stores.includes("Terabyte") && (
                    <Line
                      type="monotone"
                      dataKey="Terabyte"
                      stroke={storeColors.Terabyte}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-card rounded-lg p-4 border text-center">
              <p className="text-muted-foreground">Não há dados de histórico suficientes para gerar o gráfico.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}