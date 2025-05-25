-- Create profiles table that references Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role VARCHAR(50),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient company-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add RLS (Row Level Security) policies if needed
-- Note: These can be enabled later based on security requirements
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 