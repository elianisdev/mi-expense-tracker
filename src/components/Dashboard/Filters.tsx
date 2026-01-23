import { CATEGORIES } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface FiltersProps {
  startDate: string;
  endDate: string;
  category: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}

export function Filters({
  startDate,
  endDate,
  category,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onReset,
}: FiltersProps) {
  const hasActiveFilters = startDate || endDate || category;

  return (
    <Card className="p-4 shadow-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-2">
          <Label htmlFor="startDate" className="text-sm font-semibold">From Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white"
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <Label htmlFor="endDate" className="text-sm font-semibold">To Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white"
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={onReset}
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}
      </div>
    </Card>
  );
}
