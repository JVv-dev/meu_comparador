"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Ticket, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Cupom {
    id: number
    codigo: string
    descricao: string
    validade: string
    link: string
}

export default function CuponsPage() {
    const [cupons, setCupons] = useState<Cupom[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        async function load() {
             try {
                 const envApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-comparador-backend.onrender.com/api/products";
                 const baseApiUrl = envApiUrl.replace(/\/api\/products\/?$/, '');
                 
                 const res = await fetch(`${baseApiUrl}/api/coupons`)
                 const data = await res.json()
                 setCupons(data)
             } catch(e) { console.error(e) }
             finally { setLoading(false) }
        }
        load()
    }, [])

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast({ 
            title: "Código Copiado!", 
            description: `Cupom ${code} pronto para usar.` 
        })
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                    <Ticket className="w-10 h-10 text-primary" />
                    Cupons & Ofertas
                </h1>
                <p className="text-muted-foreground">Economize ainda mais com cupons exclusivos da Kabum e parceiros.</p>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-primary"/></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cupons.map(cupom => (
                        <Card key={cupom.id} className="border-dashed border-2 hover:border-primary/50 transition-all hover:shadow-md group">
                            <CardHeader className="pb-3 bg-muted/30">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">Kabum</Badge>
                                    {cupom.validade !== "Verificar no site" && (
                                        <span className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded border">
                                            {cupom.validade}
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-xl font-mono text-primary tracking-wide flex items-center gap-2">
                                    {cupom.codigo}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground mb-6 min-h-10 line-clamp-2">
                                    {cupom.descricao}
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={() => copyCode(cupom.codigo)}>
                                        <Copy className="w-4 h-4 mr-2" /> Copiar
                                    </Button>
                                    <Button className="flex-1" onClick={() => window.open(cupom.link, '_blank')}>
                                        Usar <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {cupons.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
                            <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">Nenhum cupom encontrado</h3>
                            <p className="text-muted-foreground">Os ninjas estão buscando novas ofertas. Volte em breve!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}