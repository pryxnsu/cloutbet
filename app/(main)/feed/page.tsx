'use client';

import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePrediction } from '@/hooks/use-prediction';
import AddPost from '@/components/AddPrediction';
import ErrorUI from '@/components/ErrorUI';
import Loader from '@/components/Loader';
import useDialog from '@/hooks/use-dialog';
import PredictionCard from '@/components/PredictionCard';

export default function Page() {
  const dialog = useDialog();

  const { isInitialLoad, isLoading, error, predictions, fetchData, hasMore, submitBet, updatePredictions, loadMore } =
    usePrediction();

  return (
    <div className="relative min-h-screen overflow-hidden pb-10">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="border-b py-5">
          <div className="flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">Predictions</h1>
              <p className="max-w-md text-zinc-500">Bet on tweets. Predict viral moments. Earn clout.</p>
            </div>

            <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
              <DialogTrigger asChild>
                <Button className="group h-10 gap-2 rounded-xl bg-zinc-900 px-6 font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]">
                  <Plus className="size-4 transition-transform group-hover:rotate-90" />
                </Button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-md">
                <DialogTitle className="sr-only">Create New Prediction</DialogTitle>
                <DialogDescription className="sr-only">
                  Create a new prediction and let others bet on it.
                </DialogDescription>
                <div className="rounded-xl border border-zinc-100 bg-white shadow-2xl">
                  <AddPost onSuccess={dialog.close} updatePredictions={updatePredictions} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col divide-y">
          {isInitialLoad && <Loader />}

          {error && <ErrorUI error={error} refresh={fetchData} />}

          {!isInitialLoad && !error && predictions.length === 0 && (
            <div className="text-center text-zinc-500">No predictions yet</div>
          )}

          {!error && predictions.map(p => <PredictionCard key={p.id} {...p} onBet={submitBet} />)}
        </div>

        {predictions.length > 0 && hasMore && (
          <div className="mt-16 text-center">
            <Button
              onClick={loadMore}
              variant={'outline'}
              className="border-border text-foreground h-11 cursor-pointer rounded-lg border px-8 text-sm font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'View more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
