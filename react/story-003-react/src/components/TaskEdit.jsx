import { useEffect, useMemo, useRef, useState } from 'react';
import { STATUS_VALUES, PRIORITY_VALUES } from '../helpers/labels';

import './TaskEdit.css';

export default function TaskEdit({ tasks, id, onUpdate, onCancel }) {
  // Récupérer la source depuis les props, mémoisée
  const sourceTask = useMemo(() => tasks.find(t => t.id === id) ?? null, [tasks, id]);

  // Etat local (draft) qui se resynchronise quand la source change
  const [draft, setDraft] = useState(
    sourceTask ?? { id: null, name: '', priority: 0, status: 0 }
  );

  useEffect(() => {
    setDraft(sourceTask ?? { id: null, name: '', priority: 0, status: 0 });
  }, [sourceTask]);

  const inputRef = useRef(null);

  // Garde-fou si la tâche n’existe plus
  if (!sourceTask) {
    return (
      <div className="TaskEdit">
        <em>Task not found.</em>
        <button type="button" onClick={onCancel}>Close</button>
      </div>
    );
  }

  // Détection de changement pour activer/désactiver le bouton Update
  const changed =
    draft.name.trim() !== sourceTask.name ||
    Number(draft.priority) !== sourceTask.priority ||
    Number(draft.status) !== sourceTask.status;

  function handleSubmit(e) {
    e.preventDefault();
    const name = draft.name.trim();
    if (!name || !changed) return;
    onUpdate({
      id: sourceTask.id,
      name,
      priority: Number(draft.priority),
      status: Number(draft.status),
    });
  }

  return (
    <form
      className="TaskEdit"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <input
        ref={inputRef}
        placeholder="Enter a task"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        autoFocus
        aria-label="Task name"
      />

      <select
        value={draft.priority}
        onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) })}
        aria-label="Priority"
      >
        {PRIORITY_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>

      <select
        value={draft.status}
        onChange={(e) => setDraft({ ...draft, status: Number(e.target.value) })}
        aria-label="Status"
      >
        {STATUS_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>
      
      <button type="submit" disabled={!draft.name.trim() || !changed}>Update</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
