// Define a type for the function signature of the runFunc
export type CronFunction = () => void;

// Define an interface for the cron task
export interface CronTask {
    name: string;
    schedule: string;
    runFunc: CronFunction;
}