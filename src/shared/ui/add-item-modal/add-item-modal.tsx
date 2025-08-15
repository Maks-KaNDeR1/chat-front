import {useState, useEffect, useRef} from "react";
import {Modal, Button, FormControl, Form} from "react-bootstrap";
import {AddItemModalProps} from "./add-item-modal.props";

export const AddItemModal = ({
  show,
  title,
  placeholder = "Введите название",
  initialValue = "",
  onClose,
  onAdd,
}: AddItemModalProps) => {
  const MAX_LENGTH = 20;
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) {
      setInputValue(initialValue);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [show, initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_LENGTH) {
      setInputValue(val);
      setError(null);
    } else {
      setError(`Максимальная длина — ${MAX_LENGTH} символов`);
    }
  };

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Пожалуйста, введите значение");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Максимальная длина — ${MAX_LENGTH} символов`);
      return;
    }
    onAdd(trimmed);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="addItemInput">
          <FormControl
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="outline-secondary" onClick={handleAdd}>
          Создать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
