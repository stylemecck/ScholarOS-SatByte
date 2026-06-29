import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (msg: string) => sonnerToast.success(msg, { duration: 3000 }),
  error: (msg: string) => sonnerToast.error(msg, { duration: 4000 }),
  info: (msg: string) => sonnerToast(msg, { duration: 3000 }),
  loading: (msg: string) => sonnerToast.loading(msg),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  promise: sonnerToast.promise,
};
