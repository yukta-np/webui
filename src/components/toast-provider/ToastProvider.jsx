import { Toaster } from 'react-hot-toast';

const ToastProvider = () => (
  <Toaster
    position="bottom-center"
    reverseOrder={false}
    toastOptions={{
      duration: 5000,
      style: {
        background: '#fff',
        color: '#333',
        fontSize: '16px',
        padding: '14px 20px',
        width: 'auto',
        maxWidth: '90vw',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        textAlign: 'left',
        marginBottom: '20px',
        borderLeft: '4px solid #333',
      },
      success: {
        style: {
          borderLeft: '4px solid #2ecc71',
        },
      },
      error: {
        style: {
          borderLeft: '4px solid #e74c3c',
        },
      },
      loading: {
        style: {
          borderLeft: '4px solid #f1c40f',
        },
      },
    }}
  />
);

export default ToastProvider;
