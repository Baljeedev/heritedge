interface TripPlannerStepsProps {
  currentStep: number
  steps: string[]
}

export function TripPlannerSteps({ currentStep, steps }: TripPlannerStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 ${index < currentStep ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
