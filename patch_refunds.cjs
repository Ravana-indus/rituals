const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/OrderDetailPage.tsx', 'utf-8');

// We will add a textarea to append notes to the order and an interface to handle refunds directly from the Order Timeline area.

const importReplacement = `import React, { useEffect, useRef, useState } from 'react';\nimport { useParams, useNavigate } from 'react-router-dom';`;
content = content.replace(importReplacement, `import React, { useEffect, useRef, useState } from 'react';\nimport { useParams, useNavigate } from 'react-router-dom';\nimport { supabase } from '../../lib/supabase';`);

// Add states for new note
const stateSearch = `const [updating, setUpdating] = React.useState(false);`;
const stateReplace = `const [updating, setUpdating] = React.useState(false);\n  const [newNote, setNewNote] = React.useState('');\n  const [savingNote, setSavingNote] = React.useState(false);`;
content = content.replace(stateSearch, stateReplace);

// Add function to append note
const funcSearch = `  async function updatePaymentStatus(paymentStatus: string) {`;
const funcReplace = `  async function handleAddNote() {\n    if (!newNote.trim()) return;\n    setSavingNote(true);\n    try {\n      const appendedNote = order?.notes ? \`\${order.notes}\\n\\n[\${new Date().toLocaleString('en-LK')}] \${newNote}\` : \`[\${new Date().toLocaleString('en-LK')}] \${newNote}\`;\n      await supabase.from('orders').update({ notes: appendedNote }).eq('id', orderId);\n      setNewNote('');\n      await loadOrder();\n    } catch(e) { console.error(e) } finally { setSavingNote(false); }\n  }\n\n  async function updatePaymentStatus(paymentStatus: string) {`;
content = content.replace(funcSearch, funcReplace);

// Add refund buttons and notes textarea
const refundSearch = `{order.notes && (
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Notes</p>
            <p className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}`;

// wait, let's just replace the whole notes block or add after the current notes block.
// Let's use regex to find the notes rendering part.
const notesRegex = /\{order\.notes && \(\n          <div>\n            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Notes<\/p>\n            <p className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3">\{order\.notes\}<\/p>\n          <\/div>\n        \)\}/;

const newNotesArea = `<div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Notes & History</p>
            {order.notes && (
              <div className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 whitespace-pre-wrap mb-3">
                {order.notes}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a note (e.g., Refund processed...)"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-md py-2 px-3 text-sm focus:border-primary outline-none"
              />
              <button
                onClick={handleAddNote}
                disabled={savingNote || !newNote.trim()}
                className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-md text-xs font-bold hover:bg-outline-variant/20 disabled:opacity-50"
              >
                {savingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>`;

content = content.replace(notesRegex, newNotesArea);

fs.writeFileSync('src/pages/admin/OrderDetailPage.tsx', content);
