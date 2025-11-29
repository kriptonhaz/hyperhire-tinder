import type { Profile } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';

const PROFILES_ENDPOINT = 'https://raw.githubusercontent.com/kriptonhaz/hyperhire-tinder/refs/heads/main/sample-data.json';

async function fetchProfiles(): Promise<Profile[]> {
  const response = await fetch(PROFILES_ENDPOINT);
  
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  
  return response.json();
}

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}
