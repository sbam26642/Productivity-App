import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from "../services/data.service";

type Filter = "all" | "open" | "done";

@Component({
  selector: "app-todo-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./todo-list.component.html",
})
export class TodoListComponent {
  private readonly dataService = inject(DataService);
  readonly data = this.dataService.data;
  readonly filter = signal<Filter>("all");
  readonly todos = computed(() => {
    const items = this.data().todos;
    if (this.filter() === "open") return items.filter((todo) => !todo.completed);
    if (this.filter() === "done") return items.filter((todo) => todo.completed);
    return items;
  });

  newTitle = "";
  newDueDate = "";

  addTodo() {
    if (!this.newTitle.trim()) return;
    this.dataService.addTodo(this.newTitle.trim(), this.newDueDate || undefined);
    this.newTitle = "";
    this.newDueDate = "";
  }

  toggle(todoId: string) {
    this.dataService.toggleTodo(todoId);
  }

  remove(todoId: string) {
    this.dataService.deleteTodo(todoId);
  }
}
