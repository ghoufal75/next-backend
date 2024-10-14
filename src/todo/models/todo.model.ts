enum Priority{
    high='high',
    low='low',
    medium='medium'
}

export interface Todo{
    id: number,
    title: string,
    completed: boolean,
    priority: Priority
}