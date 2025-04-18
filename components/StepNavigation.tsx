'use client';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

const StepNavigation = () => {
  const step = useSelector((state: RootState) => state.form.step);

  const steps = ['Details', 'CV & Cover letter'];

  return (
    <div className="border-b-[1px] border-gray-200">
      <nav className="flex space-x-6" aria-label="Steps">
        {steps.map((label, index) => {
          const isActive = step === index + 1;
          return (
            <div key={label} className="relative pb-2">
              <span
                className={`font-semibold ${isActive ? '' : 'text-gray-500'}`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500"></span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default StepNavigation;
