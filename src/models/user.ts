/*
SQL to create the user_profile table in a PostgreSQL database
-- This table is designed to store user profiles linked to the auth.users table.

create table user_profile (
  id UUID primary key references auth.users(id) on delete CASCADE,
  name TEXT not null,
  phone_number TEXT,
  total_rides INTEGER default 0,
  total_distance_km FLOAT default 0.0,
  verified BOOLEAN default false,
  total_rating FLOAT default 0.0,
  rating_count INTEGER default 0,
  created_at TIMESTAMP default NOW(),
  updated_at TIMESTAMP default NOW()
);
*/

export interface UserModel {
  id: string;
  email: string;
  profile_created: boolean;
  name?: string;
  phone_number?: string;
  total_rides?: number;
  total_distance_km?: number;
  verified?: boolean;
  total_rating?: number;
  rating_count?: number;
  created_at?: string;
  updated_at?: string;
}
