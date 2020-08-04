export interface ReminderSettings {
    title: string,
    description?: string,
    priority: 'low' | 'high',
    daysgap: number,
    timegap: string,
    daysselected: any,
    timeselected: any
}