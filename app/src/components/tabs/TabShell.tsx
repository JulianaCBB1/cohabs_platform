import React from 'react';
import { uiElements, dashboardElements } from '../../styles/theme';

interface TabShellProps {
  title: string;
  onAdd: () => void;
  addLabel?: string;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export default function TabShell({
  title,
  onAdd,
  addLabel = '+ ADD',
  page,
  totalPages,
  onPrev,
  onNext,
  loading,
  error,
  children,
}: TabShellProps) {
  return (
    <div>
      <div style={dashboardElements.tabHeader}>
        <h2 style={uiElements.mainTitle}>{title.toUpperCase()}</h2>
        <button onClick={onAdd} style={uiElements.primaryButton}>
          {addLabel}
        </button>
      </div>

      {error && <div style={uiElements.errorMessage}>ERROR: {error}</div>}
      {loading && <div style={uiElements.subTitle}>SYNCING...</div>}

      {!loading && !error && children}

      {!loading && !error && (
        <footer style={uiElements.paginationFooter}>
          <button
            disabled={page === 1}
            onClick={onPrev}
            style={uiElements.secondaryButton}
          >
            PREV
          </button>
          <span>
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page >= (totalPages || 1)}
            onClick={onNext}
            style={uiElements.secondaryButton}
          >
            NEXT
          </button>
        </footer>
      )}
    </div>
  );
}
