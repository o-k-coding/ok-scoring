import uuid from 'react-native-uuid';

export function generateUuid(): string {
  return uuid.v4().toString();
}
