export type UndoData = {
  text: string;
  cursor: { row: number; column: number };
  action: UndoAction;
};

export type UndoAction = 'write' | 'delete' | 'newLine';
