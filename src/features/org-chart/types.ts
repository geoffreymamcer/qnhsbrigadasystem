export type GradeLevel = 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';

export type CommitteeMember = {
  name: string;
  role: string;
  grade?: GradeLevel;
};

export type Committee = {
  name: string;
  head: string;
  gradeHeads?: CommitteeMember[];
  subHeads?: CommitteeMember[];
};

export type OrgChartData = {
  principal: {
    name: string;
    role: string;
  };
  coordinator: {
    name: string;
    role: string;
  };
  committees: Committee[];
};
