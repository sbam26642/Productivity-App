import { Injectable, computed, signal } from "@angular/core";
import { AppData, CalendarEvent, KanbanColumn, KanbanState, KanbanTask, TodoItem } from "../models";
import { StorageService } from "./storage.service";

const STORAGE_KEY = "studioflow_data_v1";

const defaultData = (): AppData => ({
  version: 1,
  kanban: {
    columns: [
      { id: "col-backlog", title: "Backlog", taskIds: [] },
      { id: "col-focus", title: "Focus", taskIds: [] },
      { id: "col-review", title: "Review", taskIds: [] },
      { id: "col-done", title: "Done", taskIds: [] },
    ],
    tasks: {},
  },
  todos: [],
  calendar: [],
});

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 10)}`;
};

@Injectable({ providedIn: "root" })
export class DataService {
  private readonly state = signal<AppData>(defaultData());
  readonly data = computed(() => this.state());

  constructor(private readonly storage: StorageService) {
    const stored = this.storage.read<AppData>(STORAGE_KEY);
    if (stored && stored.version === 1) {
      this.state.set(stored);
    }
  }

  private persist(next: AppData) {
    this.storage.write(STORAGE_KEY, next);
  }

  updateKanbanColumnTitle(columnId: string, title: string) {
    this.state.update((current) => {
      const columns = current.kanban.columns.map((col) =>
        col.id === columnId ? { ...col, title } : col
      );
      const next = { ...current, kanban: { ...current.kanban, columns } };
      this.persist(next);
      return next;
    });
  }

  addKanbanTask(columnId: string, title: string) {
    const id = createId();
    const task: KanbanTask = { id, title, labels: [] };
    this.state.update((current) => {
      const kanban = current.kanban;
      const tasks = { ...kanban.tasks, [id]: task };
      const columns = kanban.columns.map((col) =>
        col.id === columnId ? { ...col, taskIds: [id, ...col.taskIds] } : col
      );
      const next = { ...current, kanban: { columns, tasks } };
      this.persist(next);
      return next;
    });
  }

  moveKanbanTask(prevColumnId: string, nextColumnId: string, taskId: string, nextIndex: number) {
    this.state.update((current) => {
      const columns = current.kanban.columns.map((col) => {
        if (col.id === prevColumnId) {
          return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
        }
        if (col.id === nextColumnId) {
          const nextIds = [...col.taskIds];
          nextIds.splice(nextIndex, 0, taskId);
          return { ...col, taskIds: nextIds };
        }
        return col;
      });
      const next = { ...current, kanban: { ...current.kanban, columns } };
      this.persist(next);
      return next;
    });
  }

  deleteKanbanTask(taskId: string) {
    this.state.update((current) => {
      const { [taskId]: _, ...rest } = current.kanban.tasks;
      const columns = current.kanban.columns.map((col) => ({
        ...col,
        taskIds: col.taskIds.filter((id) => id !== taskId),
      }));
      const next = { ...current, kanban: { ...current.kanban, tasks: rest, columns } };
      this.persist(next);
      return next;
    });
  }

  addTodo(title: string, dueDate?: string) {
    const todo: TodoItem = { id: createId(), title, completed: false, dueDate };
    this.state.update((current) => {
      const next = { ...current, todos: [todo, ...current.todos] };
      this.persist(next);
      return next;
    });
  }

  toggleTodo(todoId: string) {
    this.state.update((current) => {
      const todos = current.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
      const next = { ...current, todos };
      this.persist(next);
      return next;
    });
  }

  deleteTodo(todoId: string) {
    this.state.update((current) => {
      const todos = current.todos.filter((todo) => todo.id !== todoId);
      const next = { ...current, todos };
      this.persist(next);
      return next;
    });
  }

  updateTodo(todoId: string, patch: Partial<TodoItem>) {
    this.state.update((current) => {
      const todos = current.todos.map((todo) =>
        todo.id === todoId ? { ...todo, ...patch } : todo
      );
      const next = { ...current, todos };
      this.persist(next);
      return next;
    });
  }

  addCalendarEvent(title: string, date: string, time?: string) {
    const event: CalendarEvent = { id: createId(), title, date, time };
    this.state.update((current) => {
      const next = { ...current, calendar: [event, ...current.calendar] };
      this.persist(next);
      return next;
    });
  }

  moveCalendarEvent(eventId: string, date: string) {
    this.state.update((current) => {
      const calendar = current.calendar.map((event) =>
        event.id === eventId ? { ...event, date } : event
      );
      const next = { ...current, calendar };
      this.persist(next);
      return next;
    });
  }

  deleteCalendarEvent(eventId: string) {
    this.state.update((current) => {
      const calendar = current.calendar.filter((event) => event.id !== eventId);
      const next = { ...current, calendar };
      this.persist(next);
      return next;
    });
  }

  seedDemo() {
    const kanban: KanbanState = {
      columns: [
        { id: "col-backlog", title: "Backlog", taskIds: ["t1", "t2"] },
        { id: "col-focus", title: "Focus", taskIds: ["t3"] },
        { id: "col-review", title: "Review", taskIds: [] },
        { id: "col-done", title: "Done", taskIds: ["t4"] },
      ],
      tasks: {
        t1: { id: "t1", title: "Outline onboarding flow", labels: ["UX"] },
        t2: { id: "t2", title: "Audit tracking events", labels: ["Ops"] },
        t3: { id: "t3", title: "Draft Q1 roadmap", labels: ["Strategy"] },
        t4: { id: "t4", title: "Ship typography pass", labels: ["Design"] },
      },
    };

    const todos: TodoItem[] = [
      { id: "td1", title: "Email investor update", completed: false, dueDate: this.todayPlus(1) },
      { id: "td2", title: "Prep design review", completed: false, dueDate: this.todayPlus(3) },
      { id: "td3", title: "Schedule 1:1s", completed: true, dueDate: this.todayPlus(-1) },
    ];

    const calendar: CalendarEvent[] = [
      { id: "ev1", title: "Studio check-in", date: this.todayPlus(0), time: "10:30" },
      { id: "ev2", title: "Sprint retro", date: this.todayPlus(2), time: "15:00" },
      { id: "ev3", title: "Client review", date: this.todayPlus(5), time: "09:00" },
    ];

    const next: AppData = { version: 1, kanban, todos, calendar };
    this.state.set(next);
    this.persist(next);
  }

  private todayPlus(offset: number) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }
}
