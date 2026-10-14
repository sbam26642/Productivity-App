export type Id = string;

export interface KanbanTask {
  id: Id;
  title: string;
  description?: string;
  labels: string[];
}

export interface KanbanColumn {
  id: Id;
  title: string;
  taskIds: Id[];
}

export interface TodoItem {
  id: Id;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface CalendarEvent {
  id: Id;
  title: string;
  date: string;
  time?: string;
}

export interface KanbanState {
  columns: KanbanColumn[];
  tasks: Record<Id, KanbanTask>;
}

export interface AppData {
  version: number;
  kanban: KanbanState;
  todos: TodoItem[];
  calendar: CalendarEvent[];
}
