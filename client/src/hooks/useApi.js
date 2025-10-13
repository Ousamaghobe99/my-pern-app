import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  authAPI, 
  usersAPI, 
  interfacesAPI, 
  locationsAPI, 
  maintenanceAPI 
} from '../lib/api';

// Auth hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile().then(res => res.data.data),
    retry: false,
  });
};

// Users hooks
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersAPI.getUsers(params).then(res => res.data.data),
  });
};

export const useUserStatistics = () => {
  return useQuery({
    queryKey: ['users', 'statistics'],
    queryFn: () => usersAPI.getUserStatistics().then(res => res.data.data),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => usersAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'statistics'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }) => usersAPI.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUserByMatricule = (matricule, options = {}) => {
  return useQuery({
    queryKey: ['users', 'matricule', matricule],
    queryFn: () => usersAPI.getUserByMatricule(matricule).then(res => res.data),
    enabled: !!matricule, // run only when matricule is provided
    ...options,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => usersAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'statistics'] });
    },
  });
};

// Interfaces hooks
export const useInterfaces = (params = {}) => {
  return useQuery({
    queryKey: ['interfaces', params],
    queryFn: () => interfacesAPI.getInterfaces(params).then(res => res.data),
  });
};

export const useInterface = (id) => {
  return useQuery({
    queryKey: ['interfaces', id],
    queryFn: () => interfacesAPI.getInterface(id).then(res => res.data.data),
    enabled: !!id,
  });
};

export const useInterfaceStatistics = () => {
  return useQuery({
    queryKey: ['interfaces', 'statistics'],
    queryFn: () => interfacesAPI.getInterfaceStatistics().then(res => res.data.data),
  });
};

export const useCreateInterface = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (interfaceData) => interfacesAPI.createInterface(interfaceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interfaces'] });
      queryClient.invalidateQueries({ queryKey: ['interfaces', 'statistics'] });
    },
  });
};

export const useUpdateInterface = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, interfaceData }) => interfacesAPI.updateInterface(id, interfaceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interfaces'] });
    },
  });
};

export const useMoveInterface = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, moveData }) => interfacesAPI.moveInterface(id, moveData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interfaces'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
};

export const useDeleteInterface = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => interfacesAPI.deleteInterface(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interfaces'] });
      queryClient.invalidateQueries({ queryKey: ['interfaces', 'statistics'] });
    },
  });
};

// Locations hooks
export const useLocations = (params = {}) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationsAPI.getLocations(params).then(res => res.data.data),
  });
};

export const useLocation = (id) => {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: () => locationsAPI.getLocation(id).then(res => res.data.data),
    enabled: !!id,
  });
};

export const useLocationStatistics = () => {
  return useQuery({
    queryKey: ['locations', 'statistics'],
    queryFn: () => locationsAPI.getLocationStatistics().then(res => res.data.data),
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (locationData) => locationsAPI.createLocation(locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', 'statistics'] });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, locationData }) => locationsAPI.updateLocation(id, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => locationsAPI.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', 'statistics'] });
    },
  });
};

// Maintenance hooks
export const useMaintenanceTickets = (params = {}) => {
  return useQuery({
    queryKey: ['maintenance', params],
    queryFn: () => maintenanceAPI.getTickets(params).then(res => res.data.data),
  });
};

export const useMaintenanceTicket = (id) => {
  return useQuery({
    queryKey: ['maintenance', id],
    queryFn: () => maintenanceAPI.getTicket(id).then(res => res.data.data),
    enabled: !!id,
  });
};

export const useMaintenanceStatistics = () => {
  return useQuery({
    queryKey: ['maintenance', 'statistics'],
    queryFn: () => maintenanceAPI.getMaintenanceStatistics().then(res => res.data.data),
  });
};

export const useCreateMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketData) => maintenanceAPI.createTicket(ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'statistics'] });
    },
  });
};

export const useUpdateMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ticketData }) => maintenanceAPI.updateTicket(id, ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

export const useDeleteMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => maintenanceAPI.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'statistics'] });
    },
  });
};

export const useAddMaintenanceLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, logData }) => maintenanceAPI.addLog(id, logData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

