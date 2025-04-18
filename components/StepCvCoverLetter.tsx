/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { prevStep, resetForm, updateField } from '@/lib/formSlice/formSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { CvInfo, cvSchema, DefaultCvInfo } from '@/lib/validator/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import QuillEditor from './QuillEditor';
import StepNavigation from './StepNavigation';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Label } from './ui/label';

export default function StepCvCoverLetter() {
  const formData = useSelector((state: RootState) => state.form);
  // remove step from formData
  const { step, ...rest } = formData;
  const formDataWithoutStep = rest as CvInfo;

  const dispatch = useDispatch<AppDispatch>();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(cvSchema),
    defaultValues: {
      ...DefaultCvInfo,
      ...formDataWithoutStep,
    },
  });

  // instant show after file upload
  const watchCv = form.watch('cv');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      form.setValue('cv', file, { shouldValidate: true });
    }
  };
  const generateRandomCoverLetter = () => {
    const name = formData?.name || 'Candidate';
    const jobTitle = formData?.jobTitle || 'the position';

    const coverLetters = [
      `Dear Hiring Manager,\n\nI am excited to apply for ${jobTitle} at your company. With my skills and experience, I believe I would be a great fit for your team.\n\nSincerely,\n${name}`,
      `To whom it may concern,\n\nI'm writing to express my interest in ${jobTitle}. My background aligns well with the requirements, and I'm eager to contribute to your organization.\n\nBest regards,\n${name}`,
      `Hello,\n\nI was thrilled to see the opening for ${jobTitle}. I'm confident that my qualifications make me a strong candidate for this role.\n\nRegards,\n${name}`,
      `Dear Recruiter,\n\nPlease accept my application for ${jobTitle}. I've attached my CV for your review and would welcome the opportunity to discuss how I can add value to your team.\n\nKind regards,\n${name}`,
    ];

    const randomLetter =
      coverLetters[Math.floor(Math.random() * coverLetters.length)];
    form.setValue('coverLetter', randomLetter, { shouldValidate: true });
  };

  const onSubmit = (data: CvInfo) => {
    dispatch(updateField({ field: 'coverLetter', value: data.coverLetter }));
    dispatch(updateField({ field: 'cv', value: data.cv }));

    // Dispatch the form data to the Redux store
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'cv' && key !== 'coverLetter') {
        dispatch(updateField({ field: key as any, value }));
      }
    });
    const finalData = {
      ...formDataWithoutStep,
      ...data,
    };

    console.log('Final form data', finalData);
    toast.success('Job Application Successfull!', {
      description: 'Congratulations, your job application done. ',
    });
    // reset the form after submission local state
    form.reset();
    // reset the form after submission redux store
    dispatch(resetForm());
  };

  return (
    <Card className="w-[675px] p-[32px]">
      <CardHeader className="p-0 space-y-0">
        <StepNavigation />
      </CardHeader>
      <CardContent className="p-0 mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                {/* preview pdf file */}
                {watchCv && (
                  <div className="space-y-2 bg-[#EEFAFF] p-3 rounded-md">
                    <div className="flex gap-3">
                      <Image
                        src={'/pdf.png'}
                        alt="pdf"
                        width={20}
                        height={20}
                      />
                      <p className="text-black text-sm font-medium">
                        CV of {formData?.name}
                      </p>
                    </div>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="cv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CV</FormLabel>
                      <FormControl>
                        <Label className="text-black py-3 bg-white border-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-center text-center">
                          Upload new CV (PDF only)
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </Label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Cover letter</FormLabel>
                        <Button
                          className="text-white"
                          style={{
                            background:
                              'linear-gradient(90deg, #86088D 0%, #654FC6 80.77%)',
                          }}
                          type="button"
                          onClick={() => {
                            toast.promise(
                              new Promise((resolve) => {
                                generateRandomCoverLetter();
                                resolve(null);
                              }),
                              {
                                loading: 'Generating cover letter...',
                                success: 'AI-generated cover letter added!',
                                error: 'Failed to generate cover letter',
                              }
                            );
                          }}
                        >
                          <WandSparkles className="mr-2 h-4 w-4" /> AI Write
                        </Button>
                      </div>
                      <FormControl>
                        <QuillEditor
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Type your cover letter here."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between space-y-1.5">
                <Button
                  variant="outline"
                  className="border-[#1DA6E5] text-[#1DA6E5] hover:bg-[#1DA6E5] hover:text-white"
                  onClick={() => dispatch(prevStep())}
                >
                  <ArrowLeft size={24} /> Previoius
                </Button>
                <Button className="bg-[#1DA6E5]" type="submit">
                  Submit <ArrowRight size={24} />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
