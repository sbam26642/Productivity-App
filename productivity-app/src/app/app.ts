import { Component } from "@angular/core";
import { KanbanBoardComponent } from "./components/kanban-board.component";
import { TodoListComponent } from "./components/todo-list.component";
import { CalendarComponent } from "./components/calendar.component";

@Component({
  selector: 'app-root',
  imports: [KanbanBoardComponent, TodoListComponent, CalendarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
