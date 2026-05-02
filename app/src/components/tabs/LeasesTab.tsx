import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import { uiElements } from '../../styles/theme';
import TabShell from './TabShell';
import RecordRow from './RecordRow';
import type { House } from './HousesTab';
import type { Room } from './RoomsTab';

interface User {
  id: string;
  email: string;
}

interface Lease {
  id: string;
  startDate: string;
  endDate?: string;
  user: User;
  room: Room & { house: House };
}

interface PaginatedLeases {
  data: Lease[];
  meta: { total: number; page: number; totalPages: number };
}

export default function LeasesTab() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [selectedHouseId, setSelectedHouseId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: users } = useFetch<User[]>('/users');
  const { data: houses } = useFetch<House[]>('/houses/all');
  const { data, loading, error, refetch } = useFetch<PaginatedLeases>(
    `/leases?page=${page}&limit=5`
  );

  const selectedHouseRooms =
    houses?.find((h) => h.id === selectedHouseId)?.rooms ?? [];

  const cancel = () => {
    setShowForm(false);
    setUserId('');
    setSelectedHouseId('');
    setRoomId('');
    setStartDate('');
    setEndDate('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/leases', {
      userId,
      roomId,
      startDate,
      endDate: endDate || undefined,
    });
    cancel();
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lease?')) return;
    await api.delete(`/leases/${id}`);
    refetch();
  };

  return (
    <TabShell
      title="Leases"
      onAdd={() => setShowForm(true)}
      page={page}
      totalPages={data?.meta.totalPages ?? 1}
      onPrev={() => setPage((p) => p - 1)}
      onNext={() => setPage((p) => p + 1)}
      loading={loading}
      error={error}
    >
      {showForm && (
        <div style={uiElements.formContainer}>
          <p style={uiElements.subTitleFlush}>NEW LEASE</p>
          <form onSubmit={handleSubmit}>
            <div style={uiElements.formRowWrap}>
              <div style={uiElements.formField}>
                <label style={uiElements.fieldLabel}>TENANT</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  style={uiElements.select}
                >
                  <option value="">-- SELECT USER --</option>
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div style={uiElements.formField}>
                <label style={uiElements.fieldLabel}>HOUSE</label>
                <select
                  value={selectedHouseId}
                  onChange={(e) => {
                    setSelectedHouseId(e.target.value);
                    setRoomId('');
                  }}
                  style={uiElements.select}
                >
                  <option value="">-- SELECT HOUSE --</option>
                  {houses?.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.address}
                    </option>
                  ))}
                </select>
              </div>

              <div style={uiElements.formField}>
                <label style={uiElements.fieldLabel}>ROOM</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                  disabled={!selectedHouseId}
                  style={uiElements.select}
                >
                  <option value="">-- SELECT ROOM --</option>
                  {selectedHouseRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Room {r.roomNumber} — €{Number(r.rentalPrice).toFixed(2)}
                      /mo
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={uiElements.formRowWrap}>
              <div style={uiElements.formFieldNarrow}>
                <label style={uiElements.fieldLabel}>START DATE</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={uiElements.select}
                />
              </div>

              <div style={uiElements.formFieldNarrow}>
                <label style={uiElements.fieldLabel}>END DATE (OPT.)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={uiElements.select}
                />
              </div>
            </div>

            <div style={uiElements.formActions}>
              <button type="submit" style={uiElements.primaryButton}>
                CREATE
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
        <p style={uiElements.subTitle}>NO_LEASES_FOUND</p>
      )}

      {data?.data.map((l) => (
        <RecordRow
          key={l.id}
          primary={`${l.user?.email?.toUpperCase()} — ROOM ${l.room?.roomNumber} @ ${l.room?.house?.address}`}
          secondary={`€${Number(l.room?.rentalPrice).toFixed(2)}/MO  ·  ${l.startDate} → ${l.endDate ?? 'ACTIVE'}`}
          onEdit={() => {}}
          onDelete={() => handleDelete(l.id)}
        />
      ))}
    </TabShell>
  );
}
