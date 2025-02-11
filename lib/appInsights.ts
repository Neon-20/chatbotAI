"use client"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { ReactPlugin } from "@microsoft/applicationinsights-react-js"

let reactPlugin: ReactPlugin | null = null
let appInsights: ApplicationInsights | null = null

export const getAppInsights = () => {
  if (!appInsights) {
    reactPlugin = new ReactPlugin()
    appInsights = new ApplicationInsights({
      config: {
        connectionString:
          process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
        instrumentationKey:
          process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_INSTRUMENTATION,
        extensions: [reactPlugin],
        enableAutoRouteTracking: true
      }
    })
    appInsights.loadAppInsights()
  }
  return appInsights
}
