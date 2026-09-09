import React, { useState } from 'react';
import DepartmentsTab from '../components/academics/DepartmentsTab';
import CoursesTab from '../components/academics/CoursesTab';
import SubjectsTab from '../components/academics/SubjectsTab';
import ClassSectionsTab from '../components/academics/ClassSectionsTab';
import AcademicYearsTab from '../components/academics/AcademicYearsTab';
import SemestersTab from '../components/academics/SemestersTab';

const TABS = [
  { key: 'departments', label: 'Departments', Component: DepartmentsTab },
  { key: 'courses', label: 'Courses', Component: CoursesTab },
  { key: 'subjects', label: 'Subjects', Component: SubjectsTab },
  { key: 'class-sections', label: 'Class Sections', Component: ClassSectionsTab },
  { key: 'academic-years', label: 'Academic Years', Component: AcademicYearsTab },
  { key: 'semesters', label: 'Semesters', Component: SemestersTab },
];

export default function AcademicsPage() {
  const [active, setActive] = useState('departments');
  const ActiveComponent = TABS.find((t) => t.key === active)?.Component;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Academics</h1>
        <p className="text-sm text-gray-500">Manage departments, courses, subjects and class structure.</p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.key
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
}
