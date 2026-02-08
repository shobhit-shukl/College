-- Create academic_years table for College ERP

CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (end_date > start_date)
);

-- Create index on is_active for faster queries
CREATE INDEX idx_academic_years_is_active ON academic_years(is_active);

-- Create index on dates for faster queries
CREATE INDEX idx_academic_years_dates ON academic_years(start_date, end_date);

-- Insert sample data (optional)
INSERT INTO academic_years (name, start_date, end_date, is_active) VALUES
('2024-2025', '2024-04-01', '2025-03-31', false),
('2025-2026', '2025-04-01', '2026-03-31', true),
('2026-2027', '2026-04-01', '2027-03-31', false)
ON CONFLICT (name) DO NOTHING;

-- Ensure only one active academic year at a time (trigger)
CREATE OR REPLACE FUNCTION enforce_single_active_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = TRUE THEN
        UPDATE academic_years 
        SET is_active = FALSE 
        WHERE id != NEW.id AND is_active = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_year
    BEFORE INSERT OR UPDATE ON academic_years
    FOR EACH ROW
    EXECUTE FUNCTION enforce_single_active_year();

-- Comments for documentation
COMMENT ON TABLE academic_years IS 'Stores academic year information for the college ERP system';
COMMENT ON COLUMN academic_years.name IS 'Academic year name (e.g., 2025-2026)';
COMMENT ON COLUMN academic_years.start_date IS 'Start date of the academic year';
COMMENT ON COLUMN academic_years.end_date IS 'End date of the academic year';
COMMENT ON COLUMN academic_years.is_active IS 'Indicates if this is the current active academic year';
