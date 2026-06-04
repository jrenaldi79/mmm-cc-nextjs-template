import { Trash2 } from 'lucide-react';
import type { Task } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

function getPriorityClasses(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-1">
        <p
          className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
        >
          {task.title}
        </p>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(task.created_at).toLocaleDateString()}
        </p>
      </div>
      <Badge variant="outline" className={getPriorityClasses(task.priority)}>
        {task.priority}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        aria-label={`Delete "${task.title}"`}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
