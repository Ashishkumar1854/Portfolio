import { useMemo } from 'react';
import useApi from './useApi';

const DEFAULT_SETTINGS = {
  resourcesEnabled: true,
  caseStudiesEnabled: true,
  lockedResourceIds: [],
  lockedCaseStudyIds: [],
};

const useModuleSettings = () => {
  const { data, loading, error } = useApi('/api/module-settings', DEFAULT_SETTINGS);
  const settings = useMemo(() => ({
    ...DEFAULT_SETTINGS,
    ...(data || {}),
  }), [data]);

  return {
    settings,
    loading,
    error,
  };
};

export default useModuleSettings;
