
import React from "react";

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Особисті дані" },
    { number: 2, title: "Доставка" },
    { number: 3, title: "Оплата" },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-around items-center">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <React.Fragment key={step.number}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-white
                    ${isActive ? "bg-[#3A3C99]" : isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                >
                  {step.number}
                </div>
                <div className={`text-sm ${isActive ? "font-semibold text-[#3A3C99]" : isCompleted ? "font-semibold" : "text-gray-500"}`}>
                  {step.title}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${currentStep > index + 1 ? "bg-green-500" : "bg-gray-300"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
