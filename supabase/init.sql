-- Create canvas table
CREATE TABLE IF NOT EXISTS canvas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create floro_nodes table
CREATE TABLE IF NOT EXISTS floro_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  position JSONB NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  canvas_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public policies - ai cũng có thể làm mọi thứ
CREATE POLICY "Public full access to nodes" ON floro_nodes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public full access to canvas" ON canvas  
  FOR ALL USING (true) WITH CHECK (true);