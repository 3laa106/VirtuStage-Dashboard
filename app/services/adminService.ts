import { API_ENDPOINTS } from '../config/api';
import type {
  UpdateManagedUserStatusRequest,
  UpdateScenarioRequest,
} from '../types/admin.dto';
import type {
  AdminPanelData,
  ManagedUser,
  TrainingScenario,
} from '../types/admin';
import type { BackendUserDto } from '../types/auth';
import api from '../utils/api';

export const getAdminPanelData = async (): Promise<AdminPanelData> => {
  const { data } = await api.get<AdminPanelData>(API_ENDPOINTS.admin.data);
  return data;
};

export const updateManagedUser = async (
  id: string,
  changes: { disabled: boolean },
) => {
  const request: UpdateManagedUserStatusRequest = {
    is_active: !changes.disabled,
  };
  const { data } = await api.patch<BackendUserDto>(
    API_ENDPOINTS.admin.userStatus(id),
    request,
  );
  return data;
};

export const updateScenario = async (id: string, enabled: boolean) => {
  const request: UpdateScenarioRequest = {
    enabled,
  };
  const { data } = await api.patch<TrainingScenario>(
    API_ENDPOINTS.admin.scenario(id),
    request,
  );
  return data;
};
