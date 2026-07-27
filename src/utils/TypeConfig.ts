export interface CategoryStatusList {
  name: string;
  id: number;
}
export interface CategoryDetailsTypes extends CategoryStatusList {
  image: File | null | undefined;
  parent_id: number | null;
  status_id: number | null;
}

export interface CategoryFormProps {
  handleClose: () => void;
  setIsEditCategory?: any;
  setIsAddCategory?: any;
  editCategory?: any;
}
export interface ModalContainerProps extends CategoryFormProps {
  showModal: boolean;
  modalTitle: string;
  handleClose: any;
  modalBody: any; // Pass the modal body as a component
}
