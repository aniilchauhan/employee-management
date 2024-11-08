export interface Employee {
    id: string;     name: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  }

export interface EmployeeFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface FormErrors {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: EmployeeFormData) => void;
}
