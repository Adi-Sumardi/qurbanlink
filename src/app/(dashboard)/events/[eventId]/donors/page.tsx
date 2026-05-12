'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowLeft, Plus, Search, Pencil, Trash2, Upload, Loader2,
  HandCoins, User, Users, X, UserPlus, Info, PawPrint, ChevronRight, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { donorService } from '@/services/donor.service';
import { animalService } from '@/services/animal.service';
import { usePermissions } from '@/hooks/use-permissions';
import { DONOR_STATUS_LABELS, ANIMAL_TYPE_LABELS, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { donorSchema, type DonorFormValues } from '@/lib/validations/donor';
import { animalSchema, type AnimalFormValues } from '@/lib/validations/animal';
import type { QueryParams, Donor } from '@/types';

type Step = 'donor' | 'animal';

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'donor', label: 'Data Donatur', icon: User },
  { id: 'animal', label: 'Hewan Kurban', icon: PawPrint },
];

export default function DonorsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isViewer, isOperator } = usePermissions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canEdit = mounted && !isViewer && !isOperator;

  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: DEFAULT_PAGE_SIZE, search: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<Step>('donor');
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [newDonorId, setNewDonorId] = useState<string | null>(null);
  const [deleteDonorId, setDeleteDonorId] = useState<string | null>(null);
  const [kurbanType, setKurbanType] = useState<'pribadi' | 'patungan'>('pribadi');
  const [participantsModal, setParticipantsModal] = useState<Donor | null>(null);
  const [detailModal, setDetailModal] = useState<Donor | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['donors', eventId, params],
    queryFn: () => donorService.getAll(eventId, params),
    enabled: !!eventId,
  });
  const donors = data?.data ?? [];
  const meta = data?.meta;

  /* ── Donor form ── */
  const donorForm = useForm<DonorFormValues>({
    resolver: zodResolver(donorSchema),
    defaultValues: { name: '', phone: '', email: '', address: '', nik: '', notes: '', kurban_type: 'pribadi', participants: [] },
  });
  const { fields, append, remove } = useFieldArray({ control: donorForm.control, name: 'participants' });

  /* ── Animal form ── */
  const animalForm = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
    defaultValues: { donor_id: '', type: '', breed: '', weight: 0, color: '', estimated_portions: undefined, notes: '' },
  });

  /* ── Mutations ── */
  const createDonor = useMutation({
    mutationFn: (d: DonorFormValues) => donorService.create(eventId, d),
    onSuccess: (res) => {
      toast.success('Donatur berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      const id = res.data?.id;
      if (id) {
        setNewDonorId(id);
        animalForm.reset({ donor_id: id, type: '', breed: '', weight: 0, color: '', estimated_portions: undefined, notes: '' });
        setStep('animal');
      } else {
        closeDialog();
      }
    },
    onError: () => toast.error('Gagal menambahkan donatur'),
  });

  const updateDonor = useMutation({
    mutationFn: (d: DonorFormValues) => donorService.update(eventId, editingDonor!.id, d),
    onSuccess: () => {
      toast.success('Donatur berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      closeDialog();
    },
    onError: () => toast.error('Gagal memperbarui donatur'),
  });

  const deleteDonor = useMutation({
    mutationFn: (id: string) => donorService.delete(eventId, id),
    onSuccess: () => {
      toast.success('Donatur berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      setDeleteDonorId(null);
    },
    onError: () => toast.error('Gagal menghapus donatur'),
  });

  const createAnimal = useMutation({
    mutationFn: (d: AnimalFormValues) => animalService.create(eventId, d),
    onSuccess: () => {
      toast.success('Hewan kurban berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      closeDialog();
    },
    onError: () => toast.error('Gagal menambahkan hewan kurban'),
  });

  const importDonors = useMutation({
    mutationFn: (file: File) => donorService.import(eventId, file),
    onSuccess: (res) => {
      toast.success(`${res.data?.imported ?? 0} donatur berhasil diimpor`);
      queryClient.invalidateQueries({ queryKey: ['donors', eventId] });
      if (res.data?.errors?.length) toast.error(`${res.data.errors.length} baris gagal`);
    },
    onError: () => toast.error('Gagal mengimpor donatur'),
  });

  /* ── Helpers ── */
  function openAddDialog() {
    setEditingDonor(null);
    setNewDonorId(null);
    setStep('donor');
    setKurbanType('pribadi');
    donorForm.reset({ name: '', phone: '', email: '', address: '', nik: '', notes: '', kurban_type: 'pribadi', participants: [] });
    animalForm.reset({ donor_id: '', type: '', breed: '', weight: 0, color: '', notes: '' });
    setDialogOpen(true);
  }

  function openEditDialog(donor: Donor) {
    setEditingDonor(donor);
    setNewDonorId(null);
    setStep('donor');
    const type = donor.kurban_type ?? 'pribadi';
    setKurbanType(type);
    donorForm.reset({
      name: donor.name, phone: donor.phone ?? '', email: donor.email ?? '',
      address: donor.address ?? '', nik: donor.nik ?? '', notes: donor.notes ?? '',
      kurban_type: type,
      participants: donor.participants?.map((p) => ({ name: p.name })) ?? [],
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingDonor(null);
    setNewDonorId(null);
    setStep('donor');
    setKurbanType('pribadi');
    donorForm.reset();
    animalForm.reset();
  }

  function handleKurbanTypeChange(type: 'pribadi' | 'patungan') {
    setKurbanType(type);
    donorForm.setValue('kurban_type', type);
    if (type === 'pribadi') donorForm.setValue('participants', []);
  }

  function onDonorSubmit(data: DonorFormValues) {
    const payload = { ...data, kurban_type: kurbanType, participants: kurbanType === 'patungan' ? (data.participants ?? []) : [] };
    if (editingDonor) updateDonor.mutate(payload);
    else createDonor.mutate(payload);
  }

  function onAnimalSubmit(data: AnimalFormValues) {
    createAnimal.mutate({ ...data, donor_id: newDonorId ?? data.donor_id });
  }

  function skipAnimal() {
    toast.info('Data hewan kurban dapat diisi nanti di menu Hewan Kurban');
    closeDialog();
  }

  const isSavingDonor = createDonor.isPending || updateDonor.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/events/${eventId}`}><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Daftar Donatur</h1>
            <p className="text-muted-foreground">Kelola data donatur untuk event ini</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { importDonors.mutate(f); e.target.value = ''; } }} />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importDonors.isPending}>
              {importDonors.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
              Impor
            </Button>
            <Button onClick={openAddDialog}><Plus className="mr-2 size-4" />Tambah Donatur</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Donatur</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari donatur..." className="pl-9" value={params.search ?? ''} onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, page: 1 }))} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : donors.length === 0 ? (
            <EmptyState icon={HandCoins} title="Belum ada donatur" description={!canEdit && mounted ? 'Belum ada data donatur' : 'Tambahkan donatur baru atau impor dari file'} actionLabel={!canEdit && mounted ? undefined : 'Tambah Donatur'} onAction={!canEdit && mounted ? undefined : openAddDialog} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Jenis Kurban</TableHead>
                      <TableHead className="text-center">Hewan</TableHead>
                      <TableHead>Status</TableHead>
                      {canEdit && <TableHead className="text-right">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors.map((donor) => (
                      <TableRow
                        key={donor.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setDetailModal(donor)}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="hover:text-[#004532] transition-colors">{donor.name}</p>
                            {donor.kurban_type === 'patungan' && (donor.participants?.length ?? 0) > 0 && (
                              <p className="mt-0.5 text-xs text-muted-foreground">+{donor.participants!.length} peserta</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{donor.phone || '-'}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {donor.kurban_type === 'patungan' ? (
                            <button
                              type="button"
                              onClick={() => setParticipantsModal(donor)}
                              className="inline-flex items-center gap-1 rounded-full border border-[#004532]/20 bg-[#f0fbf4] px-2.5 py-1 text-xs font-semibold text-[#004532] transition-colors hover:bg-[#004532]/10 cursor-pointer"
                            >
                              <Users className="size-3" />
                              Patungan
                              {(donor.participants?.length ?? 0) > 0 && (
                                <span className="ml-0.5 rounded-full bg-[#004532] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                  {donor.participants!.length}
                                </span>
                              )}
                            </button>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-xs"><User className="size-3" />Pribadi</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">{donor.animals_count ?? 0}</TableCell>
                        <TableCell><StatusBadge status={donor.submission_status} label={DONOR_STATUS_LABELS[donor.submission_status]} /></TableCell>
                        {canEdit && (
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(donor)}><Pencil className="size-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteDonorId(donor.id)}><Trash2 className="size-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {meta && <div className="mt-4"><DataTablePagination meta={meta} onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))} onPageSizeChange={(s) => setParams((prev) => ({ ...prev, per_page: s, page: 1 }))} /></div>}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog — Multi Step */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDonor ? 'Edit Donatur' : 'Tambah Donatur'}</DialogTitle>
          </DialogHeader>

          {/* Step indicator — only for new donor */}
          {!editingDonor && (
            <div className="flex items-center gap-0">
              {STEPS.map((s, i) => {
                const isDone = step === 'animal' && s.id === 'donor';
                const isActive = step === s.id;
                return (
                  <div key={s.id} className="flex flex-1 items-center">
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${isActive ? 'bg-[#004532] text-white' : isDone ? 'text-[#004532]' : 'text-muted-foreground'}`}>
                      {isDone ? <Check className="size-3.5" /> : <s.icon className="size-3.5" />}
                      {s.label}
                    </div>
                    {i < STEPS.length - 1 && <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 1: Donor ── */}
          {step === 'donor' && (
            <>
              {/* Kurban Type Tabs */}
              <div className="flex gap-2 rounded-xl bg-muted p-1">
                {(['pribadi', 'patungan'] as const).map((t) => (
                  <button key={t} type="button" onClick={() => handleKurbanTypeChange(t)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${kurbanType === t ? 'bg-white text-[#191c1e] shadow-sm' : 'text-muted-foreground hover:text-[#191c1e]'}`}>
                    {t === 'pribadi' ? <User className="size-4" /> : <Users className="size-4" />}
                    {t === 'pribadi' ? 'Kurban Pribadi' : 'Kurban Patungan'}
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3">
                <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
                <p className="text-xs text-blue-800">
                  {kurbanType === 'pribadi'
                    ? 'Kurban Pribadi: 1 hewan kurban untuk 1 donatur.'
                    : 'Kurban Patungan: 1 hewan (biasanya sapi) dibagi beberapa orang. Catat semua nama peserta di bawah.'}
                </p>
              </div>

              <Form {...donorForm}>
                <form onSubmit={donorForm.handleSubmit(onDonorSubmit)} className="space-y-4">
                  <FormField control={donorForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{kurbanType === 'patungan' ? 'Nama Penanggung Jawab *' : 'Nama Donatur *'}</FormLabel>
                      <FormControl><Input placeholder={kurbanType === 'patungan' ? 'Nama ketua/penanggung jawab' : 'Nama donatur'} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={donorForm.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Telepon</FormLabel><FormControl><Input placeholder="08xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={donorForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <FormField control={donorForm.control} name="nik" render={({ field }) => (
                    <FormItem><FormLabel>NIK</FormLabel><FormControl><Input placeholder="Nomor Induk Kependudukan" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={donorForm.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Alamat</FormLabel><FormControl><Input placeholder="Alamat donatur" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={donorForm.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Catatan tambahan" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  {/* Participants */}
                  {kurbanType === 'patungan' && (
                    <div className="space-y-3 rounded-xl border border-dashed border-[#004532]/30 bg-[#f0fbf4] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#191c1e]">Peserta Patungan</p>
                          <p className="text-xs text-muted-foreground">{fields.length} nama tercatat</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="gap-1.5 border-[#004532]/30 text-[#004532] hover:bg-[#004532]/5" onClick={() => append({ name: '' })}>
                          <UserPlus className="size-3.5" />Tambah Nama
                        </Button>
                      </div>
                      {fields.length === 0 ? (
                        <p className="py-3 text-center text-xs text-muted-foreground">Belum ada peserta. Klik &quot;Tambah Nama&quot;.</p>
                      ) : (
                        <div className="space-y-2">
                          {fields.map((f, i) => (
                            <div key={f.id} className="flex items-center gap-2">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#004532] text-[10px] font-bold text-white">{i + 1}</span>
                              <FormField control={donorForm.control} name={`participants.${i}.name`} render={({ field }) => (
                                <FormItem className="flex-1"><FormControl><Input placeholder={`Nama peserta ${i + 1}`} className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:bg-red-50" onClick={() => remove(i)}><X className="size-4" /></Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={closeDialog}>Batal</Button>
                    <Button type="submit" disabled={isSavingDonor}>
                      {isSavingDonor && <Loader2 className="mr-2 size-4 animate-spin" />}
                      {editingDonor ? 'Simpan' : <><span>Lanjut</span><ChevronRight className="ml-1 size-4" /></>}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}

          {/* ── STEP 2: Animal ── */}
          {step === 'animal' && (
            <Form {...animalForm}>
              <form onSubmit={animalForm.handleSubmit(onAnimalSubmit)} className="space-y-4">
                <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <p className="text-xs text-emerald-800">Data donatur berhasil disimpan. Sekarang tambahkan hewan kurban, atau lewati untuk mengisi nanti.</p>
                </div>

                <FormField control={animalForm.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Hewan *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenis hewan" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.entries(ANIMAL_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField control={animalForm.control} name="weight" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berat (kg) *</FormLabel>
                      <FormControl><Input type="number" min={1} placeholder="0" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={animalForm.control} name="estimated_portions" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimasi Porsi</FormLabel>
                      <FormControl><Input type="number" min={1} placeholder="0" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField control={animalForm.control} name="breed" render={({ field }) => (
                    <FormItem><FormLabel>Ras / Jenis</FormLabel><FormControl><Input placeholder="cth: Simmental" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={animalForm.control} name="color" render={({ field }) => (
                    <FormItem><FormLabel>Warna</FormLabel><FormControl><Input placeholder="cth: Hitam putih" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={animalForm.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Catatan tambahan" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
                  <Button type="button" variant="ghost" onClick={skipAnimal} className="text-muted-foreground">Lewati, isi nanti</Button>
                  <Button type="submit" disabled={createAnimal.isPending} className="gap-2">
                    {createAnimal.isPending ? <Loader2 className="size-4 animate-spin" /> : <PawPrint className="size-4" />}
                    Simpan Hewan Kurban
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Donor Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={(open) => !open && setDetailModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="size-4 text-[#004532]" />
              Detail Donatur
            </DialogTitle>
          </DialogHeader>
          {detailModal && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-[#f0fbf4] px-4 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#004532] text-base font-bold text-white">
                  {detailModal.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#191c1e]">{detailModal.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {detailModal.kurban_type === 'patungan'
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-[#004532] px-2 py-0.5 text-[10px] font-bold text-white"><Users className="size-2.5" />Patungan</span>
                      : <span className="inline-flex items-center gap-1 rounded-full border border-[#004532]/20 px-2 py-0.5 text-[10px] font-semibold text-[#004532]"><User className="size-2.5" />Pribadi</span>}
                    <StatusBadge status={detailModal.submission_status} label={DONOR_STATUS_LABELS[detailModal.submission_status]} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Telepon', value: detailModal.phone },
                  { label: 'Email', value: detailModal.email },
                  { label: 'NIK', value: detailModal.nik },
                  { label: 'Hewan', value: `${detailModal.animals_count ?? 0} ekor` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-[#004532]/10 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-medium text-[#191c1e]">{value || '-'}</p>
                  </div>
                ))}
              </div>

              {detailModal.address && (
                <div className="rounded-lg border border-[#004532]/10 px-3 py-2 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Alamat</p>
                  <p className="mt-0.5 text-[#191c1e]">{detailModal.address}</p>
                </div>
              )}

              {detailModal.notes && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Catatan</p>
                  <p className="mt-0.5 text-amber-800">{detailModal.notes}</p>
                </div>
              )}

              {detailModal.kurban_type === 'patungan' && (detailModal.participants?.length ?? 0) > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">Peserta Patungan ({detailModal.participants!.length})</p>
                  <div className="space-y-1.5">
                    {detailModal.participants!.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-[#004532]/10 px-3 py-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#004532] text-[10px] font-bold text-white">{i + 1}</span>
                        <span className="text-sm">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {canEdit && (
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 border-[#004532]/20 text-[#004532]"
                    onClick={() => { setDetailModal(null); openEditDialog(detailModal); }}>
                    <Pencil className="size-3.5" />Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 border-red-200 text-destructive hover:bg-red-50"
                    onClick={() => { setDetailModal(null); setDeleteDonorId(detailModal.id); }}>
                    <Trash2 className="size-3.5" />Hapus
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteDonorId}
        onOpenChange={(open) => !open && setDeleteDonorId(null)}
        title="Hapus Donatur"
        description="Apakah Anda yakin ingin menghapus donatur ini? Data hewan yang terkait juga akan terhapus."
        confirmLabel="Ya, hapus"
        variant="destructive"
        loading={deleteDonor.isPending}
        onConfirm={() => { if (deleteDonorId) deleteDonor.mutate(deleteDonorId); }}
      />

      {/* Participants Modal */}
      <Dialog open={!!participantsModal} onOpenChange={(open) => !open && setParticipantsModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-4 text-[#004532]" />
              Peserta Patungan
            </DialogTitle>
          </DialogHeader>
          {participantsModal && (
            <div className="space-y-3">
              <div className="rounded-xl bg-[#f0fbf4] px-4 py-3">
                <p className="text-xs text-muted-foreground">Penanggung Jawab</p>
                <p className="font-semibold text-[#191c1e]">{participantsModal.name}</p>
                {participantsModal.phone && (
                  <p className="text-xs text-muted-foreground">{participantsModal.phone}</p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#191c1e]">
                  Daftar Peserta ({participantsModal.participants?.length ?? 0} orang)
                </p>
                {(participantsModal.participants?.length ?? 0) === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground italic">
                    Belum ada peserta tercatat
                  </p>
                ) : (
                  <div className="space-y-2">
                    {participantsModal.participants!.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-[#004532]/10 bg-white px-3 py-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#004532] text-[11px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-[#191c1e]">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {canEdit && (
                <div className="pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 border-[#004532]/20 text-[#004532] hover:bg-[#004532]/5"
                    onClick={() => {
                      setParticipantsModal(null);
                      openEditDialog(participantsModal);
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Edit Peserta
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

