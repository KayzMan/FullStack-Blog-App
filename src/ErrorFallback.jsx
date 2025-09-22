import { useErrorBoundary } from 'react-error-boundary'

export function ErrorFallback({ error, resetErrorBoundary }) {
  const { showBoundary } = useErrorBoundary()

  return (
    <div role='alert' style={errorFallbackStyles}>
      <h2 style={{ color: '#d32f2f' }}>Something went wrong.</h2>
      <p style={{ margin: '1rem 0' }}>We apologize for the inconvenience.</p>
      <pre style={preStyles}>{error.message}</pre>
      <button onClick={resetErrorBoundary} style={buttonStyles}>
        Try again
      </button>
    </div>
  )
}

const errorFallbackStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
}

const preStyles = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  backgroundColor: '#f8f8f8',
  padding: '1rem',
  borderRadius: '4px',
  border: '1px solid #eee',
}

const buttonStyles = {
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  cursor: 'pointer',
  backgroundColor: '#2196f3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
}
