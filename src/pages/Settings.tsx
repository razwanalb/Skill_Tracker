import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Edit2, Check, X, Globe } from 'lucide-react';
import { formatTimeSlot } from '../lib/dateUtils';

export function Settings() {
  const { 
    columns, templateTasks, quotes, timezone, baseTimezone,
    addColumn, removeColumn, renameColumn, 
    addTimeSlot, removeTimeSlot, 
    addQuote, removeQuote, setTimezone 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'routine' | 'quotes'>('routine');

  const [newColName, setNewColName] = useState('');
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editColName, setEditColName] = useState('');

  const [newTime, setNewTime] = useState('');
  const [newHours, setNewHours] = useState('1');

  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');

  const availableTimezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch (e) {
      return [timezone, 'UTC']; // Fallback for extremely old browsers
    }
  }, [timezone]);

  const handleAddCol = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColName.trim()) {
      addColumn(newColName.trim());
      setNewColName('');
    }
  };

  const handleSaveEdit = (id: string) => {
    if (editColName.trim()) {
      renameColumn(id, editColName.trim());
    }
    setEditingColId(null);
  };

  const handleAddTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime.trim() && !isNaN(Number(newHours))) {
      addTimeSlot(newTime.trim(), Number(newHours));
      setNewTime('');
      setNewHours('1');
    }
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuoteText.trim()) {
      addQuote(newQuoteText.trim(), newQuoteAuthor.trim());
      setNewQuoteText('');
      setNewQuoteAuthor('');
    }
  };

  return (
    <div className="max-w-4xl w-full pb-8">
      <header className="mb-6">
        <h1 className="text-[24px] font-bold text-ink mb-1">Settings</h1>
        <p className="text-[14px] text-muted">Manage your routine and personal preferences</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-line mb-8">
        <button
          onClick={() => setActiveTab('routine')}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === 'routine' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Routine Structure
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === 'quotes' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Inspiration Quotes
        </button>
      </div>

      {activeTab === 'routine' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Timezone Configuration */}
          <section className="bg-card rounded-xl shadow-sm border border-line overflow-hidden">
            <div className="p-6 border-b border-line bg-surface/50">
              <h2 className="text-[15px] font-semibold text-ink flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted" /> Time Zone
              </h2>
              <p className="text-[13px] text-muted mt-1">Select your local time zone to display schedules accurately.</p>
            </div>
            <div className="p-6">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full max-w-sm px-3 py-2 rounded-md bg-surface border border-line outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] transition-all cursor-pointer"
              >
                {availableTimezones.map(tz => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                ))}
              </select>
              {timezone !== baseTimezone && (
                <p className="text-[12px] text-muted mt-2">
                  Showing times converted from standard schedule base ({baseTimezone}).
                </p>
              )}
            </div>
          </section>

          {/* Columns configuration */}
          <section className="bg-card rounded-xl shadow-sm border border-line overflow-hidden">
            <div className="p-6 border-b border-line bg-surface/50">
              <h2 className="text-[15px] font-semibold text-ink">Routine Columns (Skills)</h2>
              <p className="text-[13px] text-muted mt-1">Add or edit the skills you want to track daily.</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddCol} className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g. GitHub, Reading, Workout"
                  className="w-64 px-3 py-2 rounded-md bg-surface border border-line outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] transition-all"
                />
                <button type="submit" className="bg-ink hover:bg-ink/80 text-surface px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-[13px] font-medium">
                  <Plus className="w-4 h-4" /> Add Column
                </button>
              </form>

              <div className="border border-line rounded-lg overflow-hidden bg-surface divide-y divide-line">
                {columns.map(col => (
                  <div key={col.id} className="flex items-center justify-between p-3 px-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    {editingColId === col.id ? (
                      <div className="flex items-center gap-2 flex-1 max-w-sm">
                        <input
                          autoFocus
                          value={editColName}
                          onChange={(e) => setEditColName(e.target.value)}
                          className="flex-1 px-2 py-1 text-[13px] rounded bg-card border border-primary outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button onClick={() => handleSaveEdit(col.id)} className="text-success p-1.5 hover:bg-success/10 rounded transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingColId(null)} className="text-muted p-1.5 hover:bg-line rounded transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-ink text-[13px] flex-1 truncate">{col.name}</span>
                        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingColId(col.id); setEditColName(col.name); }} className="p-1.5 text-muted hover:text-primary rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeColumn(col.id)} className="p-1.5 text-muted hover:text-error rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {columns.length === 0 && (
                  <div className="text-center p-6 text-muted text-[13px]">
                    No columns configured yet.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Routine Default Schedule */}
          <section className="bg-card rounded-xl shadow-sm border border-line overflow-hidden">
            <div className="p-6 border-b border-line bg-surface/50">
              <h2 className="text-[15px] font-semibold text-ink">Default Schedule</h2>
              <p className="text-[13px] text-muted mt-1">Time blocks applied to new days. Changes don't affect history.</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddTime} className="flex gap-3 mb-6">
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="w-32 px-3 py-2 rounded-md bg-surface border border-line outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] transition-all"
                />
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.5"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  placeholder="Duration"
                  className="w-24 px-3 py-2 rounded-md bg-surface border border-line outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] transition-all"
                />
                <button type="submit" className="bg-ink hover:bg-ink/80 text-surface px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-[13px] font-medium">
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </form>

              <div className="border border-line rounded-lg overflow-hidden bg-surface divide-y divide-line">
                {templateTasks.map((task, i) => (
                  <div key={task.id} className="flex items-center justify-between p-3 px-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-md bg-line flex items-center justify-center text-[10px] font-medium text-muted">{i+1}</span>
                      <span className="font-semibold text-ink text-[13px] w-20">{formatTimeSlot(task.timeSlot, baseTimezone, timezone)}</span>
                      <span className="text-[11px] text-muted bg-surface border border-line px-2 py-0.5 rounded-full">{task.hoursPlanned} hr</span>
                    </div>
                    <button onClick={() => removeTimeSlot(task.id)} className="p-1.5 text-muted hover:text-error opacity-60 hover:opacity-100 rounded transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {templateTasks.length === 0 && (
                  <div className="text-center p-6 text-muted text-[13px]">
                    No schedule slots configured yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <section className="bg-card rounded-xl shadow-sm border border-line overflow-hidden">
            <div className="p-6 border-b border-line bg-surface/50">
              <h2 className="text-[15px] font-semibold text-ink">Inspirational Quotes</h2>
              <p className="text-[13px] text-muted mt-1">Add your favorite quotes. They'll cycle randomly on your dashboard.</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddQuote} className="p-4 bg-surface rounded-lg border border-line mb-6 space-y-3">
                <input
                  type="text"
                  required
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder='Quote content (e.g. "Do or do not. There is no try.")'
                  className="w-full px-3 py-2 rounded-md bg-card border border-line outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] transition-all"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newQuoteAuthor}
                    onChange={(e) => setNewQuoteAuthor(e.target.value)}
                    placeholder="Author name (Optional)"
                    className="flex-1 px-3 py-2 rounded-md bg-card border border-line outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[13px] transition-all"
                  />
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-md flex items-center justify-center gap-2 transition-colors text-[13px] font-medium whitespace-nowrap shadow-sm">
                    <Plus className="w-4 h-4" /> Add Quote
                  </button>
                </div>
              </form>

              <div className="border border-line rounded-lg overflow-hidden bg-surface divide-y divide-line">
                {quotes?.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                    <div className="flex flex-col pr-8 gap-1.5">
                      <span className="font-medium text-ink text-[14px]">"{quote.text}"</span>
                      {quote.author && (
                        <span className="text-[12px] text-muted flex items-center gap-1.5">
                          <span className="w-3 h-[1px] bg-muted/40 inline-block"></span>
                          {quote.author}
                        </span>
                      )}
                    </div>
                    <button onClick={() => removeQuote(quote.id)} className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-md transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!quotes || quotes.length === 0) && (
                  <div className="text-center p-8 text-muted text-[13px]">
                    Your quote list is empty. Add a few to inspire your day!
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
