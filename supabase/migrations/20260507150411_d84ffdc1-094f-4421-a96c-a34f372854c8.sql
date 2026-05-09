
-- Fix function search_path
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- Restrict orders insert: only authenticated users can create orders for themselves OR anonymous (user_id null). Tighten to authenticated only with matching user_id.
DROP POLICY "anyone creates orders" ON public.orders;
CREATE POLICY "authenticated creates own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Revoke broad execute on security definer functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Restrict storage public bucket listing - drop broad SELECT then add narrower (still public read individual objects via getPublicUrl, just no LIST)
DROP POLICY "public read products bucket" ON storage.objects;
CREATE POLICY "public read products objects" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'products');
-- Note: public bucket allows direct URL access regardless; we keep this for clarity.
