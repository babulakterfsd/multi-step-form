'use client';
import { RootState } from '@/lib/store';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import StepCvCoverLetter from './StepCvCoverLetter';
import StepDetails from './StepDetails';

const JobFormWrapper = () => {
  const step = useSelector((state: RootState) => state.form.step);

  return (
    <Fragment>
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold">Job Apply</h1>
      </div>
      <div className="mt-5 w-full max-w-2xl mx-auto">
        {step === 1 && <StepDetails />}
        {step === 2 && <StepCvCoverLetter />}
      </div>
    </Fragment>
  );
};

export default JobFormWrapper;
