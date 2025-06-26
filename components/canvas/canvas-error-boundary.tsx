"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class CanvasErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Canvas Error Boundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        )
      }

      return (
        <div className="bg-background flex size-full flex-col items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="text-destructive mx-auto size-12" />
            <h2 className="mt-4 text-xl font-semibold">Canvas Error</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Something went wrong with the canvas interface.
            </p>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium">
                  Error Details
                </summary>
                <pre className="bg-muted mt-2 max-w-md overflow-auto rounded p-2 text-xs">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button
              onClick={this.resetError}
              className="mt-6"
              variant="outline"
            >
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
