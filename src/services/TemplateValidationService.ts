export interface ValidationResult {
  isValid: boolean;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

export interface Employee {
  id: string;
  name: string;
  assignedTemplate?: string;
  currentWeekShifts: Shift[];
}

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  dayOfWeek: string;
}

export interface JobTemplate {
  id: string;
  name: string;
  category: 'student' | 'partial' | 'full-time' | 'special';
  description: string;
  
  // Basic constraints
  maxShiftsPerWeek: number;
  maxHoursPerShift: number;
  minHoursPerShift: number;
  weeklyHoursLimit: number;
  
  // Day restrictions
  allowedDays: string[];
  forbiddenDays: string[];
  isFlexible: boolean;
  
  // Advanced rules
  maxConsecutiveDays: number;
  minRestBetweenShifts: number;
  canWorkWeekends: boolean;
  canWorkNights: boolean;
  
  // Preferences
  preferredTimeSlots: string[];
  canWorkOvertime: boolean;
  emergencyAvailable: boolean;
  
  // System
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  assignedEmployees: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface ShiftSuggestion {
  day: string;
  timeSlot: TimeSlot;
  score: number;
  reason: string;
}

export class TemplateValidationService {
  static validateShiftAssignment(
    employee: Employee, 
    newShift: Shift, 
    template: JobTemplate
  ): ValidationResult[] {
    const violations: ValidationResult[] = [];
    
    console.log('🔍 Validating shift assignment:', {
      employee: employee.name,
      shift: newShift,
      template: template.name
    });
    
    // Check max shifts per week
    const weeklyShifts = employee.currentWeekShifts.length;
    if (weeklyShifts >= template.maxShiftsPerWeek) {
      violations.push({
        isValid: false,
        severity: 'error',
        message: `${employee.name} has reached maximum shifts per week (${template.maxShiftsPerWeek})`,
        suggestion: `Consider reducing shifts or changing template limits`
      });
    }
    
    // Check shift duration limits
    if (newShift.duration > template.maxHoursPerShift) {
      violations.push({
        isValid: false,
        severity: 'error',
        message: `Shift duration (${newShift.duration}h) exceeds template limit (${template.maxHoursPerShift}h)`,
        suggestion: `Split into shorter shifts or adjust template`
      });
    }
    
    if (newShift.duration < template.minHoursPerShift) {
      violations.push({
        isValid: false,
        severity: 'warning',
        message: `Shift duration (${newShift.duration}h) is below minimum (${template.minHoursPerShift}h)`,
        suggestion: `Extend shift or combine with another shift`
      });
    }
    
    // Check allowed days
    if (!template.allowedDays.includes(newShift.dayOfWeek)) {
      violations.push({
        isValid: false,
        severity: 'error',
        message: `${newShift.dayOfWeek} is not an allowed work day for this template`,
        suggestion: `Choose from allowed days: ${template.allowedDays.join(', ')}`
      });
    }
    
    // Check forbidden days
    if (template.forbiddenDays.includes(newShift.dayOfWeek)) {
      violations.push({
        isValid: false,
        severity: 'error',
        message: `${newShift.dayOfWeek} is forbidden for this template`,
        suggestion: `Avoid forbidden days: ${template.forbiddenDays.join(', ')}`
      });
    }
    
    // Check weekly hours limit
    const totalWeeklyHours = employee.currentWeekShifts.reduce((sum, shift) => sum + shift.duration, 0);
    if (totalWeeklyHours + newShift.duration > template.weeklyHoursLimit) {
      violations.push({
        isValid: false,
        severity: 'error',
        message: `Adding this shift would exceed weekly hours limit (${template.weeklyHoursLimit}h)`,
        suggestion: `Current: ${totalWeeklyHours}h + New: ${newShift.duration}h = ${totalWeeklyHours + newShift.duration}h`
      });
    }
    
    // Check consecutive days
    const consecutiveDays = this.calculateConsecutiveDays(employee.currentWeekShifts, newShift);
    if (consecutiveDays > template.maxConsecutiveDays) {
      violations.push({
        isValid: false,
        severity: 'warning',
        message: `Would result in ${consecutiveDays} consecutive work days (limit: ${template.maxConsecutiveDays})`,
        suggestion: `Add rest day or adjust schedule`
      });
    }
    
    // Check rest between shifts
    const restViolation = this.checkRestBetweenShifts(employee.currentWeekShifts, newShift, template.minRestBetweenShifts);
    if (restViolation) {
      violations.push(restViolation);
    }
    
    console.log('✅ Validation complete:', violations.length, 'violations found');
    return violations;
  }
  
  static generateSmartSuggestions(
    employee: Employee,
    template: JobTemplate,
    weekSchedule: Shift[]
  ): ShiftSuggestion[] {
    const suggestions: ShiftSuggestion[] = [];
    
    console.log('🧠 Generating smart suggestions for:', employee.name);
    
    // Find optimal shift times based on template preferences
    for (const day of template.allowedDays) {
      const availableSlots = this.findAvailableTimeSlots(day, weekSchedule);
      
      for (const slot of availableSlots) {
        const score = this.calculateShiftScore(slot, employee, template);
        suggestions.push({
          day,
          timeSlot: slot,
          score,
          reason: this.generateSuggestionReason(slot, template)
        });
      }
    }
    
    // Sort by score (highest first)
    const sortedSuggestions = suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
    console.log('💡 Generated', sortedSuggestions.length, 'suggestions');
    
    return sortedSuggestions;
  }
  
  private static calculateConsecutiveDays(currentShifts: Shift[], newShift: Shift): number {
    // Get all shift dates including the new one
    const allDates = [...currentShifts.map(s => s.date), newShift.date]
      .map(date => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    let maxConsecutive = 1;
    let currentConsecutive = 1;
    
    for (let i = 1; i < allDates.length; i++) {
      const prevDate = allDates[i - 1];
      const currentDate = allDates[i];
      const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 1;
      }
    }
    
    return maxConsecutive;
  }
  
  private static checkRestBetweenShifts(
    currentShifts: Shift[], 
    newShift: Shift, 
    minRestHours: number
  ): ValidationResult | null {
    const newShiftStart = new Date(`${newShift.date}T${newShift.startTime}`);
    const newShiftEnd = new Date(`${newShift.date}T${newShift.endTime}`);
    
    for (const shift of currentShifts) {
      const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
      const shiftEnd = new Date(`${shift.date}T${shift.endTime}`);
      
      // Check rest before new shift
      const restBefore = Math.abs(newShiftStart.getTime() - shiftEnd.getTime()) / (1000 * 60 * 60);
      if (restBefore < minRestHours && restBefore > 0) {
        return {
          isValid: false,
          severity: 'warning',
          message: `Only ${Math.round(restBefore)}h rest between shifts (minimum: ${minRestHours}h)`,
          suggestion: `Adjust shift times to ensure adequate rest`
        };
      }
      
      // Check rest after new shift
      const restAfter = Math.abs(shiftStart.getTime() - newShiftEnd.getTime()) / (1000 * 60 * 60);
      if (restAfter < minRestHours && restAfter > 0) {
        return {
          isValid: false,
          severity: 'warning',
          message: `Only ${Math.round(restAfter)}h rest after shift (minimum: ${minRestHours}h)`,
          suggestion: `Adjust shift times to ensure adequate rest`
        };
      }
    }
    
    return null;
  }
  
  private static findAvailableTimeSlots(day: string, weekSchedule: Shift[]): TimeSlot[] {
    // Mock implementation - in real app, this would analyze existing schedule
    const timeSlots: TimeSlot[] = [
      { startTime: '09:00', endTime: '17:00', duration: 8, period: 'morning' },
      { startTime: '13:00', endTime: '21:00', duration: 8, period: 'afternoon' },
      { startTime: '17:00', endTime: '01:00', duration: 8, period: 'evening' },
      { startTime: '23:00', endTime: '07:00', duration: 8, period: 'night' }
    ];
    
    // Filter out conflicting slots based on existing schedule
    return timeSlots.filter(slot => {
      const dayShifts = weekSchedule.filter(shift => 
        new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' }) === day
      );
      
      // Simple conflict check - in real app, this would be more sophisticated
      return !dayShifts.some(shift => 
        (slot.startTime >= shift.startTime && slot.startTime < shift.endTime) ||
        (slot.endTime > shift.startTime && slot.endTime <= shift.endTime)
      );
    });
  }
  
  private static calculateShiftScore(
    slot: TimeSlot, 
    employee: Employee, 
    template: JobTemplate
  ): number {
    let score = 100;
    
    // Boost score for preferred time slots
    if (template.preferredTimeSlots.includes(slot.period)) {
      score += 30;
    }
    
    // Reduce score for overtime
    if (slot.duration > template.maxHoursPerShift && !template.canWorkOvertime) {
      score -= 50;
    }
    
    // Boost score for flexibility match
    if (template.isFlexible) {
      score += 20;
    }
    
    // Reduce score for night shifts if not allowed
    if (slot.period === 'night' && !template.canWorkNights) {
      score -= 40;
    }
    
    // Boost score for optimal duration
    if (slot.duration >= template.minHoursPerShift && slot.duration <= template.maxHoursPerShift) {
      score += 25;
    }
    
    return Math.max(0, score);
  }
  
  private static generateSuggestionReason(slot: TimeSlot, template: JobTemplate): string {
    const reasons: string[] = [];
    
    if (template.preferredTimeSlots.includes(slot.period)) {
      reasons.push('Matches preferred time slot');
    }
    
    if (slot.duration >= template.minHoursPerShift && slot.duration <= template.maxHoursPerShift) {
      reasons.push('Optimal shift duration');
    }
    
    if (template.isFlexible) {
      reasons.push('Flexible scheduling allowed');
    }
    
    if (slot.period !== 'night' || template.canWorkNights) {
      reasons.push('Compatible with work restrictions');
    }
    
    return reasons.join(', ') || 'Available slot';
  }
  
  // Helper method to get template by ID
  static getTemplateById(templateId: string, templates: JobTemplate[]): JobTemplate | null {
    return templates.find(t => t.id === templateId) || null;
  }
  
  // Helper method to check if employee can work on specific day
  static canEmployeeWorkOnDay(employee: Employee, day: string, template: JobTemplate): boolean {
    if (!template) return true;
    
    // Check allowed days
    if (template.allowedDays.length > 0 && !template.allowedDays.includes(day)) {
      return false;
    }
    
    // Check forbidden days
    if (template.forbiddenDays.includes(day)) {
      return false;
    }
    
    // Check weekend restrictions
    const isWeekend = ['Friday', 'Saturday'].includes(day);
    if (isWeekend && !template.canWorkWeekends) {
      return false;
    }
    
    return true;
  }
  
  // Helper method to calculate total weekly hours for employee
  static calculateWeeklyHours(employee: Employee): number {
    return employee.currentWeekShifts.reduce((sum, shift) => sum + shift.duration, 0);
  }
  
  // Helper method to check if employee has reached weekly limit
  static hasReachedWeeklyLimit(employee: Employee, template: JobTemplate): boolean {
    const currentHours = this.calculateWeeklyHours(employee);
    return currentHours >= template.weeklyHoursLimit;
  }
  
  // Helper method to get remaining hours for the week
  static getRemainingWeeklyHours(employee: Employee, template: JobTemplate): number {
    const currentHours = this.calculateWeeklyHours(employee);
    return Math.max(0, template.weeklyHoursLimit - currentHours);
  }
}