import { Component, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CdkDrag, CdkDropList, CdkDropListGroup, CdkDragDrop } from "@angular/cdk/drag-drop";
import { FormsModule } from "@angular/forms";
import { DataService } from "../services/data.service";
import { KanbanColumn, KanbanTask } from "../models";

@Component({
  selector: "app-kanban-board",
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDropListGroup, CdkDrag],
  templateUrl: "./kanban-board.component.html",
})
export class KanbanBoardComponent {
  private readonly dataService = inject(DataService);
  readonly data = this.dataService.data;
  readonly columns = computed(() => this.data().kanban.columns);
  readonly tasks = computed(() => this.data().kanban.tasks);

  newTaskTitle: Record<string, string> = {};

  taskFor(column: KanbanColumn) {
    return column.taskIds.map((id) => this.tasks()[id]).filter(Boolean) as KanbanTask[];
  }

  drop(event: CdkDragDrop<KanbanTask[]>, column: KanbanColumn) {
    const taskId = event.item.data as string;
    const prevColumnId = event.previousContainer.id;
    const nextColumnId = column.id;
    const nextIndex = event.currentIndex;
    this.dataService.moveKanbanTask(prevColumnId, nextColumnId, taskId, nextIndex);
  }

  addTask(columnId: string) {
    const title = this.newTaskTitle[columnId]?.trim();
    if (!title) return;
    this.dataService.addKanbanTask(columnId, title);
    this.newTaskTitle = { ...this.newTaskTitle, [columnId]: "" };
  }

  seedDemo() {
    this.dataService.seedDemo();
  }

  deleteTask(taskId: string) {
    this.dataService.deleteKanbanTask(taskId);
  }
}
