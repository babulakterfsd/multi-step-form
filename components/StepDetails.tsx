/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { nextStep, updateField } from '@/lib/formSlice/formSlice';
import { AppDispatch, RootState } from '@/lib/store';
import {
  DefaultDetailsInfo,
  DetailsInfo,
  detailsSchema,
} from '@/lib/validator/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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
export default function StepDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form);
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      ...DefaultDetailsInfo,
      ...formData,
    },
  });
  const onSubmit = (data: DetailsInfo) => {
    // Dispatch the form data to the Redux store
    Object.entries(data).forEach(([key, value]) =>
      dispatch(updateField({ field: key as any, value }))
    );
    dispatch(nextStep());
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. Jhon Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g. robertsmith@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="e.g. (555) 123-4567"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>
                            e.g. Frontend Developer
                          </option>
                          <option value="software">Software Engineer</option>
                          <option value="forntend">Frontend Developer</option>
                          <option value="backend">Backend Developer</option>
                          <option value="fullstack">Fullstack Developer</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="jobSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Schedule</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {[
                              'Nine-to-five',
                              'Morning shift',
                              'Day shift',
                              'Evening shift',
                              'Night shift',
                            ].map((shift) => (
                              <button
                                key={shift}
                                type="button"
                                onClick={() => {
                                  field.onChange(shift);
                                }}
                                className={`inline-flex items-center border-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                                  field.value === shift
                                    ? 'bg-[#033146] text-white hover:bg-[#033146]'
                                    : 'text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {shift}
                              </button>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-y-1.5 mt-6 lg:mt-10">
                <Button className="bg-[#1DA6E5]" type="submit">
                  Next: CV & Cover letter <ArrowRight size={24} />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
