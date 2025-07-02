import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('admins')
    .select('privileges')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile for admin check:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ isAdmin: true, privileges: profile.privileges });
}
