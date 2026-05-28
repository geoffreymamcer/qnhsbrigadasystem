"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/utils";
import { 
  Search, Filter, Plus, FileDown, Trash2, Pencil, 
  Check, ClipboardList, AlertCircle, Loader2 
} from "lucide-react";
import { FacilityNeed } from "../types";
import { generateFacilityNeedsPDF } from "../utils/facility-needs-pdf";
import { FacilityNeedModal } from "./FacilityNeedModal";
import { motion, AnimatePresence } from "framer-motion";
import { createFacilityNeed, deleteFacilityNeed, updateFacilityNeed } from "../services/reports";

const DEFAULT_FACILITY_NEEDS: FacilityNeed[] = [
  {
    id: "FN-001",
    facility_name: "Roofs/Gutters",
    condition: "unsatisfactory",
    remarks: "Clogged and rusting gutters on Building A.",
    improvement_needed: "Cleaning and patching leaks or replacement.",
    materials_needed: "2 gallons roof sealant, vulcanizing tape",
    manpower_needed: "2 volunteers, school janitor",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-002",
    facility_name: "Ceilings",
    condition: "unsatisfactory",
    remarks: "Water-damaged plywood sagging in Grade 7 hallway.",
    improvement_needed: "Removal of damaged sheets and replacement.",
    materials_needed: "2 sheets of 1/4 plywood, ceiling nails, white paint",
    manpower_needed: "1 carpenter, 1 painter",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-003",
    facility_name: "Walls",
    condition: "satisfactory",
    remarks: "Structurally sound. Needs light washing.",
    improvement_needed: "Minor cleaning/washing.",
    materials_needed: "Liquid detergent, scrub brushes",
    manpower_needed: "3 volunteer parents",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-004",
    facility_name: "Blackboards",
    condition: "satisfactory",
    remarks: "Usable condition.",
    improvement_needed: "None.",
    materials_needed: "None",
    manpower_needed: "None",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-005",
    facility_name: "Chairs/desks/tables",
    condition: "unsatisfactory",
    remarks: "15 armchairs have broken armrests/legs.",
    improvement_needed: "Welding of metal parts and woodwork replacement.",
    materials_needed: "Plywood pieces, welding rods, wood glue",
    manpower_needed: "1 welder, 1 carpenter",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-006",
    facility_name: "Water facilities",
    condition: "unsatisfactory",
    remarks: "Low water pressure; leak in the main intake pipe.",
    improvement_needed: "Locate and repair pipe leak.",
    materials_needed: "1 roll Teflon tape, PVC cement, 2m PVC pipe (1/2 inch)",
    manpower_needed: "1 plumber",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-007",
    facility_name: "Drainage System",
    condition: "unsatisfactory",
    remarks: "Accumulated silt and plastic bottles blocking flow.",
    improvement_needed: "Declogging and clearing of open drainage channels.",
    materials_needed: "Shovels, trash bags, utility gloves",
    manpower_needed: "5 volunteers",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-008",
    facility_name: "Signages",
    condition: "satisfactory",
    remarks: "Visible but needs paint touch-ups.",
    improvement_needed: "Repainting lettering.",
    materials_needed: "Small cans of paint (black, yellow)",
    manpower_needed: "1 volunteer artist",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-009",
    facility_name: "School garden",
    condition: "satisfactory",
    remarks: "Plants are thriving. Needs weeding.",
    improvement_needed: "Weeding and soil conditioning.",
    materials_needed: "Organic fertilizer, garden soil",
    manpower_needed: "4 volunteer students/parents",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-010",
    facility_name: "Lighting",
    condition: "unsatisfactory",
    remarks: "Flickering bulbs in 3 classrooms.",
    improvement_needed: "Replacement of defective fluorescent tubes.",
    materials_needed: "6 LED tube lamps",
    manpower_needed: "1 electrician/maintenance staff",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-011",
    facility_name: "Windows",
    condition: "satisfactory",
    remarks: "Glass panes intact, latches working.",
    improvement_needed: "None.",
    materials_needed: "None",
    manpower_needed: "None",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-012",
    facility_name: "Doors",
    condition: "satisfactory",
    remarks: "All classroom doors are functional.",
    improvement_needed: "None.",
    materials_needed: "None",
    manpower_needed: "None",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-013",
    facility_name: "Comfort Rooms",
    condition: "unsatisfactory",
    remarks: "Flush mechanisms broken in two cubicles.",
    improvement_needed: "Repair and replacement of toilet flush components.",
    materials_needed: "2 toilet repair flush valve kits",
    manpower_needed: "1 plumber",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-014",
    facility_name: "School Grounds",
    condition: "satisfactory",
    remarks: "Clean and free of tall grass.",
    improvement_needed: "Regular lawn trimming.",
    materials_needed: "Grass cutter fuel",
    manpower_needed: "1 operator",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-015",
    facility_name: "School Canteen/Clinic",
    condition: "satisfactory",
    remarks: "Hygienic and well-ventilated.",
    improvement_needed: "None.",
    materials_needed: "None",
    manpower_needed: "None",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-016",
    facility_name: "School Fence/ wall",
    condition: "satisfactory",
    remarks: "Sturdy. Paint is slightly faded.",
    improvement_needed: "Repainting of concrete fence panels.",
    materials_needed: "5 cans green latex paint, paint rollers",
    manpower_needed: "5 volunteer parents",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-017",
    facility_name: "Electricity",
    condition: "satisfactory",
    remarks: "Power supply is stable across all buildings.",
    improvement_needed: "None.",
    materials_needed: "None",
    manpower_needed: "None",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-018",
    facility_name: "Alternative gate",
    condition: "unsatisfactory",
    remarks: "Hinges are rusted and stuck.",
    improvement_needed: "Lubrication and structural repair of gate hinges.",
    materials_needed: "WD-40 spray, welding rods, metal primer",
    manpower_needed: "1 welder",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-019",
    facility_name: "Reference Materials",
    condition: "satisfactory",
    remarks: "Sufficient textbooks in the library.",
    improvement_needed: "Organization of shelves.",
    materials_needed: "Bookends, labeling tape",
    manpower_needed: "2 volunteer librarians",
    assessment_date: "2026-05-15"
  },
  {
    id: "FN-020",
    facility_name: "Laboratory equipment",
    condition: "satisfactory",
    remarks: "Science lab tools are stored properly.",
    improvement_needed: "None.",
    materials_needed: "None",
    manpower_needed: "None",
    assessment_date: "2026-05-15"
  }
];

interface FacilityNeedsContainerProps {
  initialData: FacilityNeed[];
}

export const FacilityNeedsContainer = ({ initialData }: FacilityNeedsContainerProps) => {
  const [needs, setNeeds] = useState<FacilityNeed[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"all" | "satisfactory" | "unsatisfactory">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<FacilityNeed | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Sync state when initialData changes from Server Component
  useEffect(() => {
    setNeeds(initialData);
  }, [initialData]);

  // Filter items
  const filteredNeeds = needs.filter(need => {
    const matchesSearch = need.facility_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (need.remarks && need.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (need.improvement_needed && need.improvement_needed.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCondition = conditionFilter === "all" || need.condition === conditionFilter;
    
    return matchesSearch && matchesCondition;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this needs assessment entry?")) return;
    setIsDeleting(id);
    try {
      await deleteFacilityNeed(id);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete entry. Please check your connection and authentication.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (need: FacilityNeed) => {
    setEditingNeed(need);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingNeed(null);
    setIsModalOpen(true);
  };

  const handleSave = async (inputData: Omit<FacilityNeed, "id">) => {
    try {
      if (editingNeed) {
        // Edit mode (database update)
        await updateFacilityNeed(editingNeed.id, inputData);
      } else {
        // Add mode (database insert)
        await createFacilityNeed(inputData);
      }
      setIsModalOpen(false);
      setEditingNeed(null);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to save entry. Please ensure you are logged in and authorized.");
      throw error; // Propagate to keep the modal loading
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ClipboardList className="w-5 h-5 text-blue-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Needs Assessment</h1>
          </div>
          <p className="text-slate-500 font-medium">Physical Facilities and Maintenance Needs Assessment Form (BE Form 01)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => generateFacilityNeedsPDF(needs)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-primary text-white font-bold text-sm shadow-lg shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search facility name, remarks, or improvements..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <select 
            value={conditionFilter}
            onChange={(e: any) => setConditionFilter(e.target.value)}
            className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="all">All Conditions</option>
            <option value="satisfactory">Satisfactory</option>
            <option value="unsatisfactory">Unsatisfactory</option>
          </select>
        </div>
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th rowSpan={2} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/5">Physical Facilities</th>
                <th colSpan={2} className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-100">Condition</th>
                <th rowSpan={2} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/5">Remarks</th>
                <th rowSpan={2} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/5">Nature of Improvement Needed</th>
                <th rowSpan={2} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/5">Material Resources Needed</th>
                <th rowSpan={2} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/6">Man Power Needed</th>
                <th rowSpan={2} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center border-r border-slate-100/50">Satisfactory</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Unsatisfactory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredNeeds.map((need) => (
                  <motion.tr 
                    key={need.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900 leading-relaxed">{need.facility_name}</p>
                    </td>
                    
                    {/* Satisfactory Checkmark */}
                    <td className="px-4 py-5 border-r border-slate-50 text-center">
                      {need.condition === "satisfactory" ? (
                        <div className="inline-flex items-center justify-center p-1 bg-emerald-50 rounded-full border border-emerald-100">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      ) : (
                        <span className="text-slate-200">—</span>
                      )}
                    </td>
                    
                    {/* Unsatisfactory Checkmark */}
                    <td className="px-4 py-5 text-center">
                      {need.condition === "unsatisfactory" ? (
                        <div className="inline-flex items-center justify-center p-1 bg-rose-50 rounded-full border border-rose-100">
                          <Check className="w-3.5 h-3.5 text-rose-600" />
                        </div>
                      ) : (
                        <span className="text-slate-200">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-5 text-sm font-bold text-slate-500 italic leading-relaxed">
                      {need.remarks || "—"}
                    </td>
                    
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 leading-relaxed">
                      {need.improvement_needed || "—"}
                    </td>
                    
                    <td className="px-6 py-5 text-sm font-medium text-slate-600 leading-relaxed">
                      {need.materials_needed || "—"}
                    </td>
                    
                    <td className="px-6 py-5 text-sm font-medium text-slate-600 leading-relaxed">
                      {need.manpower_needed || "—"}
                    </td>
                    
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(need)}
                          className="p-2 text-slate-400 hover:text-blue-primary hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(need.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredNeeds.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 bg-white">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-black text-slate-900 uppercase tracking-widest text-xs">No facilities found</p>
              <p className="text-sm font-medium mt-1">Try resetting search filters or add a new facilities needs assessment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Render the modal */}
      <FacilityNeedModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingNeed}
      />
    </div>
  );
};
