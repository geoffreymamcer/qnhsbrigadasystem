-- 1. Create a table for public profiles (additional user data)
-- We DO NOT store passwords here. Supabase Auth handles that securely.
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Trigger to automatically create a profile record when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'staff');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 5. Donations Table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  quantity DECIMAL NOT NULL DEFAULT 0,
  unit TEXT, -- e.g., 'pails', 'bags', 'pcs'
  date_received DATE DEFAULT CURRENT_DATE NOT NULL,
  donor_name TEXT NOT NULL,
  unit_cost DECIMAL DEFAULT 0,
  total_cost DECIMAL DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policies for donations
CREATE POLICY "Allow authenticated users to read donations" 
ON donations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert donations" 
ON donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow authenticated users to update their donations" 
ON donations FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Allow authenticated users to delete their donations" 
ON donations FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- 6. Dummy Data for Testing (Donations)
-- Note: Replace 'YOUR_USER_ID' with an actual UUID from auth.users if testing RLS.
-- Or run as service_role/dashboard admin.

INSERT INTO donations (item_name, quantity, unit, date_received, donor_name, unit_cost, total_cost)
VALUES 
('Latex Paint (White)', 10, 'pails', '2026-05-01', 'Boysen Philippines', 2500, 25000),
('Cement (40kg)', 50, 'bags', '2026-05-03', 'Republic Cement', 280, 14000),
('Fluorescent Bulbs (LED)', 100, 'pcs', '2026-05-04', 'Firefly Electric', 180, 18000),
('Plywood (1/4)', 20, 'sheets', '2026-05-05', 'Local Alumni Batch ''95', 450, 9000),
('Corrugated Roofing', 30, 'sheets', '2026-05-06', 'Rotary Club of San Pablo', 1200, 36000),
('Steel Bars (10mm)', 40, 'pcs', '2026-05-07', 'Hardware Plus', 210, 8400),
('Sand and Gravel', 2, 'truckloads', '2026-05-08', 'Brgy. Ibabang Iyam Council', 3500, 7000),
('Cleaning Kits', 20, 'sets', '2026-05-09', 'Lions Club International', 800, 16000),
('Wall Clocks', 15, 'pcs', '2026-05-10', 'SM City Lucena', 350, 5250),
('Ceiling Fans', 5, 'units', '2026-05-11', 'Personal Donation - Dr. Reyes', 2200, 11000),
('Paint Brushes (4 inch)', 30, 'pcs', '2026-05-12', 'Local Paint Store', 85, 2550),
('Office Desks', 2, 'units', '2026-05-13', 'Quezon Province Gov Office', 4500, 9000);

-- 7. Accomplishments Table
CREATE TABLE accomplishments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'started but not yet completed', 'not done')),
  remarks TEXT,
  report_date DATE DEFAULT CURRENT_DATE NOT NULL,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE accomplishments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read accomplishments" 
ON accomplishments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert accomplishments" 
ON accomplishments FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow authenticated users to update their accomplishments" 
ON accomplishments FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Allow authenticated users to delete their accomplishments" 
ON accomplishments FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- 8. Dummy Data for Testing (Accomplishments)
INSERT INTO accomplishments (activity, status, remarks, report_date)
VALUES 
('Repainting of outer school perimeter walls', 'completed', 'Finished with 2 coats of white latex paint.', '2026-05-10'),
('Repair of damaged classroom ceiling in Room 102', 'started but not yet completed', 'Requires additional plywood sheets for completion.', '2026-05-11'),
('General cleaning of the school gymnasium and stage', 'completed', 'Volunteers from Batch 2010 participated.', '2026-05-11'),
('Installation of new LED bulbs in the school corridor', 'completed', 'All 20 corridor lights replaced.', '2026-05-12'),
('Landscaping and weeding of the school front garden', 'completed', 'New flowering plants donated by Parents Association.', '2026-05-12'),
('Inventory check of school textbooks and furniture', 'started but not yet completed', 'Only 50% of the classrooms verified.', '2026-05-13'),
('Fixing of broken armchairs in the Grade 10 building', 'not done', 'Waiting for carpenter volunteer availability.', '2026-05-13'),
('Cleaning and disinfection of school restrooms', 'completed', 'Used donated cleaning supplies from Rotary Club.', '2026-05-14'),
('Replacement of old faucet handles in the washing area', 'completed', 'Checked all water connections for leaks.', '2026-05-14'),
('Updating the Brigada Eskwela 2026 bulletin board', 'started but not yet completed', 'Need to print high-quality photos of activities.', '2026-05-14');

-- 9. Physical Facilities Needs Assessment Table (BE Form 01)
CREATE TABLE facility_needs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_name TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('satisfactory', 'unsatisfactory')),
  remarks TEXT,
  improvement_needed TEXT,
  materials_needed TEXT,
  manpower_needed TEXT,
  assessment_date DATE DEFAULT CURRENT_DATE NOT NULL,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE facility_needs ENABLE ROW LEVEL SECURITY;

-- Policies for facility_needs
CREATE POLICY "Allow authenticated users to read facility needs" 
ON facility_needs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert facility needs" 
ON facility_needs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Allow authenticated users to update their facility needs" 
ON facility_needs FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Allow authenticated users to delete their facility needs" 
ON facility_needs FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- 10. Dummy Data for Testing (Facility Needs)
INSERT INTO facility_needs (facility_name, condition, remarks, improvement_needed, materials_needed, manpower_needed, assessment_date)
VALUES 
('Roofs/Gutters', 'unsatisfactory', 'Clogged and rusting gutters on Building A.', 'Cleaning and patching leaks or replacement.', '2 gallons roof sealant, vulcanizing tape', '2 volunteers, school janitor', '2026-05-15'),
('Ceilings', 'unsatisfactory', 'Water-damaged plywood sagging in Grade 7 hallway.', 'Removal of damaged sheets and replacement.', '2 sheets of 1/4 plywood, ceiling nails, white paint', '1 carpenter, 1 painter', '2026-05-15'),
('Walls', 'satisfactory', 'Structurally sound. Needs light washing.', 'Minor cleaning/washing.', 'Liquid detergent, scrub brushes', '3 volunteer parents', '2026-05-15'),
('Blackboards', 'satisfactory', 'Usable condition.', 'None.', 'None', 'None', '2026-05-15'),
('Chairs/desks/tables', 'unsatisfactory', '15 armchairs have broken armrests/legs.', 'Welding of metal parts and woodwork replacement.', 'Plywood pieces, welding rods, wood glue', '1 welder, 1 carpenter', '2026-05-15'),
('Water facilities', 'unsatisfactory', 'Low water pressure; leak in the main intake pipe.', 'Locate and repair pipe leak.', '1 roll Teflon tape, PVC cement, 2m PVC pipe (1/2 inch)', '1 plumber', '2026-05-15'),
('Drainage System', 'unsatisfactory', 'Accumulated silt and plastic bottles blocking flow.', 'Declogging and clearing of open drainage channels.', 'Shovels, trash bags, utility gloves', '5 volunteers', '2026-05-15'),
('Signages', 'satisfactory', 'Visible but needs paint touch-ups.', 'Repainting lettering.', 'Small cans of paint (black, yellow)', '1 volunteer artist', '2026-05-15'),
('School garden', 'satisfactory', 'Plants are thriving. Needs weeding.', 'Weeding and soil conditioning.', 'Organic fertilizer, garden soil', '4 volunteer students/parents', '2026-05-15'),
('Lighting', 'unsatisfactory', 'Flickering bulbs in 3 classrooms.', 'Replacement of defective fluorescent tubes.', '6 LED tube lamps', '1 electrician/maintenance staff', '2026-05-15'),
('Windows', 'satisfactory', 'Glass panes intact, latches working.', 'None.', 'None', 'None', '2026-05-15'),
('Doors', 'satisfactory', 'All classroom doors are functional.', 'None.', 'None', 'None', '2026-05-15'),
('Comfort Rooms', 'unsatisfactory', 'Flush mechanisms broken in two cubicles.', 'Repair and replacement of toilet flush components.', '2 toilet repair flush valve kits', '1 plumber', '2026-05-15'),
('School Grounds', 'satisfactory', 'Clean and free of tall grass.', 'Regular lawn trimming.', 'Grass cutter fuel', '1 operator', '2026-05-15'),
('School Canteen/Clinic', 'satisfactory', 'Hygienic and well-ventilated.', 'None.', 'None', 'None', '2026-05-15'),
('School Fence/ wall', 'satisfactory', 'Sturdy. Paint is slightly faded.', 'Repainting of concrete fence panels.', '5 cans green latex paint, paint rollers', '5 volunteer parents', '2026-05-15'),
('Electricity', 'satisfactory', 'Power supply is stable across all buildings.', 'None.', 'None', 'None', '2026-05-15'),
('Alternative gate', 'unsatisfactory', 'Hinges are rusted and stuck.', 'Lubrication and structural repair of gate hinges.', 'WD-40 spray, welding rods, metal primer', '1 welder', '2026-05-15'),
('Reference Materials', 'satisfactory', 'Sufficient textbooks in the library.', 'Organization of shelves.', 'Bookends, labeling tape', '2 volunteer librarians', '2026-05-15'),
('Laboratory equipment', 'satisfactory', 'Science lab tools are stored properly.', 'None.', 'None', 'None', '2026-05-15');
