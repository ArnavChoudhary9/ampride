import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const id = searchParams.get('id');
  const drivers = searchParams.get('drivers');
  const admins = searchParams.get('admins');

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();

  if (id) {
    const { data: user, error: userError } = await adminClient.auth.admin.getUserById(id);

    if (userError) {
      console.error(`Error fetching user with id ${id}:`, userError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ userEmails: {} });
    }

    const userEmails = user.user.email ? { [user.user.id]: user.user.email } : {};
    return NextResponse.json({ userEmails });
  }

  if (drivers === 'true') {
    const { data: driverIdsData, error: driverIdsError } = await supabase
      .from('drivers')
      .select('id');

    if (driverIdsError) {
      console.error('Error fetching driver ids:', driverIdsError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const driverIds = new Set(driverIdsData?.map(d => d.id) || []);
    if (driverIds.size === 0) {
      return NextResponse.json({ userEmails: {} });
    }

    const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const userEmails = users.users
      .filter(user => user.email && driverIds.has(user.id))
      .reduce((acc, user) => {
        if (user.email) acc[user.id] = user.email;
        return acc;
      }, {} as Record<string, string>);
      
    return NextResponse.json({ userEmails });
  }

  if (admins === 'true') {
    const { data: adminIdsData, error: adminIdsError } = await supabase
      .from('admins')
      .select('id');

    if (adminIdsError) {
      console.error('Error fetching admin ids:', adminIdsError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const adminIds = new Set(adminIdsData?.map(a => a.id) || []);
    if (adminIds.size === 0) {
      return NextResponse.json({ userEmails: {} });
    }

    const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const userEmails = users.users
      .filter(user => user.email && adminIds.has(user.id))
      .reduce((acc, user) => {
        if (user.email) acc[user.id] = user.email;
        return acc;
      }, {} as Record<string, string>);
      
    return NextResponse.json({ userEmails });
  }

  if (admins === 'false') {
    const { data: adminIdsData, error: adminIdsError } = await supabase
      .from('admins')
      .select('id');

    if (adminIdsError) {
      console.error('Error fetching admin ids:', adminIdsError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const adminIds = new Set(adminIdsData?.map(a => a.id) || []);
    
    const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const userEmails = users.users
      .filter(user => user.email && !adminIds.has(user.id))
      .reduce((acc, user) => {
        if (user.email) acc[user.id] = user.email;
        return acc;
      }, {} as Record<string, string>);
      
    return NextResponse.json({ userEmails });
  }

  const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  const userEmails = users.users.reduce((acc, user) => {
    if (user.email) acc[user.id] = user.email;
    return acc;
  }, {} as Record<string, string>);
  return NextResponse.json({ userEmails });
}
