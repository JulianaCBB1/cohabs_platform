import React from 'react';

export const THEME_TOKENS = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    gray: '#888888',
    lightGray: '#f8f8f8',
    darkGray: '#333333',
    error: '#ff4d4d',
    success: '#00ff00',
    border: '#dddddd',
  },
  spacing: {
    xs: '10px',
    sm: '20px',
    md: '30px',
    lg: '40px',
    xl: '50px',
  },
  typography: {
    fontFamily: 'inherit',
    letterSpacing: '2px',
    letterSpacingLarge: '4px',
    weightBold: 'bold',
    weightBlack: '900',
  },
};

const _secondaryButtonBase: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: THEME_TOKENS.colors.black,
  border: `1px solid ${THEME_TOKENS.colors.black}`,
  padding: '8px 16px',
  fontWeight: THEME_TOKENS.typography.weightBold as any,
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontSize: '11px',
  textAlign: 'center',
  textDecoration: 'none',
};

const _subTitleBase: React.CSSProperties = {
  fontSize: '12px',
  color: THEME_TOKENS.colors.gray,
  textTransform: 'uppercase',
  letterSpacing: THEME_TOKENS.typography.letterSpacing,
};

const _inputBase: React.CSSProperties = {
  padding: '8px',
  border: `1px solid ${THEME_TOKENS.colors.black}`,
  borderRadius: 0,
  outline: 'none',
};

export const layoutStyles: Record<string, React.CSSProperties> = {
  fullPageContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_TOKENS.colors.white,
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  authCard: {
    // width: '100%',
    maxWidth: '550px',
    padding: '60px',
    border: `1px solid ${THEME_TOKENS.colors.black}`,
    backgroundColor: THEME_TOKENS.colors.white,
    textAlign: 'left',
    boxSizing: 'border-box' as any,
  },
  dashboardContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: THEME_TOKENS.colors.white,
    position: 'fixed',
    top: 0,
    left: 0,
  },
};

export const uiElements: Record<string, React.CSSProperties> = {
  // ── Inputs ──
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    width: '110px',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: THEME_TOKENS.colors.gray,
  },
  input: {
    ..._inputBase,
    flexGrow: 1,
  },
  // Full-width input used inside forms
  inputFull: {
    ..._inputBase,
    width: '100%',
    boxSizing: 'border-box' as any,
    marginBottom: THEME_TOKENS.spacing.xs,
  },
  // Bare input (no flex-grow, for use inside flex rows)
  inputBare: {
    ..._inputBase,
    flex: 1,
  },
  // Select dropdown — same visual as input
  select: {
    ..._inputBase,
    width: '100%',
    boxSizing: 'border-box' as any,
    backgroundColor: THEME_TOKENS.colors.white,
    cursor: 'pointer',
  },

  // ── Typography ──
  mainTitle: {
    fontWeight: THEME_TOKENS.typography.weightBlack as any,
    textTransform: 'uppercase',
    letterSpacing: THEME_TOKENS.typography.letterSpacingLarge,
    fontSize: '32px',
    marginBottom: THEME_TOKENS.spacing.xs,
    lineHeight: '1',
  },
  navbarBrand: {
    fontWeight: THEME_TOKENS.typography.weightBlack as any,
    textTransform: 'uppercase',
    letterSpacing: THEME_TOKENS.typography.letterSpacingLarge,
    fontSize: '18px',
    margin: 0,
    lineHeight: '1',
    color: THEME_TOKENS.colors.white,
  },
  subTitle: {
    ..._subTitleBase,
    marginTop: '10px',
    marginBottom: THEME_TOKENS.spacing.md,
  },
  // Subtitle reset — no vertical margin (used as form section headings)
  subTitleFlush: {
    ..._subTitleBase,
    margin: `0 0 ${THEME_TOKENS.spacing.xs}`,
  },
  // Tiny label above a form field
  fieldLabel: {
    ..._subTitleBase,
    display: 'block',
    fontSize: '10px',
    marginBottom: '4px',
  },
  errorMessage: {
    border: `1px solid ${THEME_TOKENS.colors.error}`,
    color: THEME_TOKENS.colors.error,
    padding: THEME_TOKENS.spacing.xs,
    fontSize: '12px',
    marginBottom: THEME_TOKENS.spacing.sm,
    fontWeight: 'bold',
  },

  // ── Buttons ──
  primaryButton: {
    backgroundColor: THEME_TOKENS.colors.black,
    color: THEME_TOKENS.colors.white,
    border: `2px solid ${THEME_TOKENS.colors.black}`,
    padding: `${THEME_TOKENS.spacing.xs} ${THEME_TOKENS.spacing.sm}`,
    fontWeight: THEME_TOKENS.typography.weightBlack as any,
    textTransform: 'uppercase',
    cursor: 'pointer',
    letterSpacing: '1px',
    fontSize: '12px',
  },
  secondaryButton: {
    ..._secondaryButtonBase,
  },
  deleteButton: {
    ..._secondaryButtonBase,
    color: THEME_TOKENS.colors.error,
    borderColor: THEME_TOKENS.colors.error,
  },
  // Logout button — base (not hovered)
  logoutButton: {
    ..._secondaryButtonBase,
    padding: '6px 16px',
    fontSize: '10px',
    borderColor: THEME_TOKENS.colors.error,
    backgroundColor: 'transparent',
    color: THEME_TOKENS.colors.error,
  },
  // Logout button — hovered
  logoutButtonHovered: {
    ..._secondaryButtonBase,
    padding: '6px 16px',
    fontSize: '10px',
    borderColor: THEME_TOKENS.colors.error,
    backgroundColor: THEME_TOKENS.colors.error,
    color: THEME_TOKENS.colors.white,
  },

  // ── Records list ──
  nodeContainer: {
    border: `1px solid ${THEME_TOKENS.colors.black}`,
    padding: THEME_TOKENS.spacing.sm,
    marginBottom: THEME_TOKENS.spacing.xs,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME_TOKENS.colors.white,
  },
  recordPrimary: {
    fontWeight: 'bold',
    fontSize: '13px',
  },
  recordSecondary: {
    fontSize: '11px',
    color: THEME_TOKENS.colors.gray,
    marginTop: '4px',
  },
  recordActions: {
    display: 'flex',
    gap: THEME_TOKENS.spacing.xs,
  },

  // ── Forms ──
  formContainer: {
    border: `2px solid ${THEME_TOKENS.colors.black}`,
    padding: THEME_TOKENS.spacing.sm,
    marginBottom: THEME_TOKENS.spacing.md,
    backgroundColor: THEME_TOKENS.colors.lightGray,
  },
  formRow: {
    display: 'flex',
    gap: THEME_TOKENS.spacing.xs,
    marginBottom: THEME_TOKENS.spacing.xs,
  },
  formRowWrap: {
    display: 'flex',
    flexWrap: 'wrap' as any,
    gap: THEME_TOKENS.spacing.xs,
    marginBottom: THEME_TOKENS.spacing.xs,
  },
  formField: {
    flex: '1 1 200px' as any,
  },
  formFieldNarrow: {
    flex: '1 1 160px' as any,
  },
  formActions: {
    display: 'flex',
    gap: THEME_TOKENS.spacing.xs,
  },

  // ── Pagination ──
  paginationFooter: {
    marginTop: THEME_TOKENS.spacing.md,
    display: 'flex',
    gap: THEME_TOKENS.spacing.xs,
    alignItems: 'center',
    fontWeight: THEME_TOKENS.typography.weightBlack as any,
  },
};

export const dashboardStyles: Record<string, React.CSSProperties> = {
  navbar: {
    height: '60px',
    backgroundColor: THEME_TOKENS.colors.black,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${THEME_TOKENS.spacing.md}`,
    flexShrink: 0,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '120px',
    backgroundColor: THEME_TOKENS.colors.white,
    padding: `20px ${THEME_TOKENS.spacing.md}`,
    borderRight: `1px solid ${THEME_TOKENS.colors.black}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sidebarProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sidebarNavSection: {
    borderTop: `1px solid ${THEME_TOKENS.colors.black}`,
    paddingTop: THEME_TOKENS.spacing.sm,
    width: '100%',
  },
  // Inactive sidebar nav button
  sidebarNavButton: {
    ..._secondaryButtonBase,
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginBottom: '6px',
    fontSize: '10px',
    backgroundColor: 'transparent',
    color: THEME_TOKENS.colors.black,
  },
  // Active sidebar nav button
  sidebarNavButtonActive: {
    ..._secondaryButtonBase,
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginBottom: '6px',
    fontSize: '10px',
    backgroundColor: THEME_TOKENS.colors.black,
    color: THEME_TOKENS.colors.white,
  },
  dashboard: {
    flexGrow: 1,
    padding: THEME_TOKENS.spacing.sm,
    textAlign: 'left',
    flex: 1,
    backgroundColor: THEME_TOKENS.colors.white,
    overflow: 'auto',
  },
  badge: {
    fontSize: '9px',
    border: `1px solid ${THEME_TOKENS.colors.black}`,
    padding: '4px 8px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: THEME_TOKENS.colors.black,
    display: 'inline-block',
  },
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: THEME_TOKENS.colors.white,
  },
  profileSection: {
    paddingBottom: THEME_TOKENS.spacing.md,
    borderBottom: `1px solid ${THEME_TOKENS.colors.black}`,
  },
};

export const dashboardElements: Record<string, React.CSSProperties> = {
  contentBox: {
    marginTop: THEME_TOKENS.spacing.lg,
    border: `1px solid ${THEME_TOKENS.colors.black}`,
    padding: THEME_TOKENS.spacing.lg,
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_TOKENS.colors.white,
  },
  placeholderText: {
    fontSize: '11px',
    color: THEME_TOKENS.colors.gray,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '300px',
    lineHeight: '1.6',
    textTransform: 'uppercase',
  },
  statusMarker: {
    marginTop: 'auto',
    fontSize: '9px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    backgroundColor: THEME_TOKENS.colors.success,
    borderRadius: 0,
  },
  profileHeader: {
    fontSize: '14px',
    color: THEME_TOKENS.colors.gray,
    textTransform: 'uppercase',
    fontWeight: THEME_TOKENS.typography.weightBlack as any,
    letterSpacing: '1px',
    margin: 0,
    lineHeight: '1',
  },
  emailDisplay: {
    fontSize: '10px',
    fontWeight: 'bold',
    margin: `0 0 ${THEME_TOKENS.spacing.xs} 0`,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  // Tab section header row (title left, add button right)
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME_TOKENS.spacing.md,
  },
};
