// components/ErrorBoundary.tsx
import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage?: string
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: undefined }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught in ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col space-y-5 justify-center items-center fixed top-0 left-0 w-full h-full bg-[#191C73] bg-opacity-20 backdrop-blur-lg z-[2]'>
          <img className='max-w-[186px]' src='/images/crying.svg' />
          <span>Something went wrong.</span>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
