"use client"

import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk"
import { TracingInstrumentation } from "@grafana/faro-web-tracing"
import { ReactIntegration } from "@grafana/faro-react"

let faroInstance: ReturnType<typeof initializeFaro> | null = null

export const getFaro = () => {
  if (
    typeof window === "undefined" ||
    !process.env.NEXT_PUBLIC_GRAFANA_FARO_ENDPOINT
  ) {
    return null
  }

  if (!faroInstance) {
    faroInstance = initializeFaro({
      url: process.env.NEXT_PUBLIC_GRAFANA_FARO_ENDPOINT || "",
      app: {
        name: "chatbot-ui",
        version: "2.0.0",
        environment: process.env.NODE_ENV
      },
      trackGeolocation: true,
      instrumentations: [
        ...getWebInstrumentations(),
        new TracingInstrumentation(),
        new ReactIntegration()
      ]
    })
  }

  return faroInstance
}

// Helper function to log custom events
export const logEvent = (name: string, attributes?: Record<string, any>) => {
  const faro = getFaro()
  if (faro) {
    faro.api.pushEvent(name, attributes)
  }
}

// Helper function to log errors
export const logError = (error: Error, attributes?: Record<string, any>) => {
  const faro = getFaro()
  if (faro) {
    faro.api.pushError(error, attributes)
  }
}

// Helper function to start a custom trace
export const startTrace = (name: string, attributes?: Record<string, any>) => {
  const faro = getFaro()

  if (faro) {
    const traceId = Math.random().toString(36).substring(2, 15)
    faro.api.pushEvent(name, {
      traceId,
      ...attributes
    })
    return {
      traceId,
      end: () => {
        faro.api.pushEvent(`${name}_end`, {
          traceId,
          duration: performance.now().toString(),
          ...attributes
          // Add any additional attributes you want to track
        })
      }
    }
  }
  return null
}
