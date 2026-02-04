'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Link2, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { api, ApiResponse } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { PredictionProp } from '@/types';

const durations = [
  { id: '1h', label: '1 Hour' },
  { id: '6h', label: '6 Hours' },
  { id: '12h', label: '12 Hours' },
  { id: '24h', label: '24 Hours' },
];

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be at most 80 characters'),
  link: z
    .url('Please enter a valid URL')
    .refine(
      url => url.includes('twitter.com') || url.includes('x.com') || url.includes('status'),
      'Must be a Twitter/X link'
    ),
  duration: z.string().min(1, 'Select duration'),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPostProps {
  onSuccess?: () => void;
  updatePredictions: (data: PredictionProp) => void;
}

export default function AddPost({ onSuccess, updatePredictions }: AddPostProps) {
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      link: '',
      duration: '24h',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsCreating(true);
    try {
      const response = await api.post<ApiResponse<PredictionProp>>('/api/predictions', values);
      const newData = response.data.data;
      updatePredictions(newData);

      toast.success('Prediction market created!');
      form.reset();
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof AxiosError && err.response?.status !== 401
          ? (err.response?.data?.message ?? 'Failed to create prediction')
          : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedDuration = form.watch('duration');

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="relative">
          <div className="from-brand-primary/20 absolute inset-0 rounded-full bg-linear-to-br to-pink-500/20 blur-xl" />
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#0F1419] to-[#1a1f24] shadow-lg">
            <Zap className="size-7 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0F1419]">Create Prediction</h2>
          <p className="text-sm text-[#536471]">Bet on tweet performance</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-wider text-[#536471] uppercase">Tweet Link</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Link2 className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#536471]" />
                    <Input
                      placeholder="https://x.com/username/status/..."
                      className="focus:ring-brand-primary/20 h-12 rounded-xl border-0 bg-[#F7F9F9] pl-11 text-sm transition-all focus:bg-white focus:ring-2"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-wider text-[#536471] uppercase">
                  Prediction Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Will this tweet hit 100K likes?"
                    className="focus:ring-brand-primary/20 h-12 rounded-xl border-0 bg-[#F7F9F9] text-sm transition-all focus:bg-white focus:ring-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#536471] uppercase">
                  <Clock className="size-3.5" />
                  Prediction Duration
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {durations.map(dur => (
                      <Button
                        key={dur.id}
                        type="button"
                        variant="outline"
                        onClick={() => field.onChange(dur.id)}
                        className={cn(
                          'rounded-full px-4 py-2 text-xs font-bold transition-all',
                          selectedDuration === dur.id
                            ? 'bg-[#0F1419] text-white hover:bg-[#0F1419] hover:text-white'
                            : 'bg-[#F7F9F9] text-[#536471] hover:bg-[#F7F9F9] hover:text-[#536471]'
                        )}
                      >
                        {dur.label}
                      </Button>
                    ))}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isCreating}
            className="h-11 w-full cursor-pointer rounded-xl bg-black/90 font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-black/80"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Launch</span>
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
