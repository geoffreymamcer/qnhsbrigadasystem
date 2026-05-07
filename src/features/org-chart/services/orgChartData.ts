import { OrgChartData } from "../types";

export const BRIGADA_DATA: OrgChartData = {
  principal: {
    name: "Joseph Hinanay",
    role: "School Principal",
  },
  coordinator: {
    name: "Jelanie Orina",
    role: "Brigada Eskwela Coordinator",
  },
  committees: [
    {
      name: "ADVOCACY AND MARKETING COMMITTEE",
      head: "Arlen P. Baldovino",
      subHeads: [
        { name: "Cynthia L. Rustia", role: "Member" },
        { name: "Kristine A. Vital", role: "Member" },
        { name: "Christian M. Tiera", role: "Member" },
      ],
    },
    {
      name: "RESOURCE MOBILIZATION COMMITTEE",
      head: "Shane S. Leynes",
      subHeads: [
        { name: "Josephine Soriano", role: "Member" },
        { name: "Arnel S. Besas", role: "Member" },
        { name: "Jose Ronnel R. Reyes", role: "Member" },
        { name: "Jesusa Gomez", role: "Member" },
        { name: "Rose Ann V. Dudas", role: "Member" },
        { name: "Haide Janeth Linsasagin", role: "Member" },
        { name: "Lucia Cosico Agapay", role: "Member" },
        { name: "Maevilyn M. Macinas", role: "Member" },
      ],
    },
    {
      name: "PROGRAM IMPLEMENTATION COMMITTEE",
      head: "Maria Teresa J. Macatangay",
      gradeHeads: [
        { name: "Maria Teresa J. Macatangay", role: "Grade 7 Head" },
        { name: "Victoria B. Castillo", role: "Grade 8 Head" },
        { name: "Ronel L. Maraig", role: "Grade 9 Head" },
        { name: "Art Angelo A. Enelo", role: "Grade 10 Head" },
        { name: "Richan S. Santiago", role: "Grade 11 Head" },
        { name: "Wins Dela Cruz", role: "Grade 12 Head" },
      ],
      subHeads: [
        { name: "Maria Paula Q. Catahumber", role: "Member" },
        { name: "Mary Joy A. Cuevas", role: "Member" },
        { name: "Nap John Paul R. Opinion", role: "Member" },
        { name: "Lea N. Templonuevo", role: "Member" },
        { name: "Catherine S. Seño", role: "Member" },
        { name: "Joemar Zabala", role: "Member" },
      ],
    },
    {
      name: "FINANCE AND ADMINISTRATION COMMITTEE",
      head: "Kristine Joy A. Morjia",
      subHeads: [
        { name: "Jexcel Capaning", role: "Member" },
        { name: "Edward P. Espina", role: "Member" },
        { name: "Shielamarie E. Arce", role: "Member" },
        { name: "Kiem Sarah S. Alacantara", role: "Member" },
        { name: "Schenley Anne R. Sabacco", role: "Member" },
      ],
    },
    {
      name: "DOCUMENTATION COMMITTEE",
      head: "Michael T. Leynes",
      subHeads: [
        { name: "Yvonne Charisse B. Gamis", role: "Member" },
        { name: "Eloisa Joy F. Ramento", role: "Member" },
        { name: "Mignonette M. Oblefias", role: "Member" },
        { name: "Maria Abigail P. Lopena", role: "Member" },
      ],
    },
    {
      name: "SCHOOL PHYSICAL FACILITIES CURRICULAR",
      head: "Edwin G. Signo Jr",
      subHeads: [
        { name: "Roland John P. Himor", role: "Member" },
        { name: "John Paulo A. Amandy", role: "Member" },
        { name: "John Mark A. Macatangay", role: "Member" },
        { name: "Jason M. Medua", role: "Member" },
        { name: "Renz Marlon Aliento", role: "Member" },
        { name: "Ogie Achilles D. Testa", role: "Member" },
      ],
    },
  ],
};
