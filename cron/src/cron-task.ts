import { findEmpOfDay, findEmpOfWeek, findEmpOfMonth } from "./cron-function";
import { CronTask } from "./types/cron";

export const cronTasks: CronTask[] = [
    {
        name: 'EMP_OF_DAY',
        schedule:  "*/3 * * * * *", //run every day at 7 PM, except on weekends and holidays
        runFunc: findEmpOfDay
    },
    {
        name: 'EMP_OF_WEEK',
        schedule: "*/6 * * * * *", //run every Monday of week
        runFunc: findEmpOfWeek
    },
    {
        name: 'EMP_OF_MONTH',
        schedule: "*/9 * * * * *", //run on the first day of each month
        runFunc: findEmpOfMonth
    }
]

// export const cronTasks: CronTask[] = [
//     {
//         name: 'EMP_OF_DAY',
//         schedule:  "0 19 * * 1-5", //run every day at 7 PM, except on weekends and holidays
//         runFunc: findEmpOfDay
//     },
//     {
//         name: 'EMP_OF_WEEK',
//         schedule: "0 0 * * 1", //run every Monday of week
//         runFunc: findEmpOfWeek
//     },
//     {
//         name: 'EMP_OF_MONTH',
//         schedule: "0 0 1 * *", //run on the first day of each month
//         runFunc: findEmpOfMonth
//     }
// ]