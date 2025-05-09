/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { prevStep, resetForm, updateField } from '@/lib/formSlice/formSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { CvInfo, cvSchema, DefaultCvInfo } from '@/lib/validator/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Upload, WandSparkles, X } from 'lucide-react';
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

  const name = formData?.name || 'Candidate';
  const jobTitle = formData?.jobTitle || 'the position';

  const infoForGeneratingCoverLetter = {
    name,
    jobTitle,
  };

  // call gemini api to generate cover letter
  const callGeminiToGenerateCoverLetter = async (info: any) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    });

    if (!response.ok) {
      throw new Error('Failed to generate cover letter');
    }

    const data = await response.json();
    return data.coverLetter;
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
    <Card className="w-full p-8 bg-white shadow-md rounded-lg">
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
                        <FileUpload
                          maxFiles={1}
                          maxSize={5 * 1024 * 1024}
                          accept="application/pdf"
                          className="w-full"
                          value={field.value ? [field.value] : []}
                          onValueChange={(files: File[]) => {
                            field.onChange(files[0]);
                          }}
                          onFileReject={(file, message) => {
                            toast(message, {
                              description: `"${
                                file.name.length > 20
                                  ? `${file.name.slice(0, 20)}...`
                                  : file.name
                              }" has been rejected`,
                            });
                          }}
                          multiple={false}
                        >
                          <FileUploadDropzone>
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center justify-center rounded-full border p-2.5">
                                <Upload className="size-6 text-muted-foreground" />
                              </div>
                              <p className="font-medium text-sm">
                                Drag & drop your CV here
                              </p>
                              <p className="text-muted-foreground text-xs">
                                Only PDF, max 5MB
                              </p>
                            </div>
                            <FileUploadTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-fit"
                              >
                                Browse CV
                              </Button>
                            </FileUploadTrigger>
                          </FileUploadDropzone>

                          <FileUploadList>
                            {field.value && (
                              <FileUploadItem value={field.value}>
                                <FileUploadItemPreview />
                                <FileUploadItemMetadata />
                                <FileUploadItemDelete asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => field.onChange(undefined)}
                                  >
                                    <X />
                                  </Button>
                                </FileUploadItemDelete>
                              </FileUploadItem>
                            )}
                          </FileUploadList>
                        </FileUpload>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mt-4 md:mt-8">
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
                          onClick={async () => {
                            try {
                              toast.loading('Generating cover letter...');

                              setTimeout(() => {
                                toast.dismiss();
                              }, 3000);

                              const aiLetter =
                                await callGeminiToGenerateCoverLetter(
                                  infoForGeneratingCoverLetter
                                );

                              form.setValue('coverLetter', aiLetter, {
                                shouldValidate: true,
                              });
                              toast.success('AI-generated cover letter added!');
                            } catch (err) {
                              console.error(err);
                              toast.error('Failed to generate cover letter.');
                            }
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
              <div className="flex justify-between space-y-1.5 mt-6 lg:mt-10">
                <Button
                  className="bg-white text-black border-none hover:text-black hover:bg-white shadow-none hover:shadow"
                  type="button"
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
