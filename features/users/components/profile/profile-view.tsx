"use client";

import { useEffect, useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Camera,
  Bell,
  MessageSquare,
  Laptop,
  Smartphone,
  Loader2,
  Save,
  Pencil,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getProfile,
  updateProfileBasic,
  changePassword,
  updatePreferences,
  getActivityLogs,
  requestEmailChange,
  uploadAvatar,
  type UserProfile,
  type UserActivityLog,
} from "@/features/profile/services/profile.service";
import { VerificationCodeDialog } from "@/features/profile/components/verification-code-dialog";

export function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modals state
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [savingBasic, setSavingBasic] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  // Email 2FA change dialog state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [requestingCode, setRequestingCode] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

  // Preferences toggles state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [updatingPrefs, setUpdatingPrefs] = useState(false);

  // File upload ref for avatar
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [userProfile, logs] = await Promise.all([
        getProfile(),
        getActivityLogs().catch(() => []),
      ]);
      setProfile(userProfile);
      setNameInput(userProfile.name);
      setPhoneInput(userProfile.phone || "+57 300 123 4567");
      setEmailNotifs(userProfile.emailNotificationsEnabled ?? true);
      setInAppNotifs(userProfile.inAppNotificationsEnabled ?? true);
      setActivityLogs(logs);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo cargar la información del perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    setSavingBasic(true);
    try {
      const updated = await updateProfileBasic({ name: nameInput.trim() });
      setProfile(updated);
      setEditNameOpen(false);
      toast.success("Nombre actualizado correctamente.");
    } catch (err: any) {
      toast.error(err?.message || "Error al actualizar el nombre.");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBasic(true);
    try {
      const updated = await updateProfileBasic({
        name: profile?.name || nameInput,
        phone: phoneInput.trim(),
      });
      setProfile(updated);
      setEditPhoneOpen(false);
      toast.success("Teléfono actualizado correctamente.");
    } catch (err: any) {
      toast.error(err?.message || "Error al actualizar el teléfono.");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Por favor ingresa tu contraseña actual.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setChangingPass(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Contraseña actualizada correctamente.");
    } catch (err: any) {
      toast.error(err?.message || "Error al cambiar la contraseña.");
    } finally {
      setChangingPass(false);
    }
  };

  const handleTogglePreference = async (type: "email" | "inApp", value: boolean) => {
    const newEmailNotifs = type === "email" ? value : emailNotifs;
    const newInAppNotifs = type === "inApp" ? value : inAppNotifs;

    if (type === "email") setEmailNotifs(value);
    if (type === "inApp") setInAppNotifs(value);

    setUpdatingPrefs(true);
    try {
      const updated = await updatePreferences({
        emailNotificationsEnabled: newEmailNotifs,
        inAppNotificationsEnabled: newInAppNotifs,
      });
      setProfile(updated);
      toast.success("Preferencias actualizadas correctamente.");
    } catch (err: any) {
      // Revert if error
      if (type === "email") setEmailNotifs(!value);
      if (type === "inApp") setInAppNotifs(!value);
      toast.error(err?.message || "No se pudieron actualizar las preferencias.");
    } finally {
      setUpdatingPrefs(false);
    }
  };

  const handleRequestEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNewEmail = newEmailInput.trim().toLowerCase();
    if (!cleanNewEmail) {
      toast.error("Por favor ingresa el nuevo correo electrónico.");
      return;
    }
    if (cleanNewEmail === profile?.email.toLowerCase()) {
      toast.error("El nuevo correo debe ser diferente al actual.");
      return;
    }

    setRequestingCode(true);
    try {
      const res = await requestEmailChange(cleanNewEmail);
      toast.success(res.message || "Códigos de verificación enviados.");
      setEmailDialogOpen(false);
      setVerificationDialogOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo solicitar el cambio de correo.");
    } finally {
      setRequestingCode(false);
    }
  };

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
      toast.success("Imagen de perfil subida a Cloudinary correctamente.");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo subir la imagen de perfil.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center">
        <p className="text-muted-foreground font-medium">No se pudo cargar la información de tu perfil.</p>
        <Button onClick={fetchAllData} className="mt-4 bg-[#4a5833] hover:bg-[#3d492a] text-white">
          Reintentar
        </Button>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDateString = (dateIso: string) => {
    const d = new Date(dateIso);
    const dateStr = d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { dateStr, timeStr };
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarFileChange}
      />

      {/* Header Titulo Serif */}
      <div>
        <h1 className="font-heading text-3xl md:text-4xl text-foreground font-semibold tracking-tight">
          Mi perfil
        </h1>
        <p className="text-muted-foreground text-sm pt-1">
          Aquí puedes ver y editar tu información personal y de acceso.
        </p>
      </div>

      {/* Hero Profile Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: User Main Info */}
        <div className="lg:col-span-2 bg-card border rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xs">
          <div className="relative">
            <Avatar className="h-28 w-28 border-2 border-[#E9E4D7] shadow-sm">
              {profile.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-[#F6F4EE] text-[#756A49] font-heading text-3xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#4a5833] text-white flex items-center justify-center shadow-md hover:bg-[#3d492a] transition-colors cursor-pointer disabled:opacity-50"
              title="Cambiar imagen de perfil"
            >
              {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground font-bold">
              {profile.name}
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4 text-[#756A49]" />
                {profile.email}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <User className="h-4 w-4 text-[#756A49]" />
                {profile.role}
              </p>
            </div>
            <div className="pt-2 flex justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Activo
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Decorative Quote Banner */}
        <div className="bg-[#F7F5F0] border border-[#E9E4D7] rounded-2xl p-6 relative flex flex-col justify-center overflow-hidden">
          <div className="space-y-3 z-10 max-w-xs">
            <p className="font-heading italic text-xl md:text-2xl text-[#4a5833] leading-relaxed">
              "Juntos hacemos que cada pijama cuente una historia"
            </p>
            <p className="text-xl text-[#756A49]">♡</p>
          </div>
          {/* Subtle line-art leaf background */}
          <div className="absolute right-2 bottom-2 opacity-25 text-[#756A49] pointer-events-none">
            <svg width="90" height="110" viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M50 110 C50 70 80 40 80 10 C50 30 20 60 50 110 Z" />
              <path d="M50 110 L50 10" />
              <path d="M50 80 C65 70 75 60 75 60" />
              <path d="M50 60 C35 50 25 40 25 40" />
              <path d="M50 40 C65 30 70 20 70 20" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid de Configuración (4 Bloques) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloque 1: Información Personal */}
        <Card className="rounded-2xl border shadow-2xs">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold text-foreground">
              Información personal
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Actualiza tus datos personales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fila: Nombre completo */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-secondary/60 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Nombre completo</p>
                  <p className="text-sm font-semibold text-foreground">{profile.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNameInput(profile.name);
                  setEditNameOpen(true);
                }}
                className="border-[#E5DFD1] text-[#4a5833] hover:bg-[#F6F4EE] rounded-full text-xs font-medium px-4"
              >
                Editar
              </Button>
            </div>

            {/* Fila: Correo electrónico */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-secondary/60 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Correo electrónico</p>
                  <p className="text-sm font-semibold text-foreground">{profile.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewEmailInput("");
                  setEmailDialogOpen(true);
                }}
                className="border-[#E5DFD1] text-[#4a5833] hover:bg-[#F6F4EE] rounded-full text-xs font-medium px-4"
              >
                Editar
              </Button>
            </div>

            {/* Fila: Teléfono */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-secondary/60 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Teléfono</p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile.phone || "+57 300 123 4567"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPhoneInput(profile.phone || "+57 300 123 4567");
                  setEditPhoneOpen(true);
                }}
                className="border-[#E5DFD1] text-[#4a5833] hover:bg-[#F6F4EE] rounded-full text-xs font-medium px-4"
              >
                Editar
              </Button>
            </div>

            {/* Fila: Rol */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-secondary/60 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Rol</p>
                  <p className="text-sm font-semibold text-foreground">{profile.role}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-[#E5DFD1] text-muted-foreground rounded-full text-xs font-medium px-4 opacity-60"
              >
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bloque 2: Cambiar Contraseña */}
        <Card className="rounded-2xl border shadow-2xs flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="font-heading text-xl font-bold text-foreground">
                Cambiar contraseña
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Mantén tu cuenta segura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={changingPass}
                    className="pl-10 h-11 rounded-xl bg-background border-secondary"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={changingPass}
                    className="pl-10 h-11 rounded-xl bg-background border-secondary"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={changingPass}
                    className="pl-10 h-11 rounded-xl bg-background border-secondary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={changingPass}
                  className="w-full h-11 rounded-xl bg-[#4a5833] hover:bg-[#3d492a] text-white font-medium shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {changingPass ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </div>
        </Card>

        {/* Bloque 3: Preferencias */}
        <Card className="rounded-2xl border shadow-2xs">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold text-foreground">
              Preferencias
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Configura tus preferencias de notificaciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Toggle 1: Notificaciones por correo */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49] shrink-0">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Notificaciones por correo</p>
                  <p className="text-xs text-muted-foreground">Recibe actualizaciones importantes en tu correo.</p>
                </div>
              </div>
              <Switch
                checked={emailNotifs}
                disabled={updatingPrefs}
                onCheckedChange={(checked) => handleTogglePreference("email", checked)}
                className="data-[state=checked]:bg-[#4a5833]"
              />
            </div>

            {/* Toggle 2: Notificaciones en el panel */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49] shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Notificaciones en el panel</p>
                  <p className="text-xs text-muted-foreground">Recibe alertas sobre nuevas cotizaciones y mensajes.</p>
                </div>
              </div>
              <Switch
                checked={inAppNotifs}
                disabled={updatingPrefs}
                onCheckedChange={(checked) => handleTogglePreference("inApp", checked)}
                className="data-[state=checked]:bg-[#4a5833]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bloque 4: Actividad Reciente */}
        <Card className="rounded-2xl border shadow-2xs">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-bold text-foreground">
              Actividad reciente
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Últimos accesos a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No hay registros de actividad recientes.</p>
            ) : (
              activityLogs.slice(0, 3).map((log) => {
                const isMobile = log.deviceType.toLowerCase().includes("android") || log.deviceType.toLowerCase().includes("ios") || log.deviceType.toLowerCase().includes("phone");
                const { dateStr, timeStr } = formatDateString(log.createdAt);

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-secondary/40 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#756A49] shrink-0">
                        {isMobile ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{log.deviceType}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{log.ipAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-foreground">{dateStr}</p>
                      <p className="text-[11px] text-muted-foreground">{timeStr}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal 1: Editar Nombre */}
      <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold">Editar nombre completo</DialogTitle>
            <DialogDescription>Ingresa tu nuevo nombre completo de usuario.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveName} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="editName">Nombre completo</Label>
              <Input
                id="editName"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={savingBasic}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditNameOpen(false)} disabled={savingBasic}>
                Cancelar
              </Button>
              <Button type="submit" disabled={savingBasic} className="bg-[#4a5833] hover:bg-[#3d492a] text-white">
                {savingBasic ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Editar Teléfono */}
      <Dialog open={editPhoneOpen} onOpenChange={setEditPhoneOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold">Editar número de teléfono</DialogTitle>
            <DialogDescription>Ingresa tu nuevo número de teléfono de contacto.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePhone} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="editPhone">Número de teléfono</Label>
              <Input
                id="editPhone"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                disabled={savingBasic}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditPhoneOpen(false)} disabled={savingBasic}>
                Cancelar
              </Button>
              <Button type="submit" disabled={savingBasic} className="bg-[#4a5833] hover:bg-[#3d492a] text-white">
                {savingBasic ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Solicitar cambio de correo */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold">Cambiar correo electrónico</DialogTitle>
            <DialogDescription>
              Se enviará un código de verificación en dos pasos a tu correo actual y al nuevo correo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestEmailChangeSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reqEmail">Nuevo correo electrónico</Label>
              <Input
                id="reqEmail"
                type="email"
                placeholder="nuevo-correo@ejemplo.com"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                disabled={requestingCode}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEmailDialogOpen(false)} disabled={requestingCode}>
                Cancelar
              </Button>
              <Button type="submit" disabled={requestingCode || !newEmailInput.trim()} className="bg-[#4a5833] hover:bg-[#3d492a] text-white">
                {requestingCode ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                Enviar códigos
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Verification Code Dialog para cambio de correo 2FA */}
      <VerificationCodeDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        currentEmail={profile.email}
        newEmail={newEmailInput.trim().toLowerCase()}
        onSuccess={(updatedUser) => {
          setProfile(updatedUser);
          setNewEmailInput("");
        }}
      />
    </div>
  );
}