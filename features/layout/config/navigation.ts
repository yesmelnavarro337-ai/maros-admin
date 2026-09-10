import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  CalendarRange,
  Palette,
  ClipboardList,
  Users,
  Image as ImageIcon,
  Newspaper,
  Quote,
  GalleryHorizontalEnd,
  Sparkles,
  Settings,
  UserCog,
  type LucideIcon,
  HelpCircle,
  Mail,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Productos", href: "/admin/productos", icon: ShoppingBag },
  { label: "Colecciones", href: "/admin/colecciones", icon: Layers },
  { label: "Temporadas", href: "/admin/temporadas", icon: CalendarRange },
  { label: "Personalización", href: "/admin/personalizacion", icon: Palette },
  { label: "Cotizaciones", href: "/admin/cotizaciones", icon: ClipboardList },
  { label: "Mensajes de Contacto", href: "/admin/mensajes-contacto", icon: Mail },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Galería", href: "/admin/galeria", icon: ImageIcon },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Testimonios", href: "/admin/testimonios", icon: Quote },
  { label: "Preguntas Frecuentes", href: "/admin/preguntas-frecuentes", icon: HelpCircle },
  { label: "Banners", href: "/admin/banners", icon: GalleryHorizontalEnd },
  { label: "Apariencia", href: "/admin/apariencia", icon: Sparkles },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
  { label: "Usuarios", href: "/admin/usuarios", icon: UserCog },
];