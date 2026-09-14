import {
  Profile,
  Skill,
  Project,
  Experience,
  Course,
  Language,
  Contact,
  PortfolioData,
  AdminUser,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_PORTFOLIO = 'portfolio_data_v1';
const STORAGE_KEY_SESSION = 'portfolio_admin_session';

const INITIAL_DATA: PortfolioData = {
  profile: {
    id: 'profile-primary',
    name: 'Rania Maharani',
    tagline: 'Graphic Designer & Visual Storyteller',
    description:
      'Desainer visual dengan pengalaman lebih dari 4 tahun dalam branding, ilustrasi editorial, dan strategi konten kreatif. Membantu brand dan individu mengomunikasikan pesan mereka secara berdampak dan autentik.',
    status: 'Terbuka untuk Kolaborasi',
    avatar_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    resume_url: 'https://drive.google.com/file/d/sample-resume/view',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  skills: [
    { id: 'sk-1', name: 'Canva', sort_order: 1 },
    { id: 'sk-2', name: 'Adobe Illustrator', sort_order: 2 },
    { id: 'sk-3', name: 'Adobe Photoshop', sort_order: 3 },
    { id: 'sk-4', name: 'Figma', sort_order: 4 },
    { id: 'sk-5', name: 'Visual Storytelling', sort_order: 5 },
    { id: 'sk-6', name: 'Brand Identity', sort_order: 6 },
    { id: 'sk-7', name: 'Social Media Design', sort_order: 7 },
    { id: 'sk-8', name: 'Copywriting', sort_order: 8 },
    { id: 'sk-9', name: 'Public Speaking', sort_order: 9 },
  ],
  projects: [
    {
      id: 'pj-1',
      title: 'Nusantara Heritage Brand Identity',
      description:
        'Perancangan identitas visual lengkap dan panduan merek untuk kolektif seni budaya nusantara, mencakup logo, tipografi, dan packaging ramah lingkungan.',
      image_url:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      link_url: 'https://drive.google.com/drive/folders/sample-heritage',
      sort_order: 1,
    },
    {
      id: 'pj-2',
      title: 'Editorial Campaign: Cerita Rempah',
      description:
        'Seri ilustrasi dan materi promosi kampanye digital untuk festival kuliner rempah tradisional dengan lebih dari 50.000 jangkauan audiens.',
      image_url:
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      link_url: 'https://drive.google.com/drive/folders/sample-rempah',
      sort_order: 2,
    },
    {
      id: 'pj-3',
      title: 'Digital Content Pack for EduTech Startup',
      description:
        'Pembuatan 40+ aset visual edukatif, infografis media sosial, dan template presentasi pitch deck untuk pendanaan tahap awal.',
      image_url:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      link_url: 'https://drive.google.com/drive/folders/sample-edutech',
      sort_order: 3,
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      institution: 'Studio Imaji Kreasi',
      role: 'Senior Visual Designer & Content Lead',
      year_start: '2023',
      year_end: 'Sekarang',
      location: 'Jakarta Selatan, Indonesia',
      description:
        'Memimpin perancangan strategi visual untuk lebih dari 15 klien korporat dan UMKM, serta mengarahkan tim desainer junior dalam eksekusi kampanye multi-channel.',
      sort_order: 1,
    },
    {
      id: 'exp-2',
      institution: 'Kreatifa Media Group',
      role: 'Brand & Graphic Designer',
      year_start: '2021',
      year_end: '2023',
      location: 'Bandung, Indonesia',
      description:
        'Merancang aset visual publikasi berkala, materi promosi event nasional, dan berkolaborasi erat dengan tim editorial serta pemasaran digital.',
      sort_order: 2,
    },
  ],
  courses: [
    {
      id: 'crs-1',
      name: 'Mastering Brand Identity & Visual Systems',
      organizer: 'Creative Hub Asia',
      year: '2024',
      location: 'Online',
      description:
        'Pelatihan intensif 8 pekan tentang perancangan sistem identitas merek modular, arsitektur visual, dan penerapan panduan brand komprehensif.',
      sort_order: 1,
    },
    {
      id: 'crs-2',
      name: 'Certified Design Thinking & Creative Problem Solving',
      organizer: 'Inovasi Desain Indonesia',
      year: '2022',
      location: 'Jakarta',
      description:
        'Sertifikasi metodologi pemecahan masalah kreatif berbasis empati pengguna untuk kampanye sosial dan desain produk.',
      sort_order: 2,
    },
  ],
  languages: [
    { id: 'lang-1', name: 'Bahasa Indonesia', level: 'Native', sort_order: 1 },
    {
      id: 'lang-2',
      name: 'Bahasa Inggris',
      level: 'Professional Working / Fluent',
      sort_order: 2,
    },
  ],
  contacts: [
    { id: 'cnt-1', type: 'whatsapp', value: '6281234567890' },
    { id: 'cnt-2', type: 'email', value: 'rania.maharani@example.com' },
    { id: 'cnt-3', type: 'instagram', value: 'https://instagram.com/rania.visual' },
    { id: 'cnt-4', type: 'linkedin', value: 'https://linkedin.com/in/rania-maharani' },
  ],
};

function getLocalData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage portfolio data:', err);
    return INITIAL_DATA;
  }
}

function saveLocalData(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving localStorage portfolio data:', err);
  }
}

export const portfolioService = {
  async getPortfolioData(): Promise<PortfolioData> {
    if (isSupabaseConfigured && supabase) {
      try {
        const [
          profileRes,
          skillsRes,
          projectsRes,
          experiencesRes,
          coursesRes,
          languagesRes,
          contactsRes,
        ] = await Promise.all([
          supabase.from('profiles').select('*').limit(1).maybeSingle(),
          supabase.from('skills').select('*').order('sort_order', { ascending: true }),
          supabase.from('projects').select('*').order('sort_order', { ascending: true }),
          supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
          supabase.from('courses').select('*').order('sort_order', { ascending: true }),
          supabase.from('languages').select('*').order('sort_order', { ascending: true }),
          supabase.from('contacts').select('*'),
        ]);

        const local = getLocalData();
        return {
          profile: profileRes.data || local.profile,
          skills: skillsRes.data && skillsRes.data.length > 0 ? skillsRes.data : local.skills,
          projects:
            projectsRes.data && projectsRes.data.length > 0 ? projectsRes.data : local.projects,
          experiences:
            experiencesRes.data && experiencesRes.data.length > 0
              ? experiencesRes.data
              : local.experiences,
          courses:
            coursesRes.data && coursesRes.data.length > 0 ? coursesRes.data : local.courses,
          languages:
            languagesRes.data && languagesRes.data.length > 0
              ? languagesRes.data
              : local.languages,
          contacts:
            contactsRes.data && contactsRes.data.length > 0 ? contactsRes.data : local.contacts,
        };
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
        return getLocalData();
      }
    }
    return getLocalData();
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = { ...updates, updated_at: new Date().toISOString() };
        let result;
        if (updates.id && updates.id !== 'profile-primary') {
          result = await supabase
            .from('profiles')
            .update(payload)
            .eq('id', updates.id)
            .select()
            .single();
        } else {
          // If no specific UUID, target the existing profile row or insert
          const existing = await supabase.from('profiles').select('id').limit(1).maybeSingle();
          if (existing.data?.id) {
            result = await supabase
              .from('profiles')
              .update(payload)
              .eq('id', existing.data.id)
              .select()
              .single();
          } else {
            const { id: _ignore, ...insertPayload } = payload;
            result = await supabase.from('profiles').insert([insertPayload]).select().single();
          }
        }
        if (!result.error && result.data) return result.data;
      } catch (err) {
        console.warn('Supabase updateProfile error:', err);
      }
    }

    const current = getLocalData();
    const updated: Profile = {
      ...current.profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    current.profile = updated;
    saveLocalData(current);
    return updated;
  },

  async addSkill(name: string): Promise<Skill> {
    const current = getLocalData();
    const newSkill: Skill = {
      id: 'sk-' + Date.now(),
      name: name.trim(),
      sort_order: current.skills.length + 1,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .insert([{ name: newSkill.name, sort_order: newSkill.sort_order }])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addSkill error:', err);
      }
    }

    current.skills.push(newSkill);
    saveLocalData(current);
    return newSkill;
  },

  async updateSkill(id: string, name: string): Promise<Skill> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .update({ name: name.trim() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateSkill error:', err);
      }
    }

    const current = getLocalData();
    const idx = current.skills.findIndex((s) => s.id === id);
    if (idx !== -1) {
      current.skills[idx].name = name.trim();
      saveLocalData(current);
      return current.skills[idx];
    }
    throw new Error('Skill not found');
  },

  async deleteSkill(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteSkill error:', err);
      }
    }
    const current = getLocalData();
    current.skills = current.skills.filter((s) => s.id !== id);
    saveLocalData(current);
  },

  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const current = getLocalData();
    const newProj: Project = {
      ...project,
      id: 'pj-' + Date.now(),
      sort_order: project.sort_order || current.projects.length + 1,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([project])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addProject error:', err);
      }
    }

    current.projects.push(newProj);
    saveLocalData(current);
    return newProj;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateProject error:', err);
      }
    }

    const current = getLocalData();
    const idx = current.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      current.projects[idx] = { ...current.projects[idx], ...updates };
      saveLocalData(current);
      return current.projects[idx];
    }
    throw new Error('Project not found');
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteProject error:', err);
      }
    }
    const current = getLocalData();
    current.projects = current.projects.filter((p) => p.id !== id);
    saveLocalData(current);
  },

  async addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const current = getLocalData();
    const newExp: Experience = {
      ...exp,
      id: 'exp-' + Date.now(),
      sort_order: exp.sort_order || current.experiences.length + 1,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .insert([exp])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addExperience error:', err);
      }
    }

    current.experiences.push(newExp);
    saveLocalData(current);
    return newExp;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateExperience error:', err);
      }
    }

    const current = getLocalData();
    const idx = current.experiences.findIndex((e) => e.id === id);
    if (idx !== -1) {
      current.experiences[idx] = { ...current.experiences[idx], ...updates };
      saveLocalData(current);
      return current.experiences[idx];
    }
    throw new Error('Experience not found');
  },

  async deleteExperience(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('experiences').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteExperience error:', err);
      }
    }
    const current = getLocalData();
    current.experiences = current.experiences.filter((e) => e.id !== id);
    saveLocalData(current);
  },

  async addCourse(crs: Omit<Course, 'id'>): Promise<Course> {
    const current = getLocalData();
    const newCourse: Course = {
      ...crs,
      id: 'crs-' + Date.now(),
      sort_order: crs.sort_order || current.courses.length + 1,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .insert([crs])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addCourse error:', err);
      }
    }

    current.courses.push(newCourse);
    saveLocalData(current);
    return newCourse;
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateCourse error:', err);
      }
    }

    const current = getLocalData();
    const idx = current.courses.findIndex((c) => c.id === id);
    if (idx !== -1) {
      current.courses[idx] = { ...current.courses[idx], ...updates };
      saveLocalData(current);
      return current.courses[idx];
    }
    throw new Error('Course not found');
  },

  async deleteCourse(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCourse error:', err);
      }
    }
    const current = getLocalData();
    current.courses = current.courses.filter((c) => c.id !== id);
    saveLocalData(current);
  },

  async addLanguage(lang: Omit<Language, 'id'>): Promise<Language> {
    const current = getLocalData();
    const newLang: Language = {
      ...lang,
      id: 'lang-' + Date.now(),
      sort_order: lang.sort_order || current.languages.length + 1,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('languages')
          .insert([lang])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addLanguage error:', err);
      }
    }

    current.languages.push(newLang);
    saveLocalData(current);
    return newLang;
  },

  async updateLanguage(id: string, updates: Partial<Language>): Promise<Language> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('languages')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateLanguage error:', err);
      }
    }

    const current = getLocalData();
    const idx = current.languages.findIndex((l) => l.id === id);
    if (idx !== -1) {
      current.languages[idx] = { ...current.languages[idx], ...updates };
      saveLocalData(current);
      return current.languages[idx];
    }
    throw new Error('Language not found');
  },

  async deleteLanguage(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('languages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteLanguage error:', err);
      }
    }
    const current = getLocalData();
    current.languages = current.languages.filter((l) => l.id !== id);
    saveLocalData(current);
  },

  async addContact(cnt: Omit<Contact, 'id'>): Promise<Contact> {
    const current = getLocalData();
    const newContact: Contact = {
      ...cnt,
      id: 'cnt-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .insert([cnt])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addContact error:', err);
      }
    }

    current.contacts.push(newContact);
    saveLocalData(current);
    return newContact;
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateContact error:', err);
      }
    }

    const current = getLocalData();
    const idx = current.contacts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      current.contacts[idx] = { ...current.contacts[idx], ...updates };
      saveLocalData(current);
      return current.contacts[idx];
    }
    throw new Error('Contact not found');
  },

  async deleteContact(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contacts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteContact error:', err);
      }
    }
    const current = getLocalData();
    current.contacts = current.contacts.filter((c) => c.id !== id);
    saveLocalData(current);
  },

  async uploadImage(file: File, bucket: 'avatars' | 'projects'): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
      } catch (err) {
        console.warn('Supabase storage upload failed, using data URL fallback:', err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  async loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
          };
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(adminUser));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login gagal ke Supabase Auth' };
      }
    }

    // In local / preview mode when Supabase is not connected yet or for admin management:
    if (!email || !password) {
      return { success: false, error: 'Email dan password wajib diisi' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password minimal 6 karakter' };
    }

    const adminUser: AdminUser = {
      id: 'admin-' + Date.now(),
      email: email.trim(),
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(adminUser));
    return { success: true };
  },

  logoutAdmin(): void {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  getAdminSession(): AdminUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  resetToDefault(): PortfolioData {
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  },
};
