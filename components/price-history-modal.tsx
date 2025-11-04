"use client"

// --- Imports (Adicionado useState, useEffect, Checkbox, Label) ---
import { useMemo, useState, useEffect } from "react" 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox" // <-- ADICIONADO
import { Label } from "@/components/ui/label"       // <-- ADICIONADO

// --- INTERFACE ATUALIZADA ---
interface PriceHistoryEntry {
 date: string;
 price: number;
 loja: string; 
}

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

// Cores fixas para cada loja (você pode adicionar mais)
const storeColors: { [key: string]: string } = {
 Kabum: "#FF6400", // Laranja
 Pichau: "#35A2EB", // Azul
 Terabyte: "#4BC0C0", // Verde
 // Adicione mais cores se novas lojas entrarem
 Default: "#8884d8",
};

// Formata um número como moeda BRL
const formatCurrency = (value: number): string => {
 if (!value || value === 0) return "N/D"; // 'Não disponível'
 return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


export function PriceHistoryModal({ isOpen, onClose, product }: PriceHistoryModalProps) {

 // ---- Lógica de transformação de dados (O SEU CÓDIGO) ----
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
 // ---- FIM DA LÓGICA DE TRANSFORMAÇÃO ----

 // --- NOVO: State para os filtros de checkbox ---
 const [visibleLojas, setVisibleLojas] = useState<string[]>([]);

 // Efeito para popular os checkboxes quando os dados carregam
 useEffect(() => {
    // Define todas as lojas como visíveis por padrão quando o produto muda
    setVisibleLojas(uniqueLojas);
 }, [uniqueLojas, product]); // Depende do 'product' para resetar ao abrir um novo modal
 // --- FIM DO NOVO STATE ---

 // --- NOVA FUNÇÃO: Para lidar com o clique no checkbox ---
  const handleLojaToggle = (loja: string) => {
    setVisibleLojas(prev =>
      prev.includes(loja)
        ? prev.filter(l => l !== loja) // Remove a loja se já estiver lá
        : [...prev, loja] // Adiciona a loja se não estiver
    );
  };
 // --- FIM DA NOVA FUNÇÃO ---


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

 // Lógica de cálculo (do seu código)
 const latestDate = product.priceHistory[product.priceHistory.length - 1]?.date;
 const currentPrices = product.priceHistory
   .filter(p => p.date === latestDate && p.price > 0)
   .map(p => p.price);
 
 const currentPrice = currentPrices.length > 0 ? Math.min(...currentPrices) : 0;
 
 const allPrices = product.priceHistory
   .filter(p => p.price > 0)
   .map(p => p.price);

 const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;


 // --- TOOLTIP (O SEU CÓDIGO) ---
 const CustomTooltip = ({ active, payload, label }: any) => {
   if (active && payload && payload.length) {
     return (
       <div className="bg-popover p-2 border border-border rounded shadow-lg text-sm">
         <p className="font-medium">{label}</p> {/* 'label' é o displayDate */}
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
         {/* Price Summary (do seu código) */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
           <div className="bg-muted rounded-lg p-4 text-center sm:text-left">
             <p className="text-sm text-muted-foreground mb-1">Menor Preço Atual</p>
             <p className="text-2xl font-bold text-primary">{formatCurrency(currentPrice)}</p>
           </div>
           <div className="bg-muted rounded-lg p-4 text-center sm:text-left">
             <p className="text-sm text-muted-foreground mb-1">Menor Preço Registrado</p>
             <p className="text-2xl font-bold">{formatCurrency(lowestPrice)}</p>
           </div>
         </div>

         {/* Chart */}
         {chartData.length > 1 ? (
           <div className="bg-card rounded-lg p-4 border">
             <h3 className="text-lg font-semibold mb-2">Histórico de Preços por Loja</h3>
             
             {/* --- ADICIONADO: FILTROS DE CHECKBOX --- */}
             <div className="flex flex-wrap gap-x-6 gap-y-2 py-4 border-t border-b mb-4">
               {uniqueLojas.map((loja) => (
                 <div key={loja} className="flex items-center space-x-2">
                   <Checkbox
                     id={`check-${loja}`}
                     checked={visibleLojas.includes(loja)}
                     onCheckedChange={() => handleLojaToggle(loja)}
                     style={{ 
                        backgroundColor: visibleLojas.includes(loja) ? (storeColors[loja] || storeColors["Default"]) : undefined,
                        borderColor: storeColors[loja] || storeColors["Default"]
                     }}
                   />
                   <Label
                     htmlFor={`check-${loja}`}
                     className="cursor-pointer"
                     style={{ color: storeColors[loja] || storeColors["Default"] }}
                   >
                     {loja}
                   </Label>
                 </div>
               ))}
             </div>
             {/* --- FIM DOS FILTROS --- */}

             <ResponsiveContainer width="100%" height={300}>
               {/* --- GRÁFICO (O SEU CÓDIGO) --- */}
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
                 
                 {/* --- LÓGICA DE LINHAS ATUALIZADA (com filtro) --- */}
                 {/* Renderiza uma linha para cada loja *se* ela estiver visível */}
                 {uniqueLojas.map(loja => {
                    const color = storeColors[loja] || storeColors.Default;
                    return (
                        visibleLojas.includes(loja) && ( // <-- AQUI ESTÁ O FILTRO
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
                        )
                    );
                 })}
                 {/* --- FIM DA LÓGICA DE LINHAS --- */}

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