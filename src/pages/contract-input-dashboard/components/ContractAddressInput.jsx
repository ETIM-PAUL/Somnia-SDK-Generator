import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ContractAddressInput = ({ value, onChange, onValidation, isValidating }) => {
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  // Mock validation function for Somnia testnet addresses
  const validateSomniaAddress = (address) => {
    if (!address) {
      return { isValid: false, message: '' };
    }

    // Basic format validation for Ethereum-style addresses
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex?.test(address)) {
      return { 
        isValid: false, 
        message: 'Invalid address format. Must be a valid Somnia testnet address (0x...)' 
      };
    }
  };

  useEffect(() => {
    if (value) {
      const validation = validateSomniaAddress(value);
      setValidationStatus(validation?.isValid ? 'success' : validation?.isValid === undefined ? 'success' : 'error');
      setValidationMessage(validation?.message);
      
      if (onValidation) {
        onValidation(validation?.isValid, validation?.message);
      }
    } else {
      setValidationStatus(null);
      setValidationMessage('');
      if (onValidation) {
        onValidation(false, '');
      }
    }
  }, [value, onValidation]);

  const getValidationIcon = () => {
    if (isValidating) return 'Loader2';
    if (validationStatus === 'success') return 'CheckCircle2';
    if (validationStatus === 'error') return 'AlertCircle';
    return null;
  };

  const getValidationIconColor = () => {
    if (isValidating) return 'var(--color-accent)';
    if (validationStatus === 'success') return 'var(--color-success)';
    if (validationStatus === 'error') return 'var(--color-error)';
    return 'var(--color-muted-foreground)';
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          label="Smart Contract Address"
          type="text"
          placeholder="0x02e9456bA8A56e82464f53cfc8eecA6928d73a07"
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
          description="Enter the deployed smart contract address on Somnia testnet"
          error={validationStatus === 'error' ? validationMessage : ''}
          required
          className="pr-10"
        />
        
        {/* Validation Icon */}
        {getValidationIcon() && (
          <div className="absolute right-3 top-9 flex items-center">
            <Icon
              name={getValidationIcon()}
              size={18}
              color={getValidationIconColor()}
              strokeWidth={2}
              className={isValidating ? 'animate-spin' : ''}
            />
          </div>
        )}
      </div>
      {/* Success Message */}
      {validationStatus === 'success' && (
        <div className="flex items-center space-x-2 text-sm text-success">
          <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
          <span>{validationMessage}</span>
        </div>
      )}
      {/* Format Guide */}
      <div className="text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} color="var(--color-muted-foreground)" />
          <span>Format: 0x followed by 40 hexadecimal characters</span>
        </div>
      </div>
    </div>
  );
};

export default ContractAddressInput;