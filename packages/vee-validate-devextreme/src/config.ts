import { ValidationMessageGenerator } from './types';
import { configure } from 'vee-validate';

export interface VeeValidateConfig {
  bails: boolean;
  generateMessage: ValidationMessageGenerator;
  validateOnInput: boolean;
  validateOnChange: boolean;
  validateOnBlur: boolean;
  validateOnModelUpdate: boolean;
}

const DEFAULT_CONFIG: VeeValidateConfig = {
  generateMessage: ({ field }) => `${field} is not valid.`,
  bails: true,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
};

export let currentConfig: VeeValidateConfig = { ...DEFAULT_CONFIG };

export const getConfigDx = () => currentConfig;

const setConfigDx = (newConf: Partial<VeeValidateConfig>) => {
  currentConfig = { ...currentConfig, ...newConf };
  configure(newConf);
};

export const configureDx = setConfigDx;
