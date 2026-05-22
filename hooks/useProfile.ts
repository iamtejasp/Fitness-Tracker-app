import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfile, updateProfile } from '@/api/users.api';
import { useAuth } from '@/context/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
  });
}

export function useUpdateProfileMutation() {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(queryKeys.profile, user);
      queryClient.setQueryData(queryKeys.authUser, user);
    },
  });
}
