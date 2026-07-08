import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Lock, Settings, SlidersHorizontal, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useApi from '../../hooks/useApi';
import useModuleSettings from '../../hooks/useModuleSettings';

const toIdSet = (ids = []) => new Set(ids.map((id) => String(id)));

const getResourceImage = (item) => item.thumbnail || item.ogImage || item.seo?.ogImage || '';
const getCaseStudyImage = (item) => item.coverImage || item.imageUrl || '';

const ToggleSwitch = ({ enabled, saving, onToggle, label }) => (
  <button
    type="button"
    disabled={saving}
    onClick={onToggle}
    className={`relative h-9 w-16 rounded-full border transition-all disabled:opacity-60 ${
      enabled ? 'border-accent-green/40 bg-accent-green/25' : 'border-red-400/30 bg-red-500/10'
    }`}
    aria-label={label}
  >
    <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-lg transition-all ${enabled ? 'left-8' : 'left-1'}`} />
  </button>
);

const ContentRow = ({ icon, image, title, meta, enabled, saving, onToggle }) => (
  <div className={`rounded-2xl border p-4 transition-all ${enabled ? 'border-border-subtle bg-bg-card' : 'border-red-400/25 bg-red-500/5'}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-4">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated">
          {image ? (
            <img src={image} alt={title} className={`h-full w-full object-cover ${enabled ? '' : 'blur-[1px] grayscale'}`} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted">{icon}</div>
          )}
          {!enabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/35">
              <Lock size={18} className="text-accent-blue" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold text-text-primary">{title}</h3>
          <p className="mt-1 text-sm text-text-muted">{meta}</p>
          <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
            enabled ? 'bg-accent-green/10 text-accent-green' : 'bg-red-500/10 text-red-400'
          }`}>
            {enabled ? <Unlock size={11} /> : <Lock size={11} />}
            {enabled ? 'Public' : 'Locked'}
          </span>
        </div>
      </div>
      <ToggleSwitch enabled={enabled} saving={saving} onToggle={onToggle} label={`Toggle ${title}`} />
    </div>
  </div>
);

const ControllerSection = ({ icon, title, description, items, lockedIds, savingId, emptyText, getImage, getMeta, onToggle }) => {
  const lockedSet = useMemo(() => toIdSet(lockedIds), [lockedIds]);

  return (
    <section className="rounded-[2rem] border border-border-subtle bg-bg-card/85 p-5 shadow-card md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-blue/20 bg-accent-blue/10 text-accent-blue">
            {icon}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">{description}</p>
          </div>
        </div>
        <span className="rounded-full border border-border-subtle bg-bg-primary/70 px-3 py-1.5 text-xs font-mono text-text-muted">
          {lockedSet.size} locked / {items.length} total
        </span>
      </div>

      <div className="grid gap-3">
        {items.length ? (
          items.map((item) => {
            const id = String(item._id);
            const locked = lockedSet.has(id);
            return (
              <ContentRow
                key={id}
                icon={icon}
                image={getImage(item)}
                title={item.title}
                meta={getMeta(item)}
                enabled={!locked}
                saving={savingId === id}
                onToggle={() => onToggle(id)}
              />
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-primary/50 p-8 text-center text-text-muted">
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
};

const ManageSettings = () => {
  const { settings, loading } = useModuleSettings();
  const { data: resources = [], loading: resourcesLoading } = useApi('/api/resources', []);
  const { data: caseStudies = [], loading: caseStudiesLoading } = useApi('/api/case-studies/admin/all', []);
  const [localSettings, setLocalSettings] = useState(settings);
  const [savingId, setSavingId] = useState(null);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateLockedIds = async (key, id) => {
    const currentIds = localSettings[key] || [];
    const exists = currentIds.map(String).includes(String(id));
    const nextIds = exists ? currentIds.filter((item) => String(item) !== String(id)) : [...currentIds, id];
    const nextSettings = { ...localSettings, [key]: nextIds };

    setLocalSettings(nextSettings);
    setSavingId(id);

    try {
      const { data } = await api.put('/api/module-settings', nextSettings);
      setLocalSettings(data);
      toast.success(exists ? 'Item is public now' : 'Item locked successfully');
    } catch (error) {
      setLocalSettings(localSettings);
      toast.error(error.response?.data?.message || 'Failed to update controller');
    } finally {
      setSavingId(null);
    }
  };

  const sortedResources = useMemo(() => [...resources].sort((a, b) => a.title.localeCompare(b.title)), [resources]);
  const sortedCaseStudies = useMemo(() => [...caseStudies].sort((a, b) => a.title.localeCompare(b.title)), [caseStudies]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-8">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/10 px-4 py-2 text-xs font-mono uppercase tracking-widest text-accent-blue">
          <Settings size={14} /> Settings
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-text-primary">Settings</h1>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-sm font-bold text-accent-blue">
            <SlidersHorizontal size={16} /> Controller
          </button>
        </div>
        <p className="mt-2 max-w-3xl text-text-secondary">
          Control individual public items. Locked cards stay visible with blur and lock state, but their detail page will not open.
        </p>
      </div>

      <section className="rounded-[2rem] border border-border-subtle bg-bg-card/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
            <SlidersHorizontal size={20} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary">Item Controller</h2>
            <p className="text-sm text-text-muted">
              {loading || resourcesLoading || caseStudiesLoading ? 'Loading current controls...' : 'Public item visibility is synced with backend settings.'}
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <ControllerSection
            icon={<Download size={20} />}
            title="Resources"
            description="Toggle specific resources on or off without affecting the full Resources module."
            items={sortedResources}
            lockedIds={localSettings.lockedResourceIds}
            savingId={savingId}
            emptyText="No resources found."
            getImage={getResourceImage}
            getMeta={(item) => `${item.category || 'Resource'} - ${item.difficulty || 'Beginner'} - ${item.slug || item._id}`}
            onToggle={(id) => updateLockedIds('lockedResourceIds', id)}
          />
          <ControllerSection
            icon={<BookOpen size={20} />}
            title="Case Studies"
            description="Toggle specific case studies on or off without affecting the full Case Studies module."
            items={sortedCaseStudies}
            lockedIds={localSettings.lockedCaseStudyIds}
            savingId={savingId}
            emptyText="No case studies found."
            getImage={getCaseStudyImage}
            getMeta={(item) => `${item.industry || item.category || 'Case Study'} - ${item.status || 'Published'} - ${item.slug || item._id}`}
            onToggle={(id) => updateLockedIds('lockedCaseStudyIds', id)}
          />
        </div>
      </section>
    </motion.div>
  );
};

export default ManageSettings;
