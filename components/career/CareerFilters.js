import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function CareerFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Filters:</span>
      </div>
      
      <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Industry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Industries</SelectItem>
          <SelectItem value="Technology">Technology</SelectItem>
          <SelectItem value="Healthcare">Healthcare</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="Education">Education</SelectItem>
          <SelectItem value="Marketing">Marketing</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.outlook} onValueChange={(value) => handleFilterChange('outlook', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Job Outlook" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Outlooks</SelectItem>
          <SelectItem value="rapidly_growing">Rapidly Growing</SelectItem>
          <SelectItem value="growing">Growing</SelectItem>
          <SelectItem value="stable">Stable</SelectItem>
          <SelectItem value="declining">Declining</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="entry_level">Entry Level</SelectItem>
          <SelectItem value="experienced">Experienced</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}