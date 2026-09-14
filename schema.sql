-- ============================================================
-- SKEMA LENGKAP SUPABASE / POSTGRESQL UNTUK WEBSITE PORTOFOLIO
-- Sesuai PRD v1.5 Bagian 7 (Database & Storage)
-- ============================================================
-- Panduan Eksekusi:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor"
-- 3. Tempel (Paste) seluruh isi script ini dan klik "Run" (Ctrl+Enter)
-- 4. Buka menu "Authentication" -> "Users" -> "Add User" -> "Create User"
--    untuk membuat akun email & password admin Anda.
-- ============================================================

-- 0. Ekstensi UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PEMBUATAN TABEL UTAMA
-- ============================================================

-- 1.1 Tabel profil (Menyimpan informasi identitas pemilik portofolio)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  description text,
  status text,
  avatar_url text,
  resume_url text,           -- opsional: link Google Drive / PDF
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 1.2 Tabel skills (Keahlian / tools yang dikuasai)
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 1.3 Tabel projects (Karya portofolio)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  link_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 1.4 Tabel experiences (Pengalaman kerja / rekam jejak karier)
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  role text,
  year_start text,
  year_end text,
  location text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 1.5 Tabel courses (Pelatihan, workshop, sertifikasi)
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organizer text,
  year text,
  location text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 1.6 Tabel languages (Kemampuan bahasa)
create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null,       -- contoh: "Native", "Intermediate", "Professional Working"
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 1.7 Tabel contacts (Saluran kontak WhatsApp, Email, Instagram, LinkedIn)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  type text not null,        -- 'whatsapp' | 'email' | 'instagram' | 'linkedin'
  value text not null,       -- nomor telepon / alamat email / URL profil
  created_at timestamptz default now()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS) UNTUK TABEL
-- ============================================================
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.courses enable row level security;
alter table public.languages enable row level security;
alter table public.contacts enable row level security;

-- 2.1 Kebijakan SELECT Publik (Pengunjung umum dapat melihat data tanpa login)
drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles for select using (true);

drop policy if exists "Public can view skills" on public.skills;
create policy "Public can view skills" on public.skills for select using (true);

drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects" on public.projects for select using (true);

drop policy if exists "Public can view experiences" on public.experiences;
create policy "Public can view experiences" on public.experiences for select using (true);

drop policy if exists "Public can view courses" on public.courses;
create policy "Public can view courses" on public.courses for select using (true);

drop policy if exists "Public can view languages" on public.languages;
create policy "Public can view languages" on public.languages for select using (true);

drop policy if exists "Public can view contacts" on public.contacts;
create policy "Public can view contacts" on public.contacts for select using (true);

-- 2.2 Kebijakan Pengelolaan Admin (Hanya pengguna terotentikasi Supabase Auth yang dapat insert, update, delete)
drop policy if exists "Authenticated can manage profiles" on public.profiles;
create policy "Authenticated can manage profiles" on public.profiles for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage skills" on public.skills;
create policy "Authenticated can manage skills" on public.skills for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage projects" on public.projects;
create policy "Authenticated can manage projects" on public.projects for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage experiences" on public.experiences;
create policy "Authenticated can manage experiences" on public.experiences for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage courses" on public.courses;
create policy "Authenticated can manage courses" on public.courses for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage languages" on public.languages;
create policy "Authenticated can manage languages" on public.languages for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage contacts" on public.contacts;
create policy "Authenticated can manage contacts" on public.contacts for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 3. SUPABASE STORAGE BUCKETS (avatars & projects)
-- ============================================================

-- 3.1 Buat bucket storage publik jika belum ada
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('projects', 'projects', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 3.2 Storage RLS Policies
-- Bucket 'avatars': publik dapat membaca/melihat gambar
drop policy if exists "Public Access to Avatars" on storage.objects;
create policy "Public Access to Avatars" on storage.objects
  for select using (bucket_id = 'avatars');

-- Bucket 'avatars': admin terotentikasi dapat upload, ubah, dan hapus
drop policy if exists "Authenticated users can upload avatars" on storage.objects;
create policy "Authenticated users can upload avatars" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update avatars" on storage.objects;
create policy "Authenticated users can update avatars" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete avatars" on storage.objects;
create policy "Authenticated users can delete avatars" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Bucket 'projects': publik dapat membaca/melihat gambar
drop policy if exists "Public Access to Projects" on storage.objects;
create policy "Public Access to Projects" on storage.objects
  for select using (bucket_id = 'projects');

-- Bucket 'projects': admin terotentikasi dapat upload, ubah, dan hapus
drop policy if exists "Authenticated users can upload projects" on storage.objects;
create policy "Authenticated users can upload projects" on storage.objects
  for insert with check (bucket_id = 'projects' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update projects" on storage.objects;
create policy "Authenticated users can update projects" on storage.objects
  for update using (bucket_id = 'projects' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete projects" on storage.objects;
create policy "Authenticated users can delete projects" on storage.objects
  for delete using (bucket_id = 'projects' and auth.role() = 'authenticated');

-- ============================================================
-- 4. INITIAL SEED DATA (DATA AWAL PORTOFOLIO)
-- Data ini hanya di-insert jika tabel masih kosong (idempotent)
-- ============================================================

-- 4.1 Seed Profil
insert into public.profiles (name, tagline, description, status, avatar_url, resume_url)
select 
  'Rania Maharani',
  'Graphic Designer & Visual Storyteller',
  'Desainer visual dengan pengalaman lebih dari 4 tahun dalam branding, ilustrasi editorial, dan strategi konten kreatif. Membantu brand dan individu mengomunikasikan pesan mereka secara berdampak dan autentik.',
  'Terbuka untuk Kolaborasi',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://drive.google.com/file/d/sample-resume/view'
where not exists (select 1 from public.profiles limit 1);

-- 4.2 Seed Skills
insert into public.skills (name, sort_order)
select s.name, s.sort_order from (values
  ('Canva', 1),
  ('Adobe Illustrator', 2),
  ('Adobe Photoshop', 3),
  ('Figma', 4),
  ('Visual Storytelling', 5),
  ('Brand Identity', 6),
  ('Social Media Design', 7),
  ('Copywriting', 8),
  ('Public Speaking', 9)
) as s(name, sort_order)
where not exists (select 1 from public.skills limit 1);

-- 4.3 Seed Projects
insert into public.projects (title, description, image_url, link_url, sort_order)
select p.title, p.description, p.image_url, p.link_url, p.sort_order from (values
  ('Nusantara Heritage Brand Identity', 'Perancangan identitas visual lengkap dan panduan merek untuk kolektif seni budaya nusantara, mencakup logo, tipografi, dan packaging ramah lingkungan.', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/drive/folders/sample-heritage', 1),
  ('Editorial Campaign: Cerita Rempah', 'Seri ilustrasi dan materi promosi kampanye digital untuk festival kuliner rempah tradisional dengan lebih dari 50.000 jangkauan audiens.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/drive/folders/sample-rempah', 2),
  ('Digital Content Pack for EduTech Startup', 'Pembuatan 40+ aset visual edukatif, infografis media sosial, dan template presentasi pitch deck untuk pendanaan tahap awal.', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80', 'https://drive.google.com/drive/folders/sample-edutech', 3)
) as p(title, description, image_url, link_url, sort_order)
where not exists (select 1 from public.projects limit 1);

-- 4.4 Seed Experiences
insert into public.experiences (institution, role, year_start, year_end, location, description, sort_order)
select e.institution, e.role, e.year_start, e.year_end, e.location, e.description, e.sort_order from (values
  ('Studio Imaji Kreasi', 'Senior Visual Designer & Content Lead', '2023', 'Sekarang', 'Jakarta Selatan, Indonesia', 'Memimpin perancangan strategi visual untuk lebih dari 15 klien korporat dan UMKM, serta mengarahkan tim desainer junior dalam eksekusi kampanye multi-channel.', 1),
  ('Kreatifa Media Group', 'Brand & Graphic Designer', '2021', '2023', 'Bandung, Indonesia', 'Merancang aset visual publikasi berkala, materi promosi event nasional, dan berkolaborasi erat dengan tim editorial serta pemasaran digital.', 2)
) as e(institution, role, year_start, year_end, location, description, sort_order)
where not exists (select 1 from public.experiences limit 1);

-- 4.5 Seed Courses
insert into public.courses (name, organizer, year, location, description, sort_order)
select c.name, c.organizer, c.year, c.location, c.description, c.sort_order from (values
  ('Mastering Brand Identity & Visual Systems', 'Design Academy Asia', '2023', 'Online', 'Pelatihan intensif 8 minggu mengenai metodologi perancangan visual identity, brand guideline, dan strategi adaptasi lintas media.', 1),
  ('Advanced Editorial Illustration & Layout', 'Institut Seni Visual', '2022', 'Jakarta', 'Workshop komprehensif eksplorasi tipografi editorial dan komposisi visual untuk publikasi cetak dan digital.', 2)
) as c(name, organizer, year, location, description, sort_order)
where not exists (select 1 from public.courses limit 1);

-- 4.6 Seed Languages
insert into public.languages (name, level, sort_order)
select l.name, l.level, l.sort_order from (values
  ('Bahasa Indonesia', 'Native', 1),
  ('Bahasa Inggris', 'Professional Working', 2)
) as l(name, level, sort_order)
where not exists (select 1 from public.languages limit 1);

-- 4.7 Seed Contacts
insert into public.contacts (type, value)
select ct.type, ct.value from (values
  ('whatsapp', '6281234567890'),
  ('email', 'rania.designer@example.com'),
  ('instagram', 'https://instagram.com/raniadesign'),
  ('linkedin', 'https://linkedin.com/in/raniamaharani')
) as ct(type, value)
where not exists (select 1 from public.contacts limit 1);
