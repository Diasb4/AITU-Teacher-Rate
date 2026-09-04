import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Radio, 
  RefreshCw, 
  Trash2,
  ExternalLink,
  Code
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection 
} from '../../services/supabase';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  if (!isOpen) return null;

  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.key);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const conf = getSupabaseConfig();
    setUrl(conf.url);
    setAnonKey(conf.key);
    setTestResult(null);
  }, [isOpen]);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(url, anonKey);
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = async () => {
    saveSupabaseConfig(url, anonKey);
    onConfigUpdated();
    onClose();
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onConfigUpdated();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Синхронизация с Supabase (Free Tier)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Бесплатная база данных PostgreSQL и Realtime обновления между студентами
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Подключение и статус</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'sql'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SQL Скрипт базы данных</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {activeTab === 'config' ? (
            <>
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3.5">
                <div className="mt-0.5">
                  {currentConfig.isConfigured ? (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {currentConfig.isConfigured ? '🟢 Подключено к облаку Supabase' : '🟡 Автономный режим (LocalStorage)'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {currentConfig.isConfigured
                      ? 'Все новые отзывы и рейтинги сохраняются в вашей базе данных Supabase и мгновенно синхронизируются со всеми студентами через WebSockets.'
                      : 'Отзывы сейчас сохраняются локально в вашем браузере. Подключите бесплатный проект Supabase, чтобы ваши отзывы стали доступны всем студентам AITU!'}
                  </p>
                </div>
              </div>

              {/* Free Tier Info */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-black text-slate-900 dark:text-white">500 MB</div>
                  <div className="text-[10px] text-slate-500">PostgreSQL база</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-black text-slate-900 dark:text-white">Realtime</div>
                  <div className="text-[10px] text-slate-500">Мгновенный пуш отзывов</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-black text-emerald-500">0 ₸ / $0</div>
                  <div className="text-[10px] text-slate-500">Бесплатный тариф</div>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://xyzabcdefg.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={e => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Используется публичный ключ <code className="text-emerald-500 font-bold">anon</code>. Не используйте <code className="text-rose-500">service_role</code> ключ!
                  </p>
                </div>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.success 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={testing || !url.trim() || !anonKey.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Проверка...' : 'Проверить соединение'}</span>
                  </button>

                  {currentConfig.isConfigured && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Очистить и вернуться в локальный режим"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!url.trim() || !anonKey.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Сохранить и подключить</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  SQL для Supabase SQL Editor:
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Скопировано!' : 'Скопировать SQL'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono max-h-72 overflow-y-auto border border-slate-800 whitespace-pre">
                {SUPABASE_SQL_SCRIPT}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-white">Инструкция за 30 секунд:</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Зайдите на <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline">supabase.com</a> и создайте бесплатный проект.</li>
                  <li>Откройте вкладку <b>SQL Editor</b> слева, нажмите <b>New query</b>, вставьте код выше и нажмите <b>Run</b>.</li>
                  <li>Перейдите в <b>Project Settings → API</b>, скопируйте <i>URL</i> и <i>anon public key</i> и вставьте во вкладку "Подключение".</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SUPABASE_SQL_SCRIPT = `-- 1. Таблица отзывов от студентов
create table if not exists public.reviews (
    id text primary key,
    professor_id text not null,
    author text not null default 'Студент AITU',
    rating numeric not null check (rating >= 1 and rating <= 5),
    proctoring numeric not null check (proctoring >= 1 and proctoring <= 5),
    discipline text not null default 'Общая дисциплина',
    grade text not null default 'A',
    tags text[] not null default array[]::text[],
    text text not null check (length(text) >= 2 and length(text) <= 4000),
    likes integer not null default 1,
    created_at timestamp with time zone not null default now()
);

create index if not exists idx_reviews_professor_id on public.reviews (professor_id);
create index if not exists idx_reviews_created_at on public.reviews (created_at desc);

-- 2. Таблица преподавателей, добавленных студентами
create table if not exists public.suggested_professors (
    id text primary key,
    name text not null check (length(name) >= 3),
    department text not null,
    disciplines text[] not null default array[]::text[],
    initials text not null,
    avatar_bg text not null default '#E11D48',
    suggested_by text not null default 'Студент AITU',
    created_at timestamp with time zone not null default now()
);

-- 3. Политики безопасности RLS (Row Level Security)
alter table public.reviews enable row level security;
alter table public.suggested_professors enable row level security;

create policy "Public reviews are readable by everyone" 
on public.reviews for select using (true);

create policy "Anyone can insert reviews" 
on public.reviews for insert 
with check (length(text) >= 2 and length(text) <= 4000 and rating >= 1 and rating <= 5);

create policy "Anyone can update likes" 
on public.reviews for update using (true) with check (true);

create policy "Public suggested professors are readable" 
on public.suggested_professors for select using (true);

create policy "Anyone can suggest a professor" 
on public.suggested_professors for insert 
with check (length(name) >= 3);

-- 4. Включение Realtime WebSockets
do $$
begin
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        alter publication supabase_realtime add table public.reviews;
        alter publication supabase_realtime add table public.suggested_professors;
    end if;
exception when duplicate_object then null;
end $$;`;
