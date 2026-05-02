import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import { uiElements } from '../../styles/theme';
import TabShell from './TabShell';
import RecordRow from './RecordRow';

interface House {
  id: string;
  address: string;
  createdAt: string;
}
interface PaginatedHouses {
  data: House[];
  meta: { total: number; page: number; totalPages: number };
}

export default function HousesTab() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<House | null>(null);
  const [address, setAddress] = useState('');

  const { data, loading, error, refetch } = useFetch<PaginatedHouses>(
    `/houses?page=${page}&limit=5`
  );

  const openCreate = () => {
    setEditing(null);
    setAddress('');
    setShowForm(true);
  };
  const openEdit = (h: House) => {
    setEditing(h);
    setAddress(h.address);
    setShowForm(true);
  };
  const cancel = () => {
    setShowForm(false);
    setEditing(null);
    setAddress('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await api.put(`/houses/${editing.id}`, { address });
    else await api.post('/houses', { address });
    cancel();
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this house and all its rooms?')) return;
    await api.delete(`/houses/${id}`);
    refetch();
  };

  return (
    <TabShell
      title="Houses"
      onAdd={openCreate}
      page={page}
      totalPages={data?.meta.totalPages ?? 1}
      onPrev={() => setPage((p) => p - 1)}
      onNext={() => setPage((p) => p + 1)}
      loading={loading}
      error={error}
    >
      {showForm && (
        <div style={uiElements.formContainer}>
          <p style={uiElements.subTitleFlush}>
            {editing ? 'EDIT HOUSE' : 'NEW HOUSE'}
          </p>
          <form onSubmit={handleSubmit}>
            <input
              style={uiElements.inputFull}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rue de la Loi 1, Brussels"
              required
            />
            <div style={uiElements.formActions}>
              <button type="submit" style={uiElements.primaryButton}>
                {editing ? 'UPDATE' : 'CREATE'}
              </button>
              <button
                type="button"
                onClick={cancel}
                style={uiElements.secondaryButton}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {data?.data.length === 0 && (
        <p style={uiElements.subTitle}>NO_RECORDS_FOUND</p>
      )}

      {data?.data.map((h) => (
        <RecordRow
          key={h.id}
          primary={h.address.toUpperCase()}
          secondary={`CREATED_AT: ${new Date(h.createdAt).toLocaleDateString()}`}
          onEdit={() => openEdit(h)}
          onDelete={() => handleDelete(h.id)}
        />
      ))}
    </TabShell>
  );
}
