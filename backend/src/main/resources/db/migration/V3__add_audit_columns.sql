-- Add updated_at column to companies table
ALTER TABLE public.companies
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to set updated_at same as created_at
UPDATE public.companies
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL after setting values
ALTER TABLE public.companies
ALTER COLUMN updated_at SET NOT NULL;

-- Add updated_at column to users table
ALTER TABLE public.users
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to set updated_at same as created_at
UPDATE public.users
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL after setting values
ALTER TABLE public.users
ALTER COLUMN updated_at SET NOT NULL; 