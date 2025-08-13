export interface EditableListItemProps {
  id: string;
  name: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}
