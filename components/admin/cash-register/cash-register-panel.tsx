"use client"

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowUp, ArrowDown, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Movement {
  id: number;
  type: string;
  amount: string;
  description: string;
  created_at: string;
}
interface Session {
  id: number;
  start_amount: string;
  opened_at: string;
}

export function CashRegisterPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startAmount, setStartAmount] = useState("");
  const [endAmount, setEndAmount] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [movementData, setMovementData] = useState({ type: 'income', amount: '', description: '' });
  const { toast } = useToast();

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cash-register/session');
      const data = await res.json();
      setSession(data.session);
      setMovements(data.movements || []);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el estado de la caja." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSession(); }, []);

  const total = useMemo(() => movements.reduce((sum, m) => sum + parseFloat(m.amount), 0), [movements]);

  const handleOpenSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/cash-register/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_amount: parseFloat(startAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Éxito", description: "Caja abierta correctamente." });
      fetchSession();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/cash-register/movements', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...movementData, amount: parseFloat(movementData.amount) })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        toast({ title: "Éxito", description: "Movimiento registrado." });
        setMovementData({ type: 'income', amount: '', description: '' });
        fetchSession();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };
  
  const handleCloseSession = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const res = await fetch('/api/cash-register/session', {
            method: 'PUT', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ end_amount: parseFloat(endAmount), notes: closeNotes })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message);
        toast({ title: "Éxito", description: "Caja cerrada correctamente." });
        setSession(null);
        setMovements([]);
        setEndAmount("");
        setCloseNotes("");
        // Close the dialog, which might require managing state if it's controlled.
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
  }


  if (isLoading && !session) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  if (!session) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader><CardTitle>Abrir Caja</CardTitle><CardDescription>Ingresa el monto inicial para comenzar el día.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleOpenSession} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="startAmount">Monto Inicial (€)</Label><Input id="startAmount" type="number" step="0.01" value={startAmount} onChange={e => setStartAmount(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Abrir Caja"}</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Toaster />
      <div className="lg:col-span-2">
        <Card>
          <CardHeader><CardTitle>Movimientos de Caja</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Hora</TableHead><TableHead>Descripción</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
              <TableBody>
                {movements.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{new Date(m.created_at).toLocaleTimeString('es-ES')}</TableCell>
                    <TableCell><div className="font-medium">{m.description}</div><div className="text-xs text-gray-500 capitalize">{m.type}</div></TableCell>
                    <TableCell className={`text-right font-semibold ${parseFloat(m.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(m.amount) >= 0 ? '+' : ''}€{parseFloat(m.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="sticky top-20">
          <CardHeader><CardTitle>Estado de Caja</CardTitle><CardDescription>Abierta el {new Date(session.opened_at).toLocaleDateString('es-ES')}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline"><span className="text-gray-600">Saldo Actual</span><span className="text-2xl font-bold">€{total.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Monto Inicial</span><span>€{parseFloat(session.start_amount).toFixed(2)}</span></div>
            <Dialog>
                <DialogTrigger asChild><Button className="w-full" variant="destructive">Cerrar Caja</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Cerrar Caja</DialogTitle><DialogDescription>Realiza el arqueo final para cerrar la sesión.</DialogDescription></DialogHeader>
                    <form onSubmit={handleCloseSession} className="space-y-4">
                        <div className="space-y-2"><Label>Monto Final en Caja (€)</Label><Input type="number" step="0.01" value={endAmount} onChange={e => setEndAmount(e.target.value)} required /></div>
                        <div className="space-y-2"><Label>Notas de Cierre</Label><Textarea value={closeNotes} onChange={e => setCloseNotes(e.target.value)} /></div>
                        <DialogFooter><Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Confirmar Cierre"}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card className="mt-6">
            <CardHeader><CardTitle>Registrar Movimiento</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleAddMovement} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button type="button" variant={movementData.type === 'income' ? 'default' : 'outline'} onClick={()=>setMovementData(p=>({...p, type:'income'}))}><ArrowUp className="w-4 h-4 mr-2"/>Ingreso</Button>
                        <Button type="button" variant={movementData.type === 'expense' ? 'destructive' : 'outline'} onClick={()=>setMovementData(p=>({...p, type:'expense'}))}><ArrowDown className="w-4 h-4 mr-2"/>Gasto</Button>
                    </div>
                    <div className="space-y-2"><Label>Monto (€)</Label><Input type="number" step="0.01" value={movementData.amount} onChange={e=>setMovementData(p=>({...p, amount: e.target.value}))} required/></div>
                    <div className="space-y-2"><Label>Descripción</Label><Input value={movementData.description} onChange={e=>setMovementData(p=>({...p, description: e.target.value}))} required/></div>
                    <Button type="submit" className="w-full">Registrar</Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}