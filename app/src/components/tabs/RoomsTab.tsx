import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import { uiElements } from '../../styles/theme';
import TabShell from './TabShell';
import RecordRow from './RecordRow';
import type { House } from './HousesTab';

export interface Room {
  id: string;
  roomNumber: string;
  rentalPrice: number;
  stripePriceId: string;
  createdAt: string;
}

interface PaginatedRooms {
  data: Room[];
  meta: { total: number; page: number; totalPages: number };
}

export default function RoomsTab() {
  const [page, setPage] = useState(1);
  const [selectedHouseId, setSelectedHouseId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');

  const { data: houses } = useFetch<House[]>('/houses/all');
  const { data, loading, error, refetch } = useFetch<PaginatedRooms>(
    selectedHouseId
      ? `/houses/${selectedHouseId}/rooms?page=${page}&limit=5`
      : ''
  );

  const openCreate = () => {
    setEditing(null);
    setRoomNumber('');
    setRentalPrice('');
    setShowForm(true);
  };
  const openEdit = (r: Room) => {
    setEditing(r);
    setRoomNumber(r.roomNumber);
    setRentalPrice(String(r.rentalPrice));
    setShowForm(true);
  };
  const cancel = () => {
    setShowForm(false);
    setEditing(null);
    setRoomNumber('');
    setRentalPrice('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { roomNumber, rentalPrice: parseFloat(rentalPrice) };
    if (editing)
      await api.put(`/houses/${selectedHouseId}/rooms/${editing.id}`, payload);
    else await api.post(`/houses/${selectedHouseId}/rooms`, payload);
    cancel();
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room?')) return;
    await api.delete(`/houses/${selectedHouseId}/rooms/${id}`);
    refetch();
  };

  return (
    <div>
      <div style={uiElements.formContainer}>
        <label style={uiElements.fieldLabel}>SELECT HOUSE</label>
        <select
          value={selectedHouseId}
          onChange={(e) => {
            setSelectedHouseId(e.target.value);
            setPage(1);
            cancel();
          }}
          style={uiElements.select}
        >
          <option value="">-- CHOOSE A HOUSE --</option>
          {houses?.map((h) => (
            <option key={h.id} value={h.id}>
              {h.address}
            </option>
          ))}
        </select>
      </div>

      {!selectedHouseId ? (
        <p style={uiElements.subTitle}>SELECT A HOUSE TO VIEW ITS ROOMS</p>
      ) : (
        <TabShell
          title="Rooms"
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
                {editing ? 'EDIT ROOM' : 'NEW ROOM'}
              </p>
              <form onSubmit={handleSubmit}>
                <div style={uiElements.formRow}>
                  <input
                    style={uiElements.inputBare}
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="Room number (e.g. 101)"
                    required
                  />
                  <input
                    type="number"
                    style={uiElements.inputBare}
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(e.target.value)}
                    placeholder="Rental price (€)"
                    required
                  />
                </div>
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
            <p style={uiElements.subTitle}>NO ROOMS FOUND</p>
          )}

          {data?.data.map((r) => (
            <RecordRow
              key={r.id}
              primary={`ROOM ${r.roomNumber} — €${Number(r.rentalPrice).toFixed(2)}/MO`}
              secondary={
                r.stripePriceId
                  ? `STRIPE: ${r.stripePriceId}`
                  : 'STRIPE: NOT_SYNCED'
              }
              onEdit={() => openEdit(r)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </TabShell>
      )}
    </div>
  );
}
