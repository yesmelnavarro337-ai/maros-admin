// -
// ASISTENTE DE PERSONALIZACION CON IA (GEMINI) - DESACTIVADO
// Panel de estado del asistente comentado temporalmente. Para
// reactivarlo: quitar el prefijo `// ` de las lineas siguientes y
// descomentar los puntos marcados igual en types.ts, settings-nav.tsx,
// settings-shell.tsx y settings.service.ts.
// -
// "use client";
//
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Sparkles, Loader2, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
// import { toast } from "@/lib/toast";
// import { getAIAssistantStatus } from "../services/settings.service";
// import type { AIAssistantStatus } from "../services/settings.service";
//
// /**
//  * Estado del asistente de personalizaci-n con IA (Gemini). Es solo lectura: la
//  * activaci-n se controla con las variables de entorno del backend, por lo que
//  * este panel -nicamente consulta y muestra el estado en tiempo real.
//  */
// export function SettingsAiAssistantPanel() {
//   const [status, setStatus] = useState<AIAssistantStatus | null>(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     let active = true;
//     getAIAssistantStatus()
//       .then((result) => {
//         if (active) setStatus(result);
//       })
//       .catch(() => {
//         if (active) setStatus({ enabled: false, model: null });
//       })
//       .finally(() => {
//         if (active) setLoading(false);
//       });
//     return () => {
//       active = false;
//     };
//   }, []);
//
//   async function handleVerify() {
//     setLoading(true);
//     try {
//       const result = await getAIAssistantStatus();
//       setStatus(result);
//       if (result.enabled) {
//         toast.success("Asistente activo: Gemini est- configurado correctamente.");
//       } else {
//         toast.info("Asistente inactivo: Gemini no est- configurado.");
//       }
//     } catch (error) {
//       setStatus({ enabled: false, model: null });
//       toast.error(
//         error instanceof Error ? error.message : "No se pudo verificar el estado del asistente."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }
//
//   if (loading && !status) {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="h-24 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
//         <div className="h-40 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
//       </div>
//     );
//   }
//
//   const enabled = status?.enabled ?? false;
//
//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
//         <div className="flex items-center gap-3">
//           <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4a5833]/10 text-[#4a5833]">
//             <Sparkles className="h-5 w-5" />
//           </span>
//           <div>
//             <p className="text-sm font-semibold text-foreground">
//               Asistente de Personalizaci-n IA (Gemini)
//             </p>
//             <p className="text-xs text-muted-foreground">
//               Recomienda telas, colores, estampados y bordados con IA. No genera im-genes.
//             </p>
//           </div>
//         </div>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={handleVerify}
//           disabled={loading}
//           className="gap-1.5 text-xs shrink-0"
//         >
//           <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
//           Verificar estado
//         </Button>
//       </div>
//
//       <div className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
//         <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
//           <p className="text-sm font-semibold text-foreground">Estado actual</p>
//           {enabled ? (
//             <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
//               <CheckCircle2 className="h-3.5 w-3.5" /> Activo
//             </span>
//           ) : (
//             <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
//               <AlertTriangle className="h-3.5 w-3.5" /> Inactivo
//             </span>
//           )}
//         </div>
//
//         <div className="pt-4">
//           {enabled ? (
//             <div className="flex flex-col gap-2">
//               <p className="text-xs text-muted-foreground">
//                 El asistente est- disponible para los clientes durante la personalizaci-n.
//               </p>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs font-medium text-foreground">Modelo configurado:</span>
//                 <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
//                   {status?.model || "-"}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-2">
//               <p className="text-sm text-foreground">
//                 El asistente de IA no est- disponible en este momento.
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 Para activarlo, asigna{" "}
//                 <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">GEMINI_API_KEY</code>{" "}
//                 en las variables de entorno de Render (y opcionalmente{" "}
//                 <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">GEMINI_ENABLED=true</code>).
//                 Luego reinicia el servicio y pulsa -Verificar estado-.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//
//       {loading && status && (
//         <p className="flex items-center gap-2 text-xs text-muted-foreground">
//           <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verificando estado-
//         </p>
//       )}
//     </div>
//   );
// }
//
