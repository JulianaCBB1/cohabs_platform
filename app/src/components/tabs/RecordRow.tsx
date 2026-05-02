import React from 'react';
import { uiElements } from '../../styles/theme';

interface RecordRowProps {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RecordRow({
  primary,
  secondary,
  onEdit,
  onDelete,
}: RecordRowProps) {
  return (
    <div style={uiElements.nodeContainer}>
      <div style={{ flex: 1 }}>
        <div style={uiElements.recordPrimary}>{primary}</div>
        {secondary && <div style={uiElements.recordSecondary}>{secondary}</div>}
      </div>
      <div style={uiElements.recordActions}>
        <button onClick={onEdit} style={uiElements.secondaryButton}>
          EDIT
        </button>
        <button onClick={onDelete} style={uiElements.deleteButton}>
          DELETE
        </button>
      </div>
    </div>
  );
}
