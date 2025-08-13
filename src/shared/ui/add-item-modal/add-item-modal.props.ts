export interface AddItemModalProps {
  show: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  onClose: () => void;
  onAdd: (value: string) => void;
}
