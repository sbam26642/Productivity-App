import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CdkDrag, CdkDropList, CdkDropListGroup, CdkDragDrop } from "@angular/cdk/drag-drop";
import { DataService } from "../services/data.service";
import { CalendarEvent } from "../models";

interface CalendarDay {
  date: string;
  label: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDropList, CdkDropListGroup, CdkDrag],
  templateUrl: "./calendar.component.html",
})
export class CalendarComponent {
  private readonly dataService = inject(DataService);
  readonly data = this.dataService.data;
  readonly month = signal(new Date());
  readonly today = new Date().toISOString().slice(0, 10);

  readonly eventsByDate = computed(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of this.data().calendar) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  });

  readonly days = computed(() => this.buildCalendar(this.month()));

  newTitle = "";
  newDate = this.today;
  newTime = "09:00";

  previousMonth() {
    const current = this.month();
    this.month.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.month();
    this.month.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  setToday() {
    const now = new Date();
    this.month.set(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  addEvent() {
    if (!this.newTitle.trim() || !this.newDate) return;
    this.dataService.addCalendarEvent(this.newTitle.trim(), this.newDate, this.newTime || undefined);
    this.newTitle = "";
  }

  drop(event: CdkDragDrop<CalendarEvent[]>, day: CalendarDay) {
    const eventId = event.item.data as string;
    this.dataService.moveCalendarEvent(eventId, day.date);
  }

  eventsFor(date: string) {
    return this.eventsByDate().get(date) ?? [];
  }

  remove(eventId: string) {
    this.dataService.deleteCalendarEvent(eventId);
  }

  private buildCalendar(month: Date): CalendarDay[] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const startDay = new Date(firstDay);
    const startOffset = (firstDay.getDay() + 6) % 7;
    startDay.setDate(firstDay.getDate() - startOffset);

    const days: CalendarDay[] = [];
    for (let i = 0; i < 42; i += 1) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      const iso = date.toISOString().slice(0, 10);
      days.push({
        date: iso,
        label: date.getDate(),
        isCurrentMonth: date.getMonth() === monthIndex,
        isToday: iso === this.today,
      });
    }
    return days;
  }
}
