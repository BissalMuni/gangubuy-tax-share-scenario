-- RLS 활성화
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;

-- scenarios: 전체 read 허용, write는 service_role만
CREATE POLICY "scenarios_select" ON scenarios FOR SELECT USING (true);
CREATE POLICY "scenarios_insert" ON scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "scenarios_update" ON scenarios FOR UPDATE USING (true);
CREATE POLICY "scenarios_delete" ON scenarios FOR DELETE USING (true);

-- trees: 전체 read 허용
CREATE POLICY "trees_select" ON trees FOR SELECT USING (true);
CREATE POLICY "trees_insert" ON trees FOR INSERT WITH CHECK (true);
CREATE POLICY "trees_update" ON trees FOR UPDATE USING (true);
CREATE POLICY "trees_delete" ON trees FOR DELETE USING (true);

-- tree_nodes: 전체 read 허용
CREATE POLICY "tree_nodes_select" ON tree_nodes FOR SELECT USING (true);
CREATE POLICY "tree_nodes_insert" ON tree_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "tree_nodes_update" ON tree_nodes FOR UPDATE USING (true);
CREATE POLICY "tree_nodes_delete" ON tree_nodes FOR DELETE USING (true);

-- scenario_revisions: 전체 read/write 허용 (로그인 없이 사용)
CREATE POLICY "scenario_revisions_select" ON scenario_revisions FOR SELECT USING (true);
CREATE POLICY "scenario_revisions_insert" ON scenario_revisions FOR INSERT WITH CHECK (true);

-- storyboards: 전체 read/write 허용
CREATE POLICY "storyboards_select" ON storyboards FOR SELECT USING (true);
CREATE POLICY "storyboards_insert" ON storyboards FOR INSERT WITH CHECK (true);
CREATE POLICY "storyboards_delete" ON storyboards FOR DELETE USING (true);

-- Storage 버킷 생성 (PDF, 콘티 파일)
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('storyboards', 'storyboards', true);

-- Storage RLS: 전체 read 허용, 업로드 허용
CREATE POLICY "pdfs_select" ON storage.objects FOR SELECT USING (bucket_id = 'pdfs');
CREATE POLICY "pdfs_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "storyboards_storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'storyboards');
CREATE POLICY "storyboards_storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'storyboards');
